import PDFParser from 'pdf2json'

interface Transaction {
  occurred_at: string
  description: string
  amount: number
  raw_merchant: string
}

export async function parsePDF(buffer: Buffer): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    const pdfParser = new (PDFParser as any)(null, 1)
    
    pdfParser.on('pdfParser_dataError', (errData: any) => {
      console.error('PDF parse error:', errData.parserError)
      resolve([]) // Return empty array on error
    })
    
    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      try {
        // Extract text from all pages
        let fullText = ''
        if (pdfData.Pages) {
          pdfData.Pages.forEach((page: any) => {
            if (page.Texts) {
              page.Texts.forEach((text: any) => {
                if (text.R) {
                  text.R.forEach((r: any) => {
                    if (r.T) {
                      fullText += decodeURIComponent(r.T) + ' '
                    }
                  })
                }
              })
              fullText += '\n'
            }
          })
        }
        
        const transactions: Transaction[] = []
        const isRevolut = fullText.includes('Revolut Bank UAB') || fullText.includes('Transazioni del conto')
        const isCreditAgricole = fullText.includes('Crédit Agricole') || fullText.includes('CREDIT AGRICOLE')

        if (isRevolut) {
          // Revolut: parse entire text with global regex
          const regex = /(\d{1,2}\s+\w{3}\s+\d{4})\s+(.+?)\s+€([\d,]+\.?\d*)\s+€([\d,]+\.?\d*)/g
          let match
          
          while ((match = regex.exec(fullText)) !== null) {
            let description = match[2].trim()
            
            // Skip internal transfers and headers
            if (description.includes('Pagamento da parte di') || 
                description.includes('Pagamento a favore di') ||
                description.includes('To investment account') ||
                description.includes('From investment account') ||
                description.includes('Pagina') ||
                description.includes('Revolut Bank UAB') ||
                description.length < 3) {
              continue
            }
            
            const date = parseRevolutDate(match[1])
            description = description.split(/\s{2,}/)[0].substring(0, 100)
            const outAmount = parseFloat(match[3].replace(',', ''))
            
            if (date && outAmount > 0) {
              transactions.push({
                occurred_at: date,
                description,
                amount: -outAmount,
                raw_merchant: extractMerchant(description)
              })
            }
          }
        } else if (isCreditAgricole) {
          // Credit Agricole format: "DD.MM.YY DD.MM.YY AMOUNT DESCRIPTION"
          const regex = /(\d{2}\.\d{2}\.\d{2})\s+\d{2}\.\d{2}\.\d{2}\s+([\d,]+)\s+(.+?)(?=\d{2}\.\d{2}\.\d{2}|$)/g
          let match
          
          while ((match = regex.exec(fullText)) !== null) {
            const date = parseCreditAgricoleDate(match[1])
            const amount = parseFloat(match[2].replace(',', '.'))
            let description = match[3].trim()
            
            // Skip headers and empty lines
            if (description.includes('Data Valuta') || 
                description.includes('Movimenti dare') ||
                description.includes('SALDO') ||
                description.length < 3) {
              continue
            }
            
            // Clean description
            description = description.split('\n')[0].substring(0, 200)
            
            if (date && !isNaN(amount) && amount > 0) {
              transactions.push({
                occurred_at: date,
                description,
                amount: -amount,
                raw_merchant: extractMerchant(description)
              })
            }
          }
        } else {
          // Enhanced generic parser for Italian banks
          const lines = fullText.split('\n')
          
          for (const line of lines) {
            let match = null
          
            // Pattern 1: DD/MM/YYYY DESCRIPTION AMOUNT
            match = line.match(/(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})\s+(.+?)\s+([-+]?€?\s*\d+[.,]\d{2})/)
            
            // Pattern 2: DESCRIPTION DD/MM/YYYY AMOUNT
            if (!match) {
              match = line.match(/(.+?)\s+(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})\s+([-+]?€?\s*\d+[.,]\d{2})/)
              if (match) {
                const temp = match[1]
                match[1] = match[2]
                match[2] = temp
              }
            }
            
            // Pattern 3: DD/MM/YYYY DD/MM/YYYY DESCRIPTION AMOUNT (Intesa, UniCredit)
            if (!match) {
              match = line.match(/\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4}\s+(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})\s+(.+?)\s+([-+]?€?\s*\d+[.,]\d{2})/)
            }
            
            // Pattern 4: DD-MM-YY format (short year)
            if (!match) {
              match = line.match(/(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{2})\s+(.+?)\s+([-+]?€?\s*\d+[.,]\d{2})/)
              if (match) {
                // Convert short year to full year
                const dateParts = match[1].split(/[\/\-\.]/)
                match[1] = `${dateParts[0]}/${dateParts[1]}/20${dateParts[2]}`
              }
            }
            
            if (match) {
              const date = parseDate(match[1])
              let description = match[2].trim()
              const amount = parseAmount(match[3])

              // Skip headers and invalid lines
              if (description.includes('Data') || 
                  description.includes('Saldo') ||
                  description.includes('Totale') ||
                  description.length < 3) {
                continue
              }

              if (date && description && amount !== null && Math.abs(amount) > 0) {
                transactions.push({
                  occurred_at: date,
                  description: description.substring(0, 200),
                  amount,
                  raw_merchant: extractMerchant(description)
                })
              }
            }
          }
        }

        console.log(`PDF parser found ${transactions.length} transactions`)
        if (transactions.length > 0) {
          console.log('First transaction:', transactions[0])
        }

        resolve(transactions)
      } catch (error) {
        console.error('PDF processing error:', error)
        resolve([])
      }
    })
    
    pdfParser.parseBuffer(buffer)
  })
}

