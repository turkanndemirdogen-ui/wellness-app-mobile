# Wellness App — Mobil İskelet (base shell)

Bu klasör uygulamanın **çalışan iskeletidir**: 4 sekmeli navigasyon + Supabase
bağlantı yapısı. Astro/RAG/içerik henüz YOK — sadece ayakta duran kabuk.

## Telefonunda açmak için (en kolay yol)

1. Telefonuna **Expo Go** uygulamasını kur (App Store / Google Play).
2. Bilgisayarda bu klasörde terminal aç ve şunu yaz:

   ```
   npm run start
   ```

   (veya `npx expo start`)

3. Terminalde bir **QR kod** çıkacak.
   - **iPhone:** Kamera uygulamasıyla QR'ı okut.
   - **Android:** Expo Go içindeki "Scan QR code" ile okut.
4. Uygulama telefonunda açılır. Alt tarafta 4 sekme göreceksin:
   **🌙 Ana Sayfa · 🔮 Keşif · 🌿 Bahçe · 💬 Sohbet**

> Bilgisayar ve telefon **aynı Wi-Fi ağında** olmalı. Olmazsa terminalde
> `npx expo start --tunnel` dene (biraz yavaş ama farklı ağlarda da çalışır).

## Supabase bağlantısı (sen dolduracaksın)

Bağlantı yapısı kuruldu ama anahtarlar sende. İskeleti test etmek için şart değil
— anahtar yokken uygulama yine açılır, sadece Supabase devre dışı kalır.

Hazır olduğunda:

1. `.env.example` dosyasını `.env` olarak kopyala.
2. İçindeki iki değeri Supabase panelinden doldur (URL + anon public key).
3. `npm run start` ile yeniden başlat.

`.env` git'e girmez (güvenlik). Sadece **anon (public)** anahtar kullanılır;
`service_role` anahtarı asla buraya konmaz.

## Sekme sırası

`ARCHITECTURE_DECISIONS.md §3` (Navigasyon C, kilitli) sırasına göre:
**Ana Sayfa · Keşif · Bahçe · Sohbet.** Değiştirmek istersen
`src/app/_layout.tsx` içinde sekme sırası tek yerde.

## Dosya haritası

- `src/app/_layout.tsx` — 4 sekme tanımı (navigasyon)
- `src/app/index.tsx` · `sohbet.tsx` · `kesif.tsx` · `bahce.tsx` — sekme ekranları
- `src/components/empty-screen.tsx` — ortak yer tutucu ekran
- `src/lib/supabase.ts` — Supabase istemcisi (anahtar yoksa güvenli şekilde kapalı)
- `.env.example` — doldurulacak ortam değişkenleri şablonu
