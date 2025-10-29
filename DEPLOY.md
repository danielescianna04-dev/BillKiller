# BillKiller - Deployment Guide

Guida completa per il deploy in produzione.

## 📋 Pre-requisiti

- Account Supabase (EU region)
- Account Stripe
- Account Vercel
- Google Cloud Console (per Gmail OAuth)
- Azure Portal (per Outlook OAuth)

## 🚀 Step-by-Step

### 1. Setup Supabase (15 min)

Segui `supabase/SETUP.md` per:
- Creare progetto EU
- Eseguire schema SQL
- Configurare storage bucket
- Ottenere chiavi API

### 2. Setup Stripe (10 min)

1. Crea account su [stripe.com](https://stripe.com)
2. Crea 2 prodotti:
   - **Premium Mensile**: €0,99/mese (ricorrente)
   - **Premium Annuale**: €9,99/anno (ricorrente)
3. Salva i Price ID (iniziano con `price_...`)
4. Ottieni chiavi:
   - Secret key: `sk_test_...` (o `sk_live_...` per prod)
   - Publishable key: `pk_test_...`

### 3. Setup OAuth Google (10 min)

1. Vai su [Google Cloud Console](https://console.cloud.google.com)
2. Crea nuovo progetto "BillKiller"
3. Abilita Gmail API
4. Crea credenziali OAuth 2.0:
   - Application type: Web application
   - Authorized redirect URIs: 
     - `http://localhost:3000/api/auth/gmail/callback` (dev)
     - `https://your-domain.com/api/auth/gmail/callback` (prod)
5. Salva Client ID e Client Secret
6. Configura OAuth consent screen:
   - User type: External
   - Scopes: `gmail.readonly`

### 4. Setup OAuth Microsoft (10 min)

1. Vai su [Azure Portal](https://portal.azure.com)
2. Azure Active Directory → App registrations → New registration
3. Nome: "BillKiller"
4. Redirect URI: 
   - `http://localhost:3000/api/auth/outlook/callback` (dev)
   - `https://your-domain.com/api/auth/outlook/callback` (prod)
5. Certificates & secrets → New client secret
6. API permissions → Add permission → Microsoft Graph:
   - `Mail.Read`
   - `offline_access`
7. Salva Application (client) ID e Client Secret

### 5. Deploy su Vercel (5 min)

1. Push codice su GitHub
2. Vai su [vercel.com](https://vercel.com)
3. Import repository
4. Configura Environment Variables (vedi sotto)
5. Deploy!

### 6. Configura Environment Variables su Vercel

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx (vedi step 7)
STRIPE_PRICE_MONTHLY=price_xxx
STRIPE_PRICE_YEARLY=price_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx

# Microsoft OAuth
MICROSOFT_CLIENT_ID=xxx
MICROSOFT_CLIENT_SECRET=xxx

# App
NEXT_PUBLIC_URL=https://your-domain.vercel.app

# Cron
CRON_SECRET=genera_stringa_random_sicura
```

### 7. Configura Stripe Webhook (5 min)

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint:
   - URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Eventi da ascoltare:
     - `checkout.session.completed`
     - `customer.subscription.deleted`
     - `customer.subscription.updated`
3. Copia Webhook Secret (`whsec_...`)
4. Aggiorna `STRIPE_WEBHOOK_SECRET` su Vercel
5. Redeploy

### 8. Test Completo (10 min)

1. **Signup**: Crea account
2. **Upload**: Carica CSV di test
3. **Email**: Collega Gmail/Outlook
4. **Dashboard**: Verifica abbonamenti rilevati
5. **Premium**: Test checkout Stripe
6. **Export**: Scarica CSV/PDF
7. **Delete**: Test eliminazione account

### 9. Monitoring & Logs

**Vercel:**
- Dashboard → Logs (real-time)
- Analytics → Performance

**Supabase:**
- Dashboard → Logs
- Database → Query performance

**Stripe:**
- Dashboard → Events log
- Webhooks → Delivery attempts

### 10. Cron Job Verification

Il cron job per auto-delete file gira automaticamente su Vercel.

Verifica in `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/cleanup",
    "schedule": "0 2 * * *"
  }]
}
```

Test manuale:
```bash
curl -X GET https://your-domain.vercel.app/api/cron/cleanup \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## 🔒 Security Checklist

- [ ] HTTPS abilitato (automatico su Vercel)
- [ ] Environment variables configurate
- [ ] Stripe webhook secret configurato
- [ ] OAuth redirect URIs corretti
- [ ] Supabase RLS abilitato
- [ ] Storage bucket privato
- [ ] CRON_SECRET generato e sicuro
- [ ] Service role key mai esposta al client
- [ ] CORS configurato correttamente

## 📊 Post-Launch

### Analytics (Opzionale)
Aggiungi PostHog o Plausible per analytics privacy-friendly:
```bash
npm install posthog-js
```

### Custom Domain
1. Vercel → Settings → Domains
2. Aggiungi dominio custom
3. Configura DNS (A/CNAME records)
4. Aggiorna OAuth redirect URIs

### Email Personalizzate
Configura SMTP custom in Supabase per email branded.

## 🐛 Troubleshooting

### Deploy fallisce
- Verifica tutte le env variables
- Check build logs su Vercel
- Verifica `package.json` dependencies

### OAuth non funziona
- Verifica redirect URIs esatti
- Check scopes configurati
- Verifica client ID/secret

### Webhook Stripe fallisce
- Verifica endpoint URL
- Check webhook secret
- Vedi Stripe logs per dettagli

### Upload file fallisce
- Verifica storage bucket creato
- Check RLS policies
- Verifica MIME types consentiti

## 💰 Costi Mensili Stimati

**Startup (0-100 utenti):**
- Supabase: €0 (free tier)
- Vercel: €0 (hobby tier)
- Stripe: 1.4% + €0.25 per transazione
- **Totale fisso: €0/mese**

**Growth (100-1000 utenti):**
- Supabase Pro: €25/mese
- Vercel Pro: €20/mese
- Stripe: 1.4% + €0.25 per transazione
- **Totale fisso: €45/mese**

## 📞 Support

- Supabase: [discord.supabase.com](https://discord.supabase.com)
- Vercel: [vercel.com/support](https://vercel.com/support)
- Stripe: [support.stripe.com](https://support.stripe.com)

## 🎉 Go Live!

Una volta completati tutti gli step, sei pronto per il lancio! 🚀

Ricorda di:
1. Testare tutto in staging prima
2. Preparare Privacy Policy e Terms
3. Configurare email di supporto
4. Preparare materiale marketing
5. Monitorare logs i primi giorni
