-- Inserisci alternative reali per i servizi più comuni

-- Streaming Video
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, savings_percentage, affiliate_url, description, category, is_active) VALUES
('netflix', 'Amazon Prime Video', 4.99, 72, 'https://www.amazon.it/amazonprime', 'Include anche spedizioni gratis e Prime Music', 'Streaming Video', true),
('disney-plus', 'Rakuten TV', 0, 100, 'https://www.rakuten.tv', 'Noleggio film singoli senza abbonamento', 'Streaming Video', true),
('dazn', 'NOW TV Sport', 14.99, 67, 'https://www.nowtv.it/sport', 'Sport in streaming a prezzo ridotto', 'Sport', true);

-- Streaming Musica
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, savings_percentage, affiliate_url, description, category, is_active) VALUES
('spotify', 'YouTube Music', 9.99, 0, 'https://music.youtube.com', 'Include YouTube senza pubblicità', 'Musica', true),
('apple-music', 'Spotify Free', 0, 100, 'https://www.spotify.com/it/free/', 'Versione gratuita con pubblicità', 'Musica', true);

-- Cloud Storage
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, savings_percentage, affiliate_url, description, category, is_active) VALUES
('google-one', 'pCloud Lifetime', 175, 100, 'https://www.pcloud.com/it/', 'Pagamento unico 500GB, nessun abbonamento mensile', 'Cloud Storage', true),
('dropbox', 'Google One 100GB', 1.99, 83, 'https://one.google.com', 'Più economico con stesse funzioni', 'Cloud Storage', true),
('icloud', 'Google One 200GB', 2.99, 0, 'https://one.google.com', 'Alternativa cross-platform', 'Cloud Storage', true);

-- Telefonia Mobile
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, savings_percentage, affiliate_url, description, category, is_active) VALUES
('vodafone', 'Iliad', 7.99, 68, 'https://www.iliad.it', 'Giga illimitati a prezzo fisso', 'Telefonia', true),
('tim', 'ho. Mobile', 6.99, 65, 'https://www.ho-mobile.it', 'Rete Vodafone a prezzo basso', 'Telefonia', true),
('wind', 'Very Mobile', 5.99, 60, 'https://www.verymobile.it', 'Rete WindTre economica', 'Telefonia', true);

-- Palestra
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, savings_percentage, affiliate_url, description, category, is_active) VALUES
('virgin-active', 'McFIT', 19.90, 75, 'https://www.mcfit.com/it/', 'Palestra low-cost 24/7', 'Fitness', true),
('fitness-first', 'Allenamento a casa', 0, 100, 'https://www.youtube.com/fitness', 'Video gratuiti su YouTube', 'Fitness', true);

-- Software
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, savings_percentage, affiliate_url, description, category, is_active) VALUES
('adobe-creative-cloud', 'Canva Pro', 11.99, 80, 'https://www.canva.com/pro', 'Design grafico più semplice', 'Design', true),
('microsoft-365', 'Google Workspace', 6, 14, 'https://workspace.google.com', 'Suite office online', 'Produttività', true),
('zoom-pro', 'Google Meet', 0, 100, 'https://meet.google.com', 'Videochiamate gratuite illimitate', 'Produttività', true);

-- Gaming
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, savings_percentage, affiliate_url, description, category, is_active) VALUES
('playstation-plus', 'Xbox Game Pass', 9.99, 41, 'https://www.xbox.com/it-IT/xbox-game-pass', 'Centinaia di giochi inclusi', 'Gaming', true),
('nintendo-switch-online', 'Giochi free-to-play', 0, 100, 'https://www.nintendo.it', 'Fortnite, Apex Legends gratis', 'Gaming', true);

-- News & Giornali
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, savings_percentage, affiliate_url, description, category, is_active) VALUES
('corriere-digitale', 'Google News', 0, 100, 'https://news.google.com', 'Notizie gratuite aggregate', 'News', true),
('repubblica-digitale', 'Apple News', 0, 100, 'https://www.apple.com/apple-news/', 'Notizie gratuite su iOS', 'News', true);

-- VPN
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, savings_percentage, affiliate_url, description, category, is_active) VALUES
('nordvpn', 'NordVPN Piano 2 anni', 3.99, 67, 'https://nordvpn.com/it/', '3 mesi gratis inclusi', 'VPN', true),
('expressvpn', 'Surfshark', 2.49, 75, 'https://surfshark.com/it', 'Dispositivi illimitati', 'VPN', true);
