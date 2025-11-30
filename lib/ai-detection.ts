import { analyzeWithAI } from './groq'

interface Transaction {
  occurred_at: string
  amount: number
  merchant_canonical: string
  description: string
}

interface AISubscription {
  merchant_canonical: string
  merchant_name: string
  amount: number
  periodicity: 'monthly' | 'yearly' | 'quarterly' | 'semiannual' | 'unknown'
  confidence: number
  first_seen: string
  last_seen: string
  status: 'active' | 'cancelled'
  is_installment: boolean
  installments_total: number | null
  installments_paid: number | null
  installments_remaining: number | null
  reasoning: string
}

interface AIDetectionResponse {
  subscriptions: AISubscription[]
}

const SYSTEM_PROMPT = `Sei un esperto analista finanziario specializzato nel rilevamento di abbonamenti e pagamenti ricorrenti.

Analizza le transazioni bancarie fornite e identifica TUTTI gli abbonamenti/pagamenti ricorrenti.

Per ogni abbonamento identificato, fornisci:
- merchant_canonical: identificatore univoco lowercase che DEVE includere l'importo se ci sono più abbonamenti dello stesso merchant (es: "apple-0.99" per iCloud, "apple-10.99" per Apple Music)
- merchant_name: nome leggibile del servizio specifico (es: "iCloud 50GB", "Apple Music", "Apple One")
- amount: importo in EUR (numero positivo)
- periodicity: "monthly", "yearly", "quarterly", "semiannual", o "unknown"
- confidence: da 0.0 a 1.0 (quanto sei sicuro che sia un abbonamento)
- first_seen: data prima transazione (formato ISO)
- last_seen: data ultima transazione (formato ISO)
- status: "active" se ultimo pagamento entro 60 giorni, altrimenti "cancelled"
- is_installment: true se è un piano rateale (es: Klarna, Scalapay)
- installments_total: numero totale rate (se applicabile, altrimenti null)
- installments_paid: rate pagate (se applicabile, altrimenti null)
- installments_remaining: rate rimanenti (se applicabile, altrimenti null)
- reasoning: breve spiegazione del perché hai identificato questo come abbonamento

REGOLE IMPORTANTI:
1. SEPARA abbonamenti con IMPORTI DIVERSI anche se dello stesso merchant! Esempio:
   - Apple €0.99/mese = iCloud 50GB (abbonamento separato)
   - Apple €5.99/mese = Apple Music (abbonamento separato)
   - Apple €10.99/mese = Apple One (abbonamento separato)
2. Cerca pattern ricorrenti: stesso importo (±10%) + intervalli regolari (circa 30, 90, 180, 365 giorni)
3. ESCLUDI: bonifici P2P, prelievi ATM, acquisti singoli non ricorrenti, spesa al supermercato/bar/ristorante, commissioni bancarie
4. INCLUDI: streaming (Netflix, Spotify, Disney+), telefonia (TIM, Vodafone, Iliad), cloud (iCloud, Google One, Dropbox), palestre, assicurazioni
5. Un abbonamento richiede ALMENO 2 pagamenti con lo stesso importo (±10%)
6. Confidence alta (>0.8) se: stesso importo esatto + intervalli regolari
7. Confidence media (0.6-0.8) se: importo simile, intervalli variabili
8. NON includere transazioni con confidence < 0.6
9. Per merchant come Apple, Google, Microsoft: distingui i diversi servizi in base all'importo

Rispondi SOLO con un JSON valido nel formato:
{
  "subscriptions": [...]
}`

export async function detectSubscriptionsWithAI(
  transactions: Transaction[]
): Promise<AISubscription[]> {
  if (transactions.length === 0) {
    return []
  }

  // Prepara i dati per l'AI
  const transactionData = transactions.map(t => ({
    date: t.occurred_at,
    amount: t.amount,
    merchant: t.merchant_canonical,
    description: t.description
  }))

  const prompt = `Analizza queste ${transactions.length} transazioni bancarie e identifica gli abbonamenti ricorrenti:

${JSON.stringify(transactionData, null, 2)}

Data odierna: ${new Date().toISOString().split('T')[0]}`

  console.log(`AI Detection: analyzing ${transactions.length} transactions with Groq/Llama`)

  try {
    const result = await analyzeWithAI<AIDetectionResponse>(prompt, SYSTEM_PROMPT)

    console.log(`AI Detection: found ${result.subscriptions.length} subscriptions`)

    // Filtra per confidence minima
    const filtered = result.subscriptions.filter(s => s.confidence >= 0.6)

    console.log(`AI Detection: ${filtered.length} subscriptions after confidence filter`)

    return filtered
  } catch (error) {
    console.error('AI Detection error:', error)
    throw error
  }
}

// Funzione per identificare abbonamenti unknown con AI
export async function identifyUnknownWithAI(
  unknownSubscriptions: Array<{ merchant_canonical: string; amount: number; transactions: Transaction[] }>,
  allTransactions: Transaction[]
): Promise<Array<{ original: string; identified: string; confidence: number }>> {
  if (unknownSubscriptions.length === 0) return []

  const prompt = `Ho degli abbonamenti non identificati (pagati via Apple Pay, Google Pay o POS generico).
Basandoti sugli importi e le date, prova a identificare di quale servizio si tratta.

Abbonamenti unknown da identificare:
${JSON.stringify(unknownSubscriptions.map(s => ({
  merchant: s.merchant_canonical,
  amount: s.amount,
  dates: s.transactions.map(t => t.occurred_at)
})), null, 2)}

Tutte le transazioni per contesto:
${JSON.stringify(allTransactions.slice(0, 100).map(t => ({
  date: t.occurred_at,
  amount: t.amount,
  merchant: t.merchant_canonical,
  description: t.description
})), null, 2)}

Per ogni abbonamento unknown, cerca di identificare il servizio basandoti su:
1. Importo tipico di servizi noti (es: €9.99 = Netflix, €5.99 = Spotify, etc)
2. Pattern simili nelle altre transazioni
3. Descrizioni nelle transazioni

Rispondi con JSON:
{
  "identifications": [
    {
      "original": "merchant_canonical originale",
      "identified": "merchant identificato (es: netflix, spotify) o null se non identificabile",
      "confidence": 0.0-1.0,
      "reasoning": "spiegazione"
    }
  ]
}`

  const systemPrompt = `Sei un esperto nell'identificare servizi di abbonamento basandoti su pattern di pagamento.
Conosci gli importi tipici dei servizi più comuni:
- Netflix: €5.49-€17.99/mese
- Spotify: €4.99-€14.99/mese
- Apple Music: €5.99-€16.99/mese
- Disney+: €5.99-€11.99/mese
- Amazon Prime: €4.99/mese o €49.90/anno
- YouTube Premium: €11.99/mese
- iCloud: €0.99-€9.99/mese
- Google One: €1.99-€9.99/mese

Rispondi SOLO con JSON valido.`

  try {
    const result = await analyzeWithAI<{
      identifications: Array<{
        original: string
        identified: string | null
        confidence: number
        reasoning: string
      }>
    }>(prompt, systemPrompt)

    return result.identifications
      .filter(i => i.identified && i.confidence >= 0.6)
      .map(i => ({
        original: i.original,
        identified: i.identified!,
        confidence: i.confidence
      }))
  } catch (error) {
    console.error('AI Identification error:', error)
    return []
  }
}
