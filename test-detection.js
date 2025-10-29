// Test algoritmo rilevamento abbonamenti
const { detectSubscriptions } = require('./lib/detection')

// Esempio transazioni
const transactions = [
  { date: '2024-01-15', description: 'NETFLIX.COM', amount: -12.99 },
  { date: '2024-02-15', description: 'NETFLIX.COM', amount: -12.99 },
  { date: '2024-03-15', description: 'NETFLIX.COM', amount: -12.99 },
  { date: '2024-01-10', description: 'SPOTIFY AB', amount: -9.99 },
  { date: '2024-02-10', description: 'SPOTIFY AB', amount: -9.99 },
  { date: '2024-01-20', description: 'AMAZON PRIME', amount: -4.99 },
]

console.log('Testing detection algorithm...\n')
const subscriptions = detectSubscriptions(transactions)

console.log('Detected subscriptions:')
subscriptions.forEach(sub => {
  console.log(`- ${sub.merchant}: €${sub.amount} (${sub.periodicity})`)
})
