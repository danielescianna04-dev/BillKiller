const MERCHANT_MAP: Record<string, string> = {
  // Apple Pay / Google Pay
  if (desc.includes('APPLE PAY') || desc.includes('APPLEPAY')) return 'apple-pay'
  if (desc.includes('GOOGLE PAY') || desc.includes('GOOGLEPAY') || desc.includes('G PAY')) return 'google-pay'
  if (desc.includes('POS CARTA') && desc.includes('DEBIT')) return 'pos-carta'
  
  // Apple Pay / Google Pay / POS generici
  if (desc.includes('APPLE PAY') || desc.includes('APPLEPAY')) return 'unknown-applepay'
  if (desc.includes('GOOGLE PAY') || desc.includes('GOOGLEPAY') || desc.includes('G PAY')) return 'unknown-googlepay'
  if (desc.includes('POS CARTA') || (desc.includes('POS') && desc.includes('CARTA'))) return 'unknown-pos'
  
  // Unknown payments
  'unknown-applepay': 'Abbonamento Apple Pay',
  'unknown-googlepay': 'Abbonamento Google Pay',
  'unknown-pos': 'Abbonamento POS',
  
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
