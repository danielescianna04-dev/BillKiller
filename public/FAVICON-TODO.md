# Genera Favicon

1. Vai su https://realfavicongenerator.net
2. Carica logo.svg
3. Scarica il pacchetto
4. Copia questi file in /public/:
   - favicon.ico
   - apple-touch-icon.png
   - icon-192.png
   - icon-512.png
   - og-image.png (1200x630)

Oppure usa questo comando se hai ImageMagick:
```bash
convert logo.svg -resize 32x32 favicon.ico
convert logo.svg -resize 180x180 apple-touch-icon.png
convert logo.svg -resize 192x192 icon-192.png
convert logo.svg -resize 512x512 icon-512.png
convert og-image.svg og-image.png
```
