# Setup SEO per BillKiller

## 1. Google Analytics

1. Vai su https://analytics.google.com
2. Crea una nuova proprietà GA4
3. Copia il Measurement ID (es. `G-XXXXXXXXXX`)
4. Aggiungi su Vercel:
   - Key: `NEXT_PUBLIC_GA_ID`
   - Value: `G-XXXXXXXXXX`
5. Redeploy

## 2. Google Search Console

1. Vai su https://search.google.com/search-console
2. Aggiungi proprietà: `https://billkiller.it`
3. Scegli metodo "Tag HTML"
4. Copia il codice di verifica (es. `abc123xyz`)
5. Aggiungi su Vercel:
   - Key: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
   - Value: `abc123xyz`
6. Redeploy
7. Torna su Search Console e clicca "Verifica"
8. Invia la sitemap: `https://billkiller.it/sitemap.xml`

## 3. Ottimizza Immagini (TODO)

Aggiungi `alt` text a tutte le immagini:
- Logo: "BillKiller - Gestione Abbonamenti"
- Screenshot: descrizioni specifiche
- Icone: descrizioni funzionali

## 4. Blog per SEO (TODO)

Crea contenuti su:
- "Come risparmiare sugli abbonamenti"
- "I 10 abbonamenti più dimenticati"
- "Come leggere l'estratto conto"
- "Guida agli abbonamenti streaming"

## 5. Schema.org Structured Data (Opzionale)

Aggiungi JSON-LD per:
- Organization
- WebApplication
- FAQPage
