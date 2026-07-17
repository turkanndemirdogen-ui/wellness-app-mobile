# Ana Sayfa "Günlük Pusula" — Uygulama Notları ve Açık Kalemler

**Branch:** `feature/home-daily-compass` · **Tarih:** 2026-07-17
**Kaynaklar:** `specs/ana-sayfa-spec.md` v1.2 (kilitli) · Design Master v1.0 ·
Roadmap Phase 4 (v1 izinleri) · Editorial/Safety master

Bu belge yeni ürün kararı İÇERMEZ; kilitli spec'in bugünkü modül setiyle
uygulanışındaki boşlukları ve ürün sahibi onayı bekleyen kalemleri raporlar
(Governance §7: belirsizlik raporlanır, sessizce çözülmez).

## Uygulanan (spec'e birebir)

- **B1** Gün başlığı (display serif) + ay çipi (glif + "Ay X'te · faz"); veri
  yoksa çip sessizce gizlenir. Kişiselleştirme yok.
- **B2** Kozmik hava satırı (free): canlı DB `match_engine_rules` kuralının
  `user_text_variants`ından günlük deterministik seçim; YALNIZ transit-only
  kurallar (natal iması free yüzeye sızmaz). Tap → Keşif.
- **B3** Günün bitki kartı: canlı `herbs` havuzundan deterministik günlük
  seçim; havuz filtresi `app_safe=true` + `uyari_chip` YOK (T1–T3 karta
  girmez). Kart metni yalnız `tek_satir` (doz/tüketim dili içerik kontratında
  zaten yok).
- **B4** "Bugünün kaydı" kanıt bölgesi: başlıkçık + ayrık kart; 6 hızlı duygu
  çipi (`modules/mood.json` id+label birebir); tek dokunuş kayıt; aynı gün
  ikinci seçim = güncelleme (çift kayıt yok). Sayı baskısı/ceza dili yok.
- **B5** Günün sözü: global günlük seçim, atıfsız; havuz yoksa blok gizli.
- **B6** Dinamik slot: kural merdiveni değerlendirildi; bugünkü modül setiyle
  hiçbir koşul sağlanamıyor → slot render edilmez (ekran 5 blokla tamam,
  spec'in tanımladığı geçerli hal).
- **Haller:** iskelet sabit yükseklikli; önbellek düşüşü (stale) lib/query'de;
  "Şu an göğe ulaşamıyoruz…" satırı yalnız tüm sembolik bölge boşsa.
- **Chip** çekirdek bileşeni eklendi (Design §29 / A2 Sprint 1 listesinden —
  yeni kategori değil, planlı setin ilk dilimi).

## Roadmap Phase 4 izinleriyle v1 sadeleştirmeleri

- Kart/satır/söz seçimi **deterministik günlük rotasyon** (tarih karması);
  canlı transit motoru (Swiss Ephemeris, Arch Faz 5) gelince aynı seçim
  fonksiyonları gerçek `dominant_light`/tetiklere bağlanır.
- Gök verisi hâlâ **mock sağlayıcı**dan (Faz 1 köprüsü); B2 satırının kural
  eşleşmesi ve B3 havuzu ise GERÇEK canlı DB'den.

## Ürün sahibi onayı bekleyen kalemler

1. **B3 tap hedefi (SAPMA):** Spec B3 → Bahçe `herb_detail`; o ekran Faz
   6/Bahçe fazında. Geçici köprü **Keşif listesine** verildi (bilgi bugün
   orada yaşıyor, §7.1). Kalıcı çözüm herb_detail ile gelir.
2. **B4 "＋" tam palet:** Tam duygu paleti mood modülü (Phase 5) ekranıdır;
   bu fazda yalnız 6'lı hızlı set var. "＋" çipi eklenmedi (hedef ekran yok —
   ölü uç üretmemek için). Phase 5'te açılır.
3. **B4 hatırlatma satırı:** `reminder_settings` ve hatırlatma modülü yok;
   spec'teki sessiz "hatırlatma kur" bağlantısı hedefsiz kalacağı için bu
   fazda çizilmedi. Modül gelince şeride eklenir.
4. **B5 söz havuzu (launch-blocker #3):** `quotes` tablosu canlı DB'de yok;
   istemci kontratı hazır (`soz_id, text_tr`), tablo+seed gelince blok
   kendiliğinden açılır. `content/soz-havuzu.json` (~90 söz) DB'ye taşınmayı
   bekliyor — kök repo seed pipeline'ına eklenmesi ayrı iş.
5. **Açılış bitkisi kartı:** Spec "ilk açılış + cache yok → sabit açılış
   bitkisi (Papatya)" der; içerik uygulamaya gömülmediği (tek kaynak Supabase)
   için bu hal şimdilik "kart gizli + yumuşak çevrimdışı satırı". Gömülü
   açılış kartı istenirse içerik/mimari kararı gerekir.
6. **Microcopy — KAPANDI (dil incelemesi: Türkan, 2026-07-17):** `home-copy.ts`
   içindeki tüm görünen ve erişilebilirlik metinleri onaylandı. Onay sırasında
   tek düzeltme: kayıt-sonrası ipucu "— dilersen" → ". Dilersen" (nokta ile
   iki cümle).
7. **"hüzünlü" → "üzgün":** Spec B4 önerisindeki "hüzünlü", kanonik
   `modules/mood.json`'da "üzgün" (id: sad). Kanonik sözlük esas alındı.
8. **Check-in kaydı yerel:** Auth (Phase 2) ve `mood_logs` yokken kayıt
   cihazda (`checkin.v1.<gün>`); şema mood_logs çekirdek alt kümesi. Sunucu
   şeması gelince taşıma/eşitleme işi doğar.

## Doğrulama

- `npx tsc --noEmit` + `npm run lint` (token gate dahil) — bu branch'te
  temiz olmalı; sonuçlar PR açıklamasında.
- Gerçek cihaz doğrulaması (60fps, Dynamic Type, TalkBack, reduced-motion)
  Phase kapanış şartı olarak AÇIK.
