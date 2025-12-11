import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'BillKiller Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BillKiller - Scopri e Gestisci i Tuoi Abbonamenti',
    description: 'Trova tutti i tuoi abbonamenti nascosti. Risparmia fino a €500/anno.',
    images: ['/icon-512.png'],
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
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className="overflow-x-hidden">
      <head>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
