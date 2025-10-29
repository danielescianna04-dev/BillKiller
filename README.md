# BillKiller 💰

Trova tutti i tuoi abbonamenti nascosti e risparmia ogni mese.

## 🚀 Features Complete

- ✅ Upload estratti conto (CSV/PDF con OCR)
- ✅ Collegamento email Gmail/Outlook (OAuth read-only)
- ✅ Rilevamento automatico abbonamenti ricorrenti
- ✅ Dashboard con totali mensili/annuali
- ✅ Grafici e trend con paywall (Premium)
- ✅ Export PDF/CSV (Premium)
- ✅ Hub affiliate con alternative economiche
- ✅ Piano Free (5 abbonamenti) + Premium (€0,99/mese)
- ✅ Auto-delete file dopo 30 giorni (GDPR)
- ✅ Bottone "Elimina tutto" per account
- ✅ Email scanner Gmail/Outlook API
- ✅ Affiliate redirect tracking
- ✅ Privacy Policy & Terms completi

## 🛠️ Stack

- **Frontend**: Next.js 15 (App Router) + Tailwind + shadcn/ui
- **Auth**: Supabase Auth
- **Database**: Supabase Postgres (EU region)
- **Payments**: Stripe
- **Charts**: Recharts

## 📦 Setup

1. **Clone e installa**
```bash
git clone <repo>
cd billkiller
npm install
```

2. **Configura env**
```bash
cp .env.example .env.local
# Compila con le tue chiavi
```

3. **Setup Supabase**
```bash
# Crea progetto su supabase.com (EU region)
# Segui la guida completa in supabase/SETUP.md
# Esegui schema.sql nel SQL Editor
# Crea bucket 'statements' in Storage
# Configura RLS policies
```

4. **Setup Stripe**
```bash
# Crea prodotti su stripe.com
# Crea webhook endpoint: /api/webhooks/stripe
# Eventi: checkout.session.completed, customer.subscription.deleted
```

5. **Setup OAuth**
- **Google**: Console Cloud → OAuth 2.0 → Redirect URI: `/api/auth/gmail/callback`
- **Microsoft**: Azure Portal → App Registration → Redirect URI: `/api/auth/outlook/callback`

6. **Run**
```bash
npm run dev
```

## 📁 Struttura

```
/app
  /page.tsx                 # Landing page
  /app/dashboard           # Dashboard utente
  /app/upload              # Upload estratti
  /app/email               # Collegamento email
  /app/offerte             # Hub affiliate
  /account                 # Gestione account
  /api
    /checkout              # Stripe checkout
    /webhooks/stripe       # Webhook Stripe
    /auth/gmail            # OAuth Gmail
    /auth/outlook          # OAuth Outlook
    /process/statement     # Parser CSV/PDF
    /scan/gmail            # Email scanner Gmail
    /scan/outlook          # Email scanner Outlook
    /export                # Export CSV/PDF
    /account/delete        # Delete account
    /cron/cleanup          # Auto-delete files
  /go/[id]                 # Redirect affiliate

/lib
  /parsers/csv.ts          # Parser CSV
  /parsers/pdf.ts          # Parser PDF (OCR)
  /merchants.ts            # Normalizzazione merchant
  /detection.ts            # Algoritmo rilevamento

/components
  /subscription-charts.tsx # Grafici
  /subscriptions-list.tsx  # Lista abbonamenti
  /export-button.tsx       # Export CSV
```

## 🔒 Privacy & GDPR

- Hosting UE only
- File grezzi auto-delete dopo 30 giorni
- OAuth read-only con scope limitati
- Nessuna rivendita dati
- Bottone "Elimina tutto"

## 💰 Monetizzazione

- **Free**: 5 abbonamenti, totali mensili/annuali
- **Premium (€0,99/mese)**: illimitati, grafici, export, backup
- **Affiliate**: link trasparenti su offerte alternative

## 🚀 Deploy

### Vercel
```bash
vercel --prod
```

### Environment Variables
Configura tutte le variabili da `.env.example` nel dashboard Vercel.

### Cron Job
Il cleanup automatico dei file è configurato in `vercel.json` per eseguire ogni giorno alle 2:00 AM.

### Stripe Webhook
Configura webhook su Stripe dashboard:
- URL: `https://your-domain.com/api/webhooks/stripe`
- Eventi: `checkout.session.completed`, `customer.subscription.deleted`

## 📄 License

MIT
