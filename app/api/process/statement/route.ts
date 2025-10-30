import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { parseCSV } from '@/lib/parsers/csv'
import { parsePDF } from '@/lib/parsers/pdf'
import { normalizeMerchant, getMerchantTitle } from '@/lib/merchants'
import { detectSubscriptions, detectInstallmentPlans } from '@/lib/detection'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { sourceId, filePath } = await req.json()

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('statements')
      .download(filePath)

    if (downloadError) throw downloadError

    // Parse file
    let parsedTransactions
    if (filePath.endsWith('.pdf')) {
      const buffer = await fileData.arrayBuffer()
      parsedTransactions = await parsePDF(Buffer.from(buffer))
    } else {
      const content = await fileData.text()
      parsedTransactions = parseCSV(content)
    }

    // Get source to get user_id
    const { data: source } = await supabase
      .from('sources')
      .select('user_id')
      .eq('id', sourceId)
      .single()

    if (!source) throw new Error('Source not found')

    // Delete all existing transactions for this user
    await supabase
      .from('transactions')
      .delete()
      .eq('user_id', source.user_id)

    // Delete all existing subscriptions for this user
    await supabase
      .from('subscriptions')
      .delete()
      .eq('user_id', source.user_id)

    // Normalize merchants and prepare transactions
    const uploadId = Date.now()
    const transactions = parsedTransactions.map((t, idx) => {
      const normalized = normalizeMerchant(t.raw_merchant)
      console.log(`Merchant: "${t.raw_merchant}" → "${normalized}"`)
      return {
        user_id: source.user_id,
        source_id: sourceId,
        occurred_at: t.occurred_at,
        description: t.description,
        raw_merchant: t.raw_merchant,
        merchant_canonical: normalized,
        amount: t.amount,
        currency: 'EUR',
        hash: `${source.user_id}-${t.occurred_at}-${t.amount}-${t.description}-${uploadId}-${idx}`
      }
    })

    // Insert transactions
    const { error: insertError } = await supabase
      .from('transactions')
      .insert(transactions)

    if (insertError) {
      console.error('Insert error:', insertError)
      throw insertError
    }

    console.log(`Processed ${transactions.length} transactions from statement`)

    // Trigger email scan to add email transactions
    try {
      const { data: emailSources } = await supabase
        .from('sources')
        .select('*')
        .eq('user_id', source.user_id)
        .in('type', ['gmail', 'outlook'])
        .eq('status', 'active')

      if (emailSources && emailSources.length > 0) {
        for (const emailSource of emailSources) {
          const endpoint = emailSource.type === 'gmail' ? '/api/scan/gmail' : '/api/scan/outlook'
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: source.user_id })
          }).catch(err => console.error(`Email scan error:`, err))
        }
      }
    } catch (err) {
      console.error('Email scan trigger error:', err)
    }

    // Get all user transactions for detection (statement + emails)
    const { data: allTxs } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', source.user_id)
      .order('occurred_at', { ascending: true })

    let detectedCount = 0
    if (allTxs) {
      console.log(`Analyzing ${allTxs.length} total transactions for user`)
      console.log('Sample transactions:', allTxs.slice(0, 3).map(t => ({ 
        date: t.occurred_at, 
        description: t.description, 
        amount: t.amount 
      })))
      
      // Detect subscriptions
      const detected = detectSubscriptions(allTxs)
      detectedCount = detected.length
      
      console.log(`Detected ${detectedCount} subscriptions:`, detected.map(s => ({
        merchant: s.merchant_canonical,
        amount: s.amount,
        periodicity: s.periodicity
      })))

      // Insert subscriptions
      for (const sub of detected) {
        // For unknown payments, include amount in merchant_canonical to allow multiple subscriptions
        const merchantKey = sub.merchant_canonical.startsWith('unknown-')
          ? `${sub.merchant_canonical}-${sub.amount.toFixed(2)}`
          : sub.merchant_canonical
        
        const { error } = await supabase
          .from('subscriptions')
          .insert({
            user_id: source.user_id,
            merchant_canonical: merchantKey,
            title: getMerchantTitle(sub.merchant_canonical),
            periodicity: sub.periodicity,
            amount: sub.amount,
            confidence: sub.confidence,
            first_seen: sub.first_seen,
            last_seen: sub.last_seen,
            status: sub.is_active ? 'active' : 'cancelled'
          })
        
        if (error) {
          console.error('Error inserting subscription:', error)
        } else {
          console.log('✅ Inserted subscription:', sub.merchant_canonical)
        }
      }
      
      // Detect installment plans
      const installmentPlans = detectInstallmentPlans(allTxs)
      console.log(`Inserting ${installmentPlans.length} installment plans...`)
      
      // Insert installment plans as subscriptions with special flag
      for (const plan of installmentPlans) {
        const uniqueKey = `${plan.merchant_canonical}-${plan.installment_amount.toFixed(2)}`
        const { data, error } = await supabase
          .from('subscriptions')
          .insert({
            user_id: source.user_id,
            merchant_canonical: uniqueKey,
            title: getMerchantTitle(plan.merchant_canonical) + ' (Piano rateale)',
            periodicity: 'monthly',
            amount: plan.installment_amount,
            confidence: 1.0,
            first_seen: plan.first_payment,
            last_seen: plan.last_payment,
            status: 'active',
            meta: {
              is_installment_plan: true,
              is_completed: plan.is_completed,
              total_amount: plan.total_amount,
              installments_total: plan.installments_total,
              installments_paid: plan.installments_paid,
              installments_remaining: plan.installments_remaining
            }
          })
        
        if (error) {
          console.error('Error inserting installment plan:', error)
        } else {
          console.log('Inserted installment plan:', plan.merchant_canonical)
        }
      }
    }

    // Update source status
    await supabase
      .from('sources')
      .update({ status: 'active' })
      .eq('id', sourceId)

    // If no transactions found, save PDF for analysis
    if (transactions.length === 0) {
      try {
        // Copy failed PDF to failed-statements bucket
        const { data: fileData } = await supabase.storage
          .from('statements')
          .download(filePath)
        
        if (fileData) {
          const failedFileName = `${Date.now()}-${filePath.split('/').pop()}`
          await supabase.storage
            .from('failed-statements')
            .upload(failedFileName, fileData, {
              contentType: 'application/pdf',
              upsert: false
            })
          
          console.log('Saved failed PDF for analysis:', failedFileName)
        }
      } catch (err) {
        console.error('Failed to save failed PDF:', err)
      }
    }

    return NextResponse.json({ 
      success: true, 
      transactions: transactions.length,
      subscriptions: detectedCount
    })
  } catch (error: any) {
    console.error('Processing error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
