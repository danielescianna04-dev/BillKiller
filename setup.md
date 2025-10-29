# BillKiller Setup Guide

## 1. Installazione dipendenze
```bash
npm install
```

## 2. Setup Supabase
1. Crea progetto su https://supabase.com
2. Vai su Settings > API per ottenere le chiavi
3. Esegui lo schema SQL da `supabase/schema.sql`
4. Abilita Storage bucket "statements" (public: false)
5. Configura OAuth providers (Google, Microsoft)

## 3. Setup Stripe
1. Crea account su https://stripe.com
2. Crea 2 prodotti:
   - Premium Monthly (€0.99/mese)
   - Premium Yearly (€9.99/anno)
3. Copia i Price IDs in `lib/stripe.ts`
4. Configura webhook endpoint: `/api/webhooks/stripe`

## 4. Variabili ambiente
Copia `.env.local` e compila:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5. Avvio sviluppo
```bash
npm run dev
```

## 6. Deploy produzione
1. Deploy su Vercel/Netlify
2. Configura variabili ambiente
3. Aggiorna NEXT_PUBLIC_APP_URL
4. Configura webhook Stripe con URL produzione

## Funzionalità implementate
✅ Autenticazione (email + OAuth Google)
✅ Dashboard con totali mensili/annuali
✅ Upload estratti conto (mock processing)
✅ Sistema Premium/Free con paywall
✅ Pagamenti Stripe
✅ Database Supabase con RLS
✅ UI responsive con Tailwind

## Prossimi step per produzione
- [ ] Parser CSV/PDF reale (Python worker)
- [ ] OAuth Gmail/Outlook per email
- [ ] Sistema affiliate con tracking
- [ ] Grafici e trend (Recharts)
- [ ] Export PDF/CSV
- [ ] Merchant dictionary italiano
- [ ] Email notifications
- [ ] Analytics (PostHog)
