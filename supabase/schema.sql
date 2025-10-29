-- Users table (extends auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sources (file uploads, email connections)
CREATE TABLE sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('statement', 'gmail', 'outlook')),
  label TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Raw transactions from statements/emails
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  account_ref TEXT,
  occurred_at DATE NOT NULL,
  description TEXT NOT NULL,
  raw_merchant TEXT,
  merchant_canonical TEXT,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  hash TEXT UNIQUE,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Detected subscriptions
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  merchant_canonical TEXT NOT NULL,
  title TEXT NOT NULL,
  periodicity TEXT DEFAULT 'unknown' CHECK (periodicity IN ('monthly', 'yearly', 'quarterly', 'semiannual', 'unknown')),
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  confidence NUMERIC(3,2) DEFAULT 0.5,
  first_seen DATE,
  last_seen DATE,
  email_hint TEXT,
  payment_hint TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, merchant_canonical)
);

-- Links transactions to subscriptions
CREATE TABLE subscription_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  UNIQUE(subscription_id, transaction_id)
);

-- Affiliate offers
CREATE TABLE merchant_affiliates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_name TEXT NOT NULL,
  partner_name TEXT NOT NULL,
  offer_url TEXT NOT NULL,
  discount_info TEXT,
  cpa NUMERIC(10,2),
  active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate click tracking
CREATE TABLE affiliate_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  referer TEXT
);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_links ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users FOR ALL USING (auth.uid() = id);
CREATE POLICY "Sources policy" ON sources FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Transactions policy" ON transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Subscriptions policy" ON subscriptions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Links policy" ON subscription_links FOR ALL USING (auth.uid() = user_id);

-- View for monthly equivalents
CREATE VIEW v_subscriptions_monthly AS
SELECT 
  *,
  CASE 
    WHEN periodicity = 'monthly' THEN amount
    WHEN periodicity = 'yearly' THEN amount / 12
    WHEN periodicity = 'quarterly' THEN amount / 3
    WHEN periodicity = 'semiannual' THEN amount / 6
    ELSE amount
  END as monthly_amount
FROM subscriptions
WHERE status = 'active';

-- Indexes
CREATE INDEX idx_transactions_user_merchant ON transactions(user_id, merchant_canonical);
CREATE INDEX idx_subscriptions_user_active ON subscriptions(user_id, status);
CREATE INDEX idx_transactions_occurred_at ON transactions(occurred_at);

-- Storage bucket (create via dashboard, then add policies)
-- Bucket name: statements
-- Public: false
-- File size limit: 10MB
-- Allowed MIME types: text/csv, application/pdf

-- Storage policies (run after creating bucket)
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'statements' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'statements' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'statements' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
