interface Transaction {
  occurred_at: string
  description: string
  amount: number
  raw_merchant: string
}

export function parseCSV(content: string): Transaction[] {
  const lines = content.trim().split('\n')
  const transactions: Transaction[] = []

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Try common formats: date,description,amount or date;description;amount
    const parts = line.includes(';') ? line.split(';') : line.split(',')
    
    if (parts.length < 3) continue

    const date = parseDate(parts[0].trim())
    const description = parts[1].trim().replace(/"/g, '')
    const amount = parseAmount(parts[2].trim())

    if (date && description && amount !== null) {
      transactions.push({
        occurred_at: date,
        description,
        amount,
        raw_merchant: extractMerchant(description)
      })
    }
  }

  return transactions
}

function parseDate(str: string): string | null {
  // Try DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY
  const formats = [
    /(\d{2})\/(\d{2})\/(\d{4})/,  // DD/MM/YYYY
    /(\d{4})-(\d{2})-(\d{2})/,    // YYYY-MM-DD
    /(\d{2})-(\d{2})-(\d{4})/     // DD-MM-YYYY
  ]

  for (const format of formats) {
    const match = str.match(format)
    if (match) {
      if (format === formats[1]) {
        return `${match[1]}-${match[2]}-${match[3]}`
      } else {
        return `${match[3]}-${match[2]}-${match[1]}`
      }
    }
  }
  return null
}

function parseAmount(str: string): number | null {
  // Remove currency symbols and spaces
  const cleaned = str.replace(/[€$£\s]/g, '').replace(',', '.')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

function extractMerchant(description: string): string {
  // Remove common prefixes
  let merchant = description
    .replace(/^(PAGAMENTO|ADDEBITO|BONIFICO|CARTA|POS)\s+/i, '')
    .replace(/\s+\d{2}\/\d{2}.*$/, '')
    .trim()

  // Take first meaningful part
  const parts = merchant.split(/[\s-]+/)
  return parts[0] || merchant
}
