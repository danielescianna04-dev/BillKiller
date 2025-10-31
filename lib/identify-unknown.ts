import { createClient } from '@supabase/supabase-js'

interface Transaction {
  id: string
  occurred_at: string
  amount: number
  merchant_canonical: string
  description: string
}

interface UnknownSubscription {
  id: string
  merchant_canonical: string
  amount: number
  last_seen: string
}

export async function identifyUnknownSubscriptions(
  userId: string,
  supabase: any
) {
  console.log('\n🔍 Identifying unknown subscriptions...')

  // Get unknown subscriptions
  const { data: unknownSubs } = await supabase
    .from('subscriptions')
    .select('id, merchant_canonical, amount, last_seen')
    .eq('user_id', userId)
    .like('merchant_canonical', 'unknown-%')
    .eq('status', 'active')

  if (!unknownSubs || unknownSubs.length === 0) {
    console.log('No unknown subscriptions to identify')
    return { identified: 0, methods: [] }
  }

  console.log(`Found ${unknownSubs.length} unknown subscriptions`)

  // Remove duplicates: keep only the most recent subscription per merchant
  const uniqueSubs = new Map<string, any>()
  for (const sub of unknownSubs) {
    const existing = uniqueSubs.get(sub.merchant_canonical)
    if (!existing || new Date(sub.created_at) > new Date(existing.created_at)) {
      if (existing) {
        // Delete older duplicate
        await supabase.from('subscriptions').delete().eq('id', existing.id)
        console.log(`  🗑️ Deleted duplicate: ${existing.merchant_canonical}`)
      }
      uniqueSubs.set(sub.merchant_canonical, sub)
    } else {
      // Delete this duplicate
      await supabase.from('subscriptions').delete().eq('id', sub.id)
      console.log(`  🗑️ Deleted duplicate: ${sub.merchant_canonical}`)
    }
  }

  let identified = 0
  const methods: string[] = []

  for (const sub of Array.from(uniqueSubs.values())) {
    console.log(`\nAnalyzing: ${sub.merchant_canonical} €${sub.amount}`)

    // Method #1: Match by date + amount with email transactions
    const emailMatch = await matchByEmailTransaction(userId, sub, supabase)
    if (emailMatch) {
      await updateSubscription(sub.id, emailMatch, supabase, 'email')
      identified++
      methods.push('email')
      console.log(`  ✅ Identified via email: ${emailMatch}`)
      continue
    }

    // Method #2: Analyze PDF description for merchant hints
    const descriptionMatch = await matchByDescription(userId, sub, supabase)
    if (descriptionMatch) {
      await updateSubscription(sub.id, descriptionMatch, supabase, 'description')
      identified++
      methods.push('description')
      console.log(`  ✅ Identified via description: ${descriptionMatch}`)
      continue
    }

    console.log(`  ❌ Could not identify`)
  }

  console.log(`\n✅ Identified ${identified}/${unknownSubs.length} unknown subscriptions`)
  return { identified, methods }
}

async function matchByEmailTransaction(
  userId: string,
  sub: UnknownSubscription,
  supabase: any
): Promise<string | null> {
  // Get unknown transactions
  const baseMerchant = sub.merchant_canonical.split('-').slice(0, 2).join('-') // "unknown-pos-5.99" -> "unknown-pos"
  
  const { data: unknownTxs } = await supabase
    .from('transactions')
    .select('occurred_at, amount')
    .eq('user_id', userId)
    .eq('merchant_canonical', baseMerchant)
    .order('occurred_at', { ascending: false })
    .limit(3)

  if (!unknownTxs || unknownTxs.length === 0) return null

  // For each unknown transaction, look for email transaction with similar amount and date
  for (const unknownTx of unknownTxs) {
    const txDate = new Date(unknownTx.occurred_at)
    const minDate = new Date(txDate)
    minDate.setDate(minDate.getDate() - 3) // -3 days
    const maxDate = new Date(txDate)
    maxDate.setDate(maxDate.getDate() + 3) // +3 days

    const exactAmount = Math.abs(unknownTx.amount) // Match esatto, nessuna tolleranza

    const { data: emailTxs } = await supabase
      .from('transactions')
      .select('merchant_canonical, amount, occurred_at')
      .eq('user_id', userId)
      .not('merchant_canonical', 'like', 'unknown-%')
      .not('merchant_canonical', 'like', 'canone-%')
      .not('merchant_canonical', 'like', 'ord-%')
      .not('merchant_canonical', 'like', 'bollo%')
      .not('merchant_canonical', 'like', 'imposta%')
      .not('merchant_canonical', 'like', 'sdd%')
      .not('merchant_canonical', 'in', '("sottoscrizione","revolut","paypal","vinted","pagopa")')
      .gte('occurred_at', minDate.toISOString().split('T')[0])
      .lte('occurred_at', maxDate.toISOString().split('T')[0])
      .eq('amount', -exactAmount) // Match esatto

    if (emailTxs && emailTxs.length > 0) {
      // Found match! Return the merchant
      const match = emailTxs[0]
      console.log(`    Match found: ${match.merchant_canonical} €${Math.abs(match.amount)} on ${match.occurred_at}`)
      return match.merchant_canonical
    }
  }

  return null
}

async function matchByDescription(
  userId: string,
  sub: UnknownSubscription,
  supabase: any
): Promise<string | null> {
  const baseMerchant = sub.merchant_canonical.split('-').slice(0, 2).join('-')
  
  const { data: txs } = await supabase
    .from('transactions')
    .select('description')
    .eq('user_id', userId)
    .eq('merchant_canonical', baseMerchant)
    .limit(5)

  if (!txs || txs.length === 0) return null

  // Look for merchant hints in descriptions
  const merchantPatterns = [
    { pattern: /apple\.com|icloud/i, merchant: 'apple' },
    { pattern: /google|youtube/i, merchant: 'google' },
    { pattern: /spotify/i, merchant: 'spotify' },
    { pattern: /netflix/i, merchant: 'netflix' },
    { pattern: /amazon/i, merchant: 'amazon' },
    { pattern: /microsoft/i, merchant: 'microsoft' },
    { pattern: /adobe/i, merchant: 'adobe' },
    { pattern: /disney/i, merchant: 'disney' },
    { pattern: /playstation|psn/i, merchant: 'playstation' },
  ]

  for (const tx of txs) {
    for (const { pattern, merchant } of merchantPatterns) {
      if (pattern.test(tx.description)) {
        console.log(`    Found in description: "${tx.description.substring(0, 50)}..."`)
        return merchant
      }
    }
  }

  return null
}

async function updateSubscription(
  subscriptionId: string,
  newMerchant: string,
  supabase: any,
  method: 'email' | 'description'
) {
  const { getMerchantTitle } = await import('./merchants')
  
  await supabase
    .from('subscriptions')
    .update({
      merchant_canonical: newMerchant,
      title: getMerchantTitle(newMerchant),
      meta: { identification_method: method }
    })
    .eq('id', subscriptionId)
}
