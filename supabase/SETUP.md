# Supabase Setup Guide

## 1. Crea Progetto Supabase

1. Vai su [supabase.com](https://supabase.com)
2. Crea nuovo progetto
3. **IMPORTANTE**: Seleziona **EU region** (Frankfurt o Londra) per GDPR
4. Salva la password del database

## 2. Ottieni le Chiavi

Dal dashboard Supabase → Settings → API:

- `NEXT_PUBLIC_SUPABASE_URL` - Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - service_role key (⚠️ SEGRETO)

Copia in `.env.local`

## 3. Esegui Schema SQL

1. Vai su SQL Editor nel dashboard Supabase
2. Copia tutto il contenuto di `schema.sql`
3. Esegui (Run)
4. Verifica che tutte le tabelle siano create

## 4. Configura Storage

1. Vai su Storage nel dashboard
2. Crea bucket `statements`
3. Configurazione:
   - **Public**: NO (privato)
   - **File size limit**: 10MB
   - **Allowed MIME types**: `text/csv`, `application/pdf`

4. Aggiungi policy RLS per il bucket:

```sql
-- Policy: Users can upload their own files
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'statements' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can read their own files
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'statements' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'statements' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## 5. Configura Auth

### Email Auth
1. Vai su Authentication → Providers
2. Abilita **Email**
3. Configura:
   - **Confirm email**: ON (per produzione)
   - **Secure email change**: ON

### OAuth Providers (opzionale per social login)
Se vuoi aggiungere Google/Microsoft login (oltre a OAuth per email):

**Google:**
- Client ID e Secret da Google Cloud Console
- Redirect URL: `https://[PROJECT_REF].supabase.co/auth/v1/callback`

**Microsoft:**
- Client ID e Secret da Azure Portal
- Redirect URL: `https://[PROJECT_REF].supabase.co/auth/v1/callback`

## 6. Configura Email Templates

Authentication → Email Templates:

### Confirm Signup
```html
<h2>Benvenuto su BillKiller!</h2>
<p>Clicca il link per confermare la tua email:</p>
<p><a href="{{ .ConfirmationURL }}">Conferma email</a></p>
```

### Reset Password
```html
<h2>Reset Password</h2>
<p>Clicca il link per reimpostare la password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset password</a></p>
```

## 7. Verifica RLS (Row Level Security)

Tutte le tabelle devono avere RLS abilitato. Verifica con:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

Tutte devono avere `rowsecurity = true`

## 8. Test Connessione

Crea file `test-connection.js`:

```javascript
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function test() {
  const { data, error } = await supabase.from('users').select('count')
  console.log('Connection:', error ? 'FAILED' : 'SUCCESS')
}

test()
```

Run: `node test-connection.js`

## 9. Seed Data (Opzionale)

Per testare, aggiungi merchant affiliates:

```sql
INSERT INTO merchant_affiliates (merchant_name, partner_name, offer_url, discount_info, active) VALUES
('NordVPN', 'NordVPN', 'https://nordvpn.com/?aff=YOUR_ID', 'Piano 2 anni con 3 mesi gratis', true),
('pCloud', 'pCloud', 'https://pcloud.com/?ref=YOUR_ID', 'Piano lifetime in offerta', true),
('Disney+', 'Disney', 'https://disneyplus.com/?ref=YOUR_ID', 'Piano annuale con sconto', true),
('Iliad', 'Iliad', 'https://iliad.it/?ref=YOUR_ID', 'Giga illimitati 5G', true);
```

## 10. Backup & Monitoring

### Backup Automatico
- Supabase Pro: backup automatici giornalieri
- Free tier: export manuale periodico

### Monitoring
- Dashboard → Database → Logs
- Monitora query lente
- Controlla storage usage

## 11. Production Checklist

- [ ] RLS abilitato su tutte le tabelle
- [ ] Storage bucket privato con policies
- [ ] Email confirmation abilitata
- [ ] Password policy configurata (min 8 caratteri)
- [ ] Rate limiting configurato
- [ ] Backup configurato
- [ ] Monitoring attivo
- [ ] SSL/TLS verificato
- [ ] CORS configurato per il tuo dominio

## 12. Troubleshooting

### Errore: "relation does not exist"
→ Schema SQL non eseguito correttamente. Riesegui `schema.sql`

### Errore: "new row violates row-level security policy"
→ RLS policy mancante o errata. Verifica policies con:
```sql
SELECT * FROM pg_policies WHERE tablename = 'nome_tabella';
```

### Errore: "storage bucket not found"
→ Bucket non creato. Vai su Storage e crea `statements`

### Upload file fallisce
→ Verifica storage policies e MIME types consentiti

## 13. Costi

**Free Tier:**
- 500MB database
- 1GB storage
- 50,000 monthly active users
- 2GB bandwidth

**Pro ($25/mese):**
- 8GB database
- 100GB storage
- 100,000 MAU
- 250GB bandwidth
- Backup automatici

Per BillKiller, Free tier è sufficiente per iniziare.

## Support

- [Supabase Docs](https://supabase.com/docs)
- [Discord Community](https://discord.supabase.com)
