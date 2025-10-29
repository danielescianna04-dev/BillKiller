import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BillKiller - Scopri e Gestisci i Tuoi Abbonamenti',
  description: 'Trova tutti i tuoi abbonamenti nascosti analizzando il tuo estratto conto. Risparmia fino a €500/anno. GDPR compliant, hosting europeo, nessun accesso bancario.',
  keywords: ['abbonamenti', 'gestione abbonamenti', 'risparmio', 'estratto conto', 'finanza personale', 'budget', 'Netflix', 'Spotify', 'Amazon Prime'],
  authors: [{ name: 'BillKiller' }],
  creator: 'BillKiller',
  publisher: 'BillKiller',
  metadataBase: new URL('https://billkiller.it'),
  alternates: {
    canonical: 'https://billkiller.it',
  },
  openGraph: {
    title: 'BillKiller - Scopri e Gestisci i Tuoi Abbonamenti',
    description: 'Trova tutti i tuoi abbonamenti nascosti analizzando il tuo estratto conto. Risparmia fino a €500/anno.',
    url: 'https://billkiller.it',
    siteName: 'BillKiller',
    locale: 'it_IT',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BillKiller - Gestione Abbonamenti',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BillKiller - Scopri e Gestisci i Tuoi Abbonamenti',
    description: 'Trova tutti i tuoi abbonamenti nascosti. Risparmia fino a €500/anno.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
