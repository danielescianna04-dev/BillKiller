-- Tabella per alternative economiche
CREATE TABLE IF NOT EXISTS alternatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_canonical TEXT NOT NULL UNIQUE,
  alternative_name TEXT NOT NULL,
  alternative_price DECIMAL(10,2) NOT NULL,
  savings_percentage INTEGER NOT NULL,
  affiliate_url TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  last_price_check TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index per ricerche veloci
CREATE INDEX idx_alternatives_merchant ON alternatives(merchant_canonical);
CREATE INDEX idx_alternatives_active ON alternatives(is_active);

-- Inserisci dati iniziali
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, savings_percentage, affiliate_url, description, category) VALUES
('nordvpn', 'NordVPN Piano 2 anni', 3.99, 67, '/go/nordvpn', '3 mesi gratis inclusi', 'VPN'),
('expressvpn', 'NordVPN', 3.99, 60, '/go/nordvpn', 'Stessa qualità, prezzo migliore', 'VPN'),
('dropbox', 'pCloud Lifetime', 4.99, 50, '/go/pcloud', 'Paghi una volta, usi per sempre', 'Cloud Storage'),
('google-one', 'pCloud', 4.99, 40, '/go/pcloud', 'Più spazio, meno costo', 'Cloud Storage'),
('netflix', 'Disney+ Bundle', 5.99, 40, '/go/disney', 'Piano annuale con sconto', 'Streaming'),
('prime-video', 'Disney+', 5.99, 33, '/go/disney', 'Contenuti esclusivi a meno', 'Streaming'),
('adobe-creative-cloud', 'Canva Pro', 9.99, 80, '/go/canva', 'Più semplice, molto più economico', 'Design'),
('spotify', 'YouTube Music', 9.99, 0, '/go/youtube-music', 'Stesso prezzo, include YouTube Premium', 'Musica'),
('apple-music', 'Spotify', 9.99, 0, '/go/spotify', 'Libreria più ampia', 'Musica'),
('peloton', 'Apple Fitness+', 9.99, 70, '/go/apple-fitness', 'Stessi workout, prezzo migliore', 'Fitness')
ON CONFLICT (merchant_canonical) DO NOTHING;
