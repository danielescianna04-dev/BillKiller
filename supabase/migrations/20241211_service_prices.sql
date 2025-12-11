-- Tabella per memorizzare i prezzi dei servizi estratti con AI
CREATE TABLE IF NOT EXISTS service_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_key TEXT UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  period TEXT DEFAULT 'monthly' CHECK (period IN ('monthly', 'yearly', 'one-time')),
  plan_name TEXT,
  source_url TEXT,
  confidence DECIMAL(3,2) DEFAULT 0.8,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indice per query veloci
CREATE INDEX IF NOT EXISTS idx_service_prices_key ON service_prices(service_key);
CREATE INDEX IF NOT EXISTS idx_service_prices_updated ON service_prices(last_updated);

-- Aggiungi colonna last_price_check alla tabella alternatives se non esiste
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'alternatives' AND column_name = 'last_price_check'
  ) THEN
    ALTER TABLE alternatives ADD COLUMN last_price_check TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Vista per unire prezzi reali con alternative
CREATE OR REPLACE VIEW v_alternatives_with_prices AS
SELECT
  a.*,
  sp.price AS current_market_price,
  sp.plan_name AS market_plan_name,
  sp.last_updated AS price_last_updated,
  sp.confidence AS price_confidence,
  CASE
    WHEN sp.price IS NOT NULL AND sp.price > a.alternative_price
    THEN ROUND(((sp.price - a.alternative_price) / sp.price * 100)::numeric, 0)
    ELSE a.savings_percentage
  END AS calculated_savings
FROM alternatives a
LEFT JOIN service_prices sp ON sp.service_key = a.merchant_canonical;

-- Commento sulla tabella
COMMENT ON TABLE service_prices IS 'Prezzi dei servizi estratti automaticamente con AI web scraping';
COMMENT ON VIEW v_alternatives_with_prices IS 'Vista che combina alternative con prezzi di mercato reali';
