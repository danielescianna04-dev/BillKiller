const MERCHANT_MAP: Record<string, string> = {
  // Streaming
  'NETFLIX': 'netflix',
  'SPOTIFY': 'spotify',
  'AMAZON PRIME': 'amazon-prime',
  'DISNEY': 'disney',
  'DAZN': 'dazn',
  'SKY': 'sky',
  'APPLE.COM/BILL': 'apple',
  'APPLE TV': 'apple-tv',
  
  // Cloud/Software
  'GOOGLE': 'google',
  'MICROSOFT': 'microsoft',
  'ADOBE': 'adobe',
  'DROPBOX': 'dropbox',
  'CANVA': 'canva',
  'NOTION': 'notion',
  'OPENAI': 'openai',
  
  // VPN
  'NORDVPN': 'nordvpn',
  'SURFSHARK': 'surfshark',
  'EXPRESSVPN': 'expressvpn',
  
  // Telco
  'TIM': 'tim',
  'TELECOMITALIA': 'tim',
  'VODAFONE': 'vodafone',
  'WINDTRE': 'windtre',
  'ILIAD': 'iliad',
  'FASTWEB': 'fastweb',
  
  // Fitness
  'SPOTIFY PREMIUM': 'spotify',
  'YOUTUBE PREMIUM': 'youtube-premium',
  'LINKEDIN': 'linkedin',
  
  // Payment services
  'KLARNA': 'klarna',
  'PAYPAL': 'paypal',
  'STRIPE': 'stripe'
}

export function normalizeMerchant(raw: string): string {
  const upper = raw.toUpperCase()
  
  // Check for common bank fees/charges
  if (upper.includes('CANONE') && upper.includes('CARTA')) return 'canone-carta'
  if (upper.includes('SOTTOSC')) return 'sottoscrizione'
  
  // Check for Apple Pay / Google Pay / POS first
  if (upper.includes('APPLE PAY') || upper.includes('APPLEPAY')) return 'unknown-applepay'
  if (upper.includes('GOOGLE PAY') || upper.includes('GOOGLEPAY') || upper.includes('G PAY')) return 'unknown-googlepay'
  if (upper.includes('POS CARTA')) return 'unknown-pos'
  if (upper.includes('POS') && (upper.includes('DEBIT') || upper.includes('VISA') || upper.includes('MASTERCARD'))) return 'unknown-pos'
  // Generic POS without merchant info
  if (upper === 'POS' || upper.startsWith('POS ')) return 'unknown-pos'
  
  // Check merchant map
  for (const [key, value] of Object.entries(MERCHANT_MAP)) {
    if (upper.includes(key)) {
      return value
    }
  }
  
  // Fallback: lowercase and remove special chars
  return raw.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
}

export function getMerchantTitle(canonical: string): string {
  const titles: Record<string, string> = {
    'unknown-applepay': 'Abbonamento Apple Pay',
    'unknown-googlepay': 'Abbonamento Google Pay',
    'unknown-pos': 'Abbonamento POS',
    'canone-carta': 'Canone Carta',
    'sottoscrizione': 'Sottoscrizione',
    'netflix': 'Netflix',
    'spotify': 'Spotify',
    'amazon-prime': 'Amazon Prime',
    'disney': 'Disney+',
    'apple': 'Apple',
    'google': 'Google',
    'microsoft': 'Microsoft',
    'tim': 'TIM',
    'vodafone': 'Vodafone',
    'nordvpn': 'NordVPN'
  }
  
  return titles[canonical] || canonical.split('-').map(w => 
    w.charAt(0).toUpperCase() + w.slice(1)
  ).join(' ')
}
