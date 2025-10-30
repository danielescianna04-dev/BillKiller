interface Transaction {
  occurred_at: string
  amount: number
  merchant_canonical: string
  description: string
}

interface Subscription {
  merchant_canonical: string
  amount: number
  periodicity: 'monthly' | 'yearly' | 'quarterly' | 'semiannual' | 'unknown'
  confidence: number
  first_seen: string
  last_seen: string
  is_installment?: boolean
  installments_total?: number | null
  installments_paid?: number | null
  installments_remaining?: number | null
  is_active?: boolean
}

interface InstallmentPlan {
  merchant_canonical: string
  total_amount: number
  installment_amount: number
  installments_total: number
  installments_paid: number
  installments_remaining: number
  first_payment: string
  last_payment: string
  is_completed: boolean
}

export function detectInstallmentPlans(transactions: Transaction[]): InstallmentPlan[] {
  console.log(`\nDetecting installment plans from ${transactions.length} transactions`)
  
  // Only look at Klarna, Scalapay, PayPal installments
  const installmentProviders = ['klarna', 'scalapay', 'paypal']
  const installmentTxs = transactions.filter(t => 
    installmentProviders.some(p => t.merchant_canonical.includes(p))
  )
  
  if (installmentTxs.length === 0) {
    console.log('No installment transactions found')
    return []
  }
  
  // Group by similar amounts (same installment plan)
  const plans: InstallmentPlan[] = []
  const processed = new Set<string>()
  
  for (const tx of installmentTxs) {
    if (processed.has(tx.occurred_at + tx.amount)) continue
    
    const amount = Math.abs(tx.amount)
    // Find all transactions with same amount (±5%)
    const samePlan = installmentTxs.filter(t => {
      const tAmount = Math.abs(t.amount)
      return Math.abs(tAmount - amount) / amount < 0.05
    })
    
    if (samePlan.length >= 2) {
      samePlan.sort((a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime())
      
      // Typically 3 installments for Klarna/Scalapay
      const totalInstallments = samePlan.length === 2 ? 3 : samePlan.length
      const remaining = totalInstallments - samePlan.length
      
      // If last payment is >60 days ago, assume plan is completed
      const daysSinceLastPayment = Math.round(
        (Date.now() - new Date(samePlan[samePlan.length - 1].occurred_at).getTime()) / (1000 * 60 * 60 * 24)
      )
      const isCompleted = remaining === 0 || daysSinceLastPayment > 60
      
      plans.push({
        merchant_canonical: tx.merchant_canonical,
        total_amount: amount * totalInstallments,
        installment_amount: amount,
        installments_total: totalInstallments,
        installments_paid: samePlan.length,
        installments_remaining: isCompleted ? 0 : remaining,
        first_payment: samePlan[0].occurred_at,
        last_payment: samePlan[samePlan.length - 1].occurred_at,
        is_completed: isCompleted
      })
      
      samePlan.forEach(t => processed.add(t.occurred_at + t.amount))
      console.log(`  ✅ Found plan: ${amount.toFixed(2)} x ${samePlan.length}/${totalInstallments} (${remaining} remaining)`)
    }
  }
  
  console.log(`Detected ${plans.length} installment plans`)
  return plans
}

export function detectSubscriptions(transactions: Transaction[]): Subscription[] {
  console.log(`Detection: analyzing ${transactions.length} transactions`)
  
  // Blacklist: exclude P2P transfers, installments, generic merchants
  const blacklist = [
    'cliente', 'transfer', 'accredita', 'prelievo', 'conversione', 'commissione',
    'klarna', 'scalapay', 'paypal', 'satispay', 'revolut',
    // Generic places (not subscriptions)
    'bar', 'tabaccheria', 'conad', 'coop', 'iper', 'lidl', 'famila', 'pam',
    'macelleria', 'farmacia', 'pasticceria', 'pizzeria', 'rosticceria',
    'ristorante', 'trattoria', 'osteria', 'birreria', 'cornetteria',
    'supermercato', 'alimentari', 'minimarket', 'mini',
    // Common Italian names
    'cristian', 'simone', 'eugen', 'dragoon', 'daniele', 'davide', 'luca', 
    'lorenzo', 'tommaso', 'florian', 'roberto', 'gianluca', 'sebastiano',
    'domenico', 'alberto', 'thomas', 'sara', 'carlotta', 'beatrice', 'matilde',
    'jhon', 'nelly', 'farhan', 'omaima', 'fengping', 'karanca', 'rivas',
    // Installment services
    'swappie'
  ]
  
  // Group by merchant
  const groups = transactions.reduce((acc, t) => {
    // For unknown payments (Apple Pay, Google Pay, POS), group by merchant + amount
    // This allows detecting multiple subscriptions paid with the same method
    const key = t.merchant_canonical.startsWith('unknown-') 
      ? `${t.merchant_canonical}-${Math.abs(t.amount).toFixed(2)}`
      : t.merchant_canonical
    
    if (!acc[key]) acc[key] = []
    acc[key].push(t)
    return acc
  }, {} as Record<string, Transaction[]>)

  console.log('Merchants found:', Object.keys(groups).map(m => `${m} (${groups[m].length} txs)`))

  const subscriptions: Subscription[] = []

  for (const [merchant, txs] of Object.entries(groups)) {
    console.log(`\nAnalyzing ${merchant}: ${txs.length} transactions`)
    
    // Skip blacklisted merchants
    if (blacklist.includes(merchant.toLowerCase())) {
      console.log(`  ❌ Skipped: blacklisted merchant (P2P/installments/generic)`)
      continue
    }
    
    // Skip P2P transfers and ATM withdrawals based on description keywords
    const hasP2PKeywords = txs.some(t => 
      /bonifico\s+(a|da|verso|per)|bonif\.\s+|girofondi|trasferimento\s+(a|da|verso)|prelievo\s+(di\s+)?contant|atm|bancomat/i.test(t.description)
    )
    if (hasP2PKeywords) {
      console.log(`  ❌ Skipped: P2P transfer or ATM withdrawal detected in description`)
      continue
    }
    
    if (txs.length < 2) {
      console.log(`  ❌ Skipped: need at least 2 transactions`)
      continue
    }

    // Sort by date (ascending for grouping logic)
    txs.sort((a, b) => new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime())

    // Group similar amounts (within 10% tolerance) to separate recurring bills from one-off charges
    const amounts = txs.map(t => Math.abs(t.amount))
    const amountGroups: number[][] = []
    
    for (const amount of amounts) {
      let foundGroup = false
      for (const group of amountGroups) {
        const groupAvg = group.reduce((a, b) => a + b, 0) / group.length
        if (Math.abs(amount - groupAvg) / groupAvg < 0.1) {
          group.push(amount)
          foundGroup = true
          break
        }
      }
      if (!foundGroup) {
        amountGroups.push([amount])
      }
    }
    
    // Use the largest group (most recurring pattern)
    const largestGroup = amountGroups.sort((a, b) => b.length - a.length)[0]
    
    if (largestGroup.length < 2) {
      console.log(`  ❌ Skipped: need at least 2 recurring transactions (found ${largestGroup.length})`)
      continue
    }
    
    // Calculate stability on the recurring group only
    const avgAmount = largestGroup.reduce((a, b) => a + b, 0) / largestGroup.length
    const stdDev = Math.sqrt(largestGroup.reduce((sum, a) => sum + Math.pow(a - avgAmount, 2), 0) / largestGroup.length)
    const stability = stdDev / avgAmount
    
    console.log(`  Amounts: ${amounts.join(', ')} → recurring group: ${largestGroup.join(', ')} (${largestGroup.length} txs)`)
    console.log(`  Recurring avg=${avgAmount.toFixed(2)}, stability=${stability.toFixed(2)}`)

    // Calculate intervals only for transactions in the recurring group
    const recurringTxs = txs.filter(t => {
      const amount = Math.abs(t.amount)
      return Math.abs(amount - avgAmount) / avgAmount < 0.1
    })
    
    // Group transactions within 3 days as single payment attempt (for failed payments)
    const paymentGroups: typeof recurringTxs = []
    let currentGroup = [recurringTxs[0]]
    
    for (let i = 1; i < recurringTxs.length; i++) {
      const daysDiff = Math.round(
        (new Date(recurringTxs[i].occurred_at).getTime() - new Date(recurringTxs[i-1].occurred_at).getTime()) 
        / (1000 * 60 * 60 * 24)
      )
      
      if (daysDiff <= 3) {
        currentGroup.push(recurringTxs[i])
      } else {
        // Use first transaction of group as representative
        paymentGroups.push(currentGroup[0])
        currentGroup = [recurringTxs[i]]
      }
    }
    paymentGroups.push(currentGroup[0])
    
    console.log(`  Grouped ${recurringTxs.length} transactions into ${paymentGroups.length} payment attempts`)
    
    if (paymentGroups.length < 2) {
      console.log(`  ❌ Skipped: need at least 2 payment attempts (found ${paymentGroups.length})`)
      continue
    }
    
    const intervals: number[] = []
    for (let i = 1; i < paymentGroups.length; i++) {
      const days = Math.round(
        (new Date(paymentGroups[i].occurred_at).getTime() - new Date(paymentGroups[i-1].occurred_at).getTime()) 
        / (1000 * 60 * 60 * 24)
      )
      intervals.push(days)
    }


    if (stability > 0.20) {
      console.log(`  ❌ Skipped: amount too variable (${(stability * 100).toFixed(0)}% variation)`)
      continue
    }

    // Detect periodicity
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length
    console.log(`  Intervals (days): ${intervals.join(', ')} → avg=${avgInterval.toFixed(0)}`)
    
    // With only 2 payments, require stricter tolerance
    const tolerance = paymentGroups.length === 2 ? 3 : 7
    
    let periodicity: Subscription['periodicity'] = 'unknown'
    let confidence = 0.5

    if (Math.abs(avgInterval - 30) < tolerance) {
      periodicity = 'monthly'
      confidence = 0.9
      console.log(`  ✅ Detected: MONTHLY (confidence ${confidence})`)
    } else if (Math.abs(avgInterval - 365) < tolerance * 2) {
      periodicity = 'yearly'
      confidence = 0.85
      console.log(`  ✅ Detected: YEARLY (confidence ${confidence})`)
    } else if (Math.abs(avgInterval - 90) < tolerance) {
      periodicity = 'quarterly'
      confidence = 0.8
      console.log(`  ✅ Detected: QUARTERLY (confidence ${confidence})`)
    } else if (Math.abs(avgInterval - 180) < tolerance) {
      periodicity = 'semiannual'
      confidence = 0.75
      console.log(`  ✅ Detected: SEMIANNUAL (confidence ${confidence})`)
    } else {
      console.log(`  ❌ No clear periodicity (avg interval ${avgInterval.toFixed(0)} days)`)
    }

    // Boost confidence for subscription keywords
    const hasKeyword = txs.some(t => 
      /subscription|abbonamento|rinnovo|plan|sepa/i.test(t.description)
    )
    if (hasKeyword) confidence = Math.min(confidence + 0.1, 1)
    
    // Check if this is an installment plan (fixed number of payments)
    let isInstallment = false
    let installmentsTotal = null
    let installmentsPaid = null
    
    // Check for installment keywords in descriptions with X/Y pattern nearby
    for (const t of recurringTxs) {
      const match = t.description.match(/\b(?:rata|rate|installment)\s*(\d+)\s*(?:di|\/|of)\s*(\d+)/i)
      if (match) {
        isInstallment = true
        installmentsPaid = parseInt(match[1])
        installmentsTotal = parseInt(match[2])
        console.log(`  📋 Installment plan detected: rata ${installmentsPaid}/${installmentsTotal}`)
        break
      }
    }

    if (confidence > 0.6) {
      // Use the last transaction amount (most recent, since sorted ascending)
      const lastAmount = Math.abs(recurringTxs[recurringTxs.length - 1].amount)
      
      const installmentsRemaining = isInstallment && installmentsTotal && installmentsPaid 
        ? installmentsTotal - installmentsPaid 
        : null
      
      // Check if subscription is still active (last payment within 60 days)
      const daysSinceLastPayment = Math.round(
        (Date.now() - new Date(recurringTxs[recurringTxs.length - 1].occurred_at).getTime()) / (1000 * 60 * 60 * 24)
      )
      const isActive = daysSinceLastPayment <= 60
      
      if (!isActive) {
        console.log(`  ⚠️ Subscription expired (last payment ${daysSinceLastPayment} days ago)`)
      }
      
      console.log(`  ✅ ADDED as ${isInstallment ? 'installment plan' : 'subscription'}! (last amount: €${lastAmount.toFixed(2)})`)
      
      // Extract original merchant_canonical (remove amount suffix for unknown-*)
      const originalMerchant = merchant.match(/^(unknown-[a-z]+)-[\d.]+$/)
        ? merchant.substring(0, merchant.lastIndexOf('-'))  // "unknown-pos-5.99" → "unknown-pos"
        : merchant
      
      subscriptions.push({
        merchant_canonical: originalMerchant,
        amount: lastAmount,
        periodicity,
        confidence,
        first_seen: recurringTxs[0].occurred_at,
        last_seen: recurringTxs[recurringTxs.length - 1].occurred_at,
        is_installment: isInstallment,
        installments_total: installmentsTotal,
        installments_paid: installmentsPaid,
        installments_remaining: installmentsRemaining,
        is_active: isActive
      })
    } else {
      console.log(`  ❌ Confidence too low (${confidence})`)
    }
  }

  console.log(`\nDetection complete: ${subscriptions.length} subscriptions found`)
  return subscriptions
}