function parseDate(str: string): string | null {
  // Handle DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
  const match = str.match(/(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})/)
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`
  }
  return null
}

function parseRevolutDate(str: string): string | null {
  // Format: "3 nov 2023" or "11 nov 2023"
  const months: Record<string, string> = {
    'gen': '01', 'feb': '02', 'mar': '03', 'apr': '04',
    'mag': '05', 'giu': '06', 'lug': '07', 'ago': '08',
    'set': '09', 'ott': '10', 'nov': '11', 'dic': '12',
    'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
    'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
    'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
  }
  
  const match = str.match(/(\d{1,2})\s+(\w{3})\s+(\d{4})/)
  if (match) {
    const day = match[1].padStart(2, '0')
    const month = months[match[2].toLowerCase()] || '01'
    const year = match[3]
    return `${year}-${month}-${day}`
  }
  return null
}

function parseCreditAgricoleDate(str: string): string | null {
  // Format: "14.07.25" -> "2025-07-14"
  const match = str.match(/(\d{2})\.(\d{2})\.(\d{2})/)
  if (match) {
    const day = match[1]
    const month = match[2]
    const year = '20' + match[3]
    return `${year}-${month}-${day}`
  }
  return null
}

function parseAmount(str: string): number | null {
  const cleaned = str.replace(/[€\s]/g, '').replace(',', '.')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

function extractMerchant(description: string): string {
  // Credit Agricole SDD pattern: "SDD A : MERCHANT NAME"
  const sddMatch = description.match(/SDD\s+A\s*:\s*([A-Z\s]+?)(?:\s+ADDEBITO|$)/i)
  if (sddMatch) {
    return sddMatch[1].trim()
  }
  
  // Look for merchant name patterns FIRST
  // Pattern: "MerchantName**digits* Location" (e.g., "Revolut**7281* Dublin")
  const merchantMatch = description.match(/([A-Za-z0-9]+)\*\*\d+\*/i)
  if (merchantMatch) {
    return merchantMatch[1]
  }
  
  // Pattern: "PRESSO MerchantName" 
  const pressoMatch = description.match(/PRESSO\s+([A-Za-z0-9]+)/i)
  if (pressoMatch) {
    return pressoMatch[1]
  }
  
  // Remove common prefixes and get first word
  let cleaned = description
    .replace(/^(PAGAMENTO|ADDEBITO|BONIFICO|CARTA|POS|ALLE ORE \d{2}:\d{2} MEDIANTE LA CARTA.*?PRESSO)\s+/i, '')
    .trim()
  
  // Get first meaningful word
  const words = cleaned.split(/[\s-]+/)
  for (const word of words) {
    if (word.length > 2 && !/^\d+$/.test(word) && !/^(il|la|di|da|per|con)$/i.test(word)) {
      return word
    }
  }
  
  return cleaned.substring(0, 50) // Fallback
}
