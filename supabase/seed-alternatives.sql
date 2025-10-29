-- Inserisci alternative reali per i servizi più comuni

-- Streaming Video
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, current_price, savings, affiliate_url, description, is_active) VALUES
('netflix', 'Amazon Prime Video', 4.99, 17.99, 72, 'https://www.amazon.it/amazonprime', 'Include anche spedizioni gratis e Prime Music', true),
('disney-plus', 'Rakuten TV', 0, 8.99, 100, 'https://www.rakuten.tv', 'Noleggio film singoli senza abbonamento', true),
('dazn', 'NOW TV Sport', 14.99, 44.99, 67, 'https://www.nowtv.it/sport', 'Sport in streaming a prezzo ridotto', true);

-- Streaming Musica
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, current_price, savings, affiliate_url, description, is_active) VALUES
('spotify', 'YouTube Music (con Premium)', 11.99, 10.99, -9, 'https://music.youtube.com', 'Include YouTube senza pubblicità', true),
('apple-music', 'Spotify Free', 0, 10.99, 100, 'https://www.spotify.com/it/free/', 'Versione gratuita con pubblicità', true);

-- Cloud Storage
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, current_price, savings, affiliate_url, description, is_active) VALUES
('google-one', 'pCloud Lifetime', 0, 1.99, 100, 'https://www.pcloud.com/it/', 'Pagamento unico, nessun abbonamento', true),
('dropbox', 'Google One 100GB', 1.99, 11.99, 83, 'https://one.google.com', 'Più economico con stesse funzioni', true),
('icloud', 'Google One 200GB', 2.99, 2.99, 0, 'https://one.google.com', 'Alternativa cross-platform', true);

-- Telefonia Mobile
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, current_price, savings, affiliate_url, description, is_active) VALUES
('vodafone', 'Iliad', 7.99, 25, 68, 'https://www.iliad.it', 'Giga illimitati a prezzo fisso', true),
('tim', 'ho. Mobile', 6.99, 20, 65, 'https://www.ho-mobile.it', 'Rete Vodafone a prezzo basso', true),
('wind', 'Very Mobile', 5.99, 15, 60, 'https://www.verymobile.it', 'Rete WindTre economica', true);

-- Palestra
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, current_price, savings, affiliate_url, description, is_active) VALUES
('virgin-active', 'McFIT', 19.90, 79, 75, 'https://www.mcfit.com/it/', 'Palestra low-cost 24/7', true),
('fitness-first', 'Allenamento a casa', 0, 50, 100, 'https://www.youtube.com/fitness', 'Video gratuiti su YouTube', true);

-- Software
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, current_price, savings, affiliate_url, description, is_active) VALUES
('adobe-creative-cloud', 'Canva Pro', 11.99, 60.49, 80, 'https://www.canva.com/pro', 'Design grafico più semplice', true),
('microsoft-365', 'Google Workspace', 6, 7, 14, 'https://workspace.google.com', 'Suite office online', true),
('zoom-pro', 'Google Meet', 0, 13.99, 100, 'https://meet.google.com', 'Videochiamate gratuite illimitate', true);

-- Gaming
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, current_price, savings, affiliate_url, description, is_active) VALUES
('playstation-plus', 'Xbox Game Pass', 9.99, 16.99, 41, 'https://www.xbox.com/it-IT/xbox-game-pass', 'Centinaia di giochi inclusi', true),
('nintendo-switch-online', 'Giochi free-to-play', 0, 19.99, 100, 'https://www.nintendo.it', 'Fortnite, Apex Legends gratis', true);

-- News & Giornali
INSERT INTO alternatives (merchant_canonical, alternative_name, alternative_price, current_price, savings, affiliate_url, description, is_active) VALUES
('corriere-digitale', 'Google News', 0, 9.99, 100, 'https://news.google.com', 'Notizie gratuite aggregate', true),
('repubblica-digitale', 'Apple News', 0, 7.99, 100, 'https://www.apple.com/apple-news/', 'Notizie gratuite su iOS', true);
