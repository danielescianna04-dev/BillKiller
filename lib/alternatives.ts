import { createClient } from '@supabase/supabase-js'

export interface Alternative {
  name: string
  price: number
  savings: number
  url: string
  description: string
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getAlternative(merchantCanonical: string, currentPrice: number): Promise<Alternative | null> {
  try {
    const { data, error } = await supabase
      .from('alternatives')
      .select('*')
      .eq('merchant_canonical', merchantCanonical.toLowerCase())
      .eq('is_active', true)
      .single()

    if (error || !data) return null

    // Calcola risparmio reale basato sul prezzo corrente
    if (data.alternative_price >= currentPrice) return null

    const actualSavings = Math.round(((currentPrice - data.alternative_price) / currentPrice) * 100)

    // Mostra solo se risparmio > 20% per evitare falsi positivi con bundle
    if (actualSavings < 20) return null

    return {
      name: data.alternative_name,
      price: data.alternative_price,
      savings: actualSavings,
      url: data.affiliate_url,
      description: data.description || ''
    }
  } catch (err) {
    console.error('Error fetching alternative:', err)
    return null
  }
}
