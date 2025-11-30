import { analyzeWithAI } from './groq'
import PDFParser from 'pdf2json'

interface Transaction {
  occurred_at: string
  description: string
  amount: number
  raw_merchant: string
}

interface AIParseResponse {
  transactions: Array<{
    date: string
    description: string
    amount: number
    merchant: string
    type: 'expense' | 'income'
  }>
  bank_name?: string
  account_holder?: string
  period?: string
}

const SYSTEM_PROMPT = `Sei un esperto nell'analisi di estratti conto bancari italiani ed europei.

Il tuo compito è estrarre TUTTE le transazioni dal testo dell'estratto conto fornito.

Per ogni transazione, estrai:
- date: data della transazione in formato ISO (YYYY-MM-DD)
- description: descrizione completa della transazione
- amount: importo POSITIVO (il tipo indica se è entrata o uscita)
- merchant: nome del commerciante/servizio (es: "Netflix", "Spotify", "Conad", "TIM")
- type: "expense" se è un'uscita/addebito, "income" se è un'entrata/accredito

REGOLE IMPORTANTI:
1. Estrai TUTTE le transazioni, non solo gli abbonamenti
2. L'importo deve essere SEMPRE positivo, usa "type" per indicare entrata/uscita
3. Per il merchant, estrai il nome pulito (es: "NETFLIX.COM" → "Netflix", "SPOTIFY AB" → "Spotify")
4. Se non riesci a identificare il merchant, usa la prima parte significativa della descrizione
5. Ignora intestazioni, totali, saldi iniziali/finali, commissioni bancarie interne
6. Le date devono essere in formato ISO: YYYY-MM-DD
7. Per date con anno a 2 cifre (es: 14.07.25), assumi 20XX (es: 2025-07-14)

Formati comuni di estratti conto:
- Revolut: "3 nov 2024 MERCHANT €XX,XX €YY,YY"
- Credit Agricole: "DD.MM.YY DD.MM.YY AMOUNT DESCRIPTION"
- Intesa/UniCredit: "DD/MM/YYYY DD/MM/YYYY DESCRIPTION AMOUNT"
- Generico: "DD/MM/YYYY DESCRIPTION AMOUNT"

Rispondi SOLO con JSON valido nel formato:
{
  "transactions": [...],
  "bank_name": "nome banca se identificabile",
  "account_holder": "nome intestatario se visibile",
  "period": "periodo estratto conto (es: 01/01/2024 - 31/01/2024)"
}`

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new (PDFParser as any)(null, 1)

    pdfParser.on('pdfParser_dataError', (errData: any) => {
      console.error('PDF parse error:', errData.parserError)
      resolve('')
    })

    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      try {
        let fullText = ''
        const pageCount = pdfData.Pages?.length || 0
        console.log(`PDF has ${pageCount} pages`)

        if (pdfData.Pages) {
          pdfData.Pages.forEach((page: any, index: number) => {
            if (page.Texts) {
              page.Texts.forEach((text: any) => {
                if (text.R) {
                  text.R.forEach((r: any) => {
                    if (r.T) {
                      const decoded = decodeURIComponent(r.T)
                      fullText += decoded + ' '
                    }
                  })
                }
              })
              fullText += '\n'
            }
          })
        }

        resolve(fullText)
      } catch (error) {
        console.error('PDF text extraction error:', error)
        resolve('')
      }
    })

    pdfParser.parseBuffer(buffer)
  })
}

export async function parseWithAI(buffer: Buffer): Promise<Transaction[]> {
  console.log('AI Parser: extracting text from PDF...')

  const pdfText = await extractTextFromPDF(buffer)

  if (!pdfText || pdfText.length < 100) {
    console.error('AI Parser: insufficient text extracted from PDF')
    return []
  }

  console.log(`AI Parser: extracted ${pdfText.length} characters`)
  console.log('AI Parser: sample text:', pdfText.substring(0, 500))

  // Split text into chunks if too large (Groq has token limits)
  const maxChars = 15000
  const chunks: string[] = []

  if (pdfText.length > maxChars) {
    // Split by pages/sections
    const lines = pdfText.split('\n')
    let currentChunk = ''

    for (const line of lines) {
      if (currentChunk.length + line.length > maxChars) {
        chunks.push(currentChunk)
        currentChunk = line
      } else {
        currentChunk += '\n' + line
      }
    }
    if (currentChunk) chunks.push(currentChunk)
  } else {
    chunks.push(pdfText)
  }

  console.log(`AI Parser: processing ${chunks.length} chunk(s)`)

  const allTransactions: Transaction[] = []

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    console.log(`AI Parser: processing chunk ${i + 1}/${chunks.length} (${chunk.length} chars)`)

    const prompt = `Analizza questo estratto conto bancario ed estrai tutte le transazioni:

${chunk}

Data odierna per riferimento: ${new Date().toISOString().split('T')[0]}`

    try {
      const result = await analyzeWithAI<AIParseResponse>(prompt, SYSTEM_PROMPT)

      console.log(`AI Parser: chunk ${i + 1} found ${result.transactions.length} transactions`)

      if (result.bank_name) {
        console.log(`AI Parser: detected bank: ${result.bank_name}`)
      }

      for (const tx of result.transactions) {
        // Validate transaction
        if (!tx.date || !tx.amount || tx.amount <= 0) {
          console.log('AI Parser: skipping invalid transaction:', tx)
          continue
        }

        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(tx.date)) {
          console.log('AI Parser: skipping transaction with invalid date:', tx.date)
          continue
        }

        allTransactions.push({
          occurred_at: tx.date,
          description: tx.description || tx.merchant,
          amount: tx.type === 'expense' ? -tx.amount : tx.amount,
          raw_merchant: tx.merchant
        })
      }
    } catch (error) {
      console.error(`AI Parser: error processing chunk ${i + 1}:`, error)
    }
  }

  // Remove duplicates based on date + amount + merchant
  const seen = new Set<string>()
  const uniqueTransactions = allTransactions.filter(tx => {
    const key = `${tx.occurred_at}-${tx.amount}-${tx.raw_merchant}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  console.log(`AI Parser: found ${uniqueTransactions.length} unique transactions`)

  if (uniqueTransactions.length > 0) {
    console.log('AI Parser: first transaction:', uniqueTransactions[0])
    console.log('AI Parser: last transaction:', uniqueTransactions[uniqueTransactions.length - 1])
  }

  return uniqueTransactions
}

export async function parseCSVWithAI(content: string): Promise<Transaction[]> {
  console.log('AI Parser: analyzing CSV content...')
  console.log(`AI Parser: CSV length: ${content.length} characters`)

  const prompt = `Analizza questo file CSV di transazioni bancarie ed estrai tutte le transazioni:

${content.substring(0, 20000)}

Data odierna per riferimento: ${new Date().toISOString().split('T')[0]}`

  try {
    const result = await analyzeWithAI<AIParseResponse>(prompt, SYSTEM_PROMPT)

    console.log(`AI Parser: found ${result.transactions.length} transactions in CSV`)

    const transactions: Transaction[] = []

    for (const tx of result.transactions) {
      if (!tx.date || !tx.amount || tx.amount <= 0) continue
      if (!/^\d{4}-\d{2}-\d{2}$/.test(tx.date)) continue

      transactions.push({
        occurred_at: tx.date,
        description: tx.description || tx.merchant,
        amount: tx.type === 'expense' ? -tx.amount : tx.amount,
        raw_merchant: tx.merchant
      })
    }

    return transactions
  } catch (error) {
    console.error('AI Parser CSV error:', error)
    return []
  }
}
