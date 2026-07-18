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

---

# Sprint 2.2A — Home Premium UI Refinement (branch: `feature/home-premium-ui`)

**Tarih:** 2026-07-17 · **Girdi:** Sprint 2.2 audit + ürün sahibi 2.2A onayı
(sıra ①–⑩; B3 fallback ONAYLI; B3→Keşif geçici köprüsü ONAYLI).

## Uygulanan kalemler

- **① B3 hero görseli:** emoji fallback'ler kaldırıldı (`🌿` yok; gezegen
  glifleri astronomik METİN sembolleri — spec örneği "Papatya · ☉").
  `HerbIllustration` domain bileşeni: `illus_ref` → varlık haritası
  (expo-image, sabit s96 yükseklik) · eşleşme yoksa üretim-güvenli pudra
  paletli dal motifi (saf View; nihai LoRA görselleri gelince YALNIZ harita
  dolar). Hero kart elevation level 2 (§14.3). **Açılış bitkisi (ONAYLI):**
  canlı/önbellek yoksa gömülü Papatya kartı — hero asla boş değil (madde 5
  KAPANDI); cümle spec'in kendi örnek tonu.
- **② Ambient arka plan:** semantic `ambient.wash/base` grubu (§45 adı;
  mevcut primitivler — yeni renk YOK) + `AmbientBackground` (expo-linear-
  gradient): günün saatine göre üstte yumuşak ışık yıkaması, nötr tabana
  erir; gün diliminde nötr. Etkileşimsiz (Atmospheric). Doku/grain kanonda
  somut tanımlı olmadığı için EKLENMEDİ (Faz 6).
- **③ Haptics (§20, onaylı kapsam):** `lib/haptics.ts` — duygu çipi seçimi →
  light, başarılı günlük kayıt → medium (yalnız GERÇEK kalıcılıkta;
  `saveCheckin` artık başarı bildirir). Başka haptic yok.
- **④ İskelet + sabit yükseklik:** B1 çip kabuğu, B2 satırı (48pt sabit),
  B3 medya alanı (s96) ve B5 kartı için bekleme iskeletleri — yerleşim
  zıplaması giderildi. Not: B5 havuz boş dönerse blok kanonik gereği
  kapanır (bugünkü canlı DB durumu).
- **⑤ Söz aktivasyonu:** canlı DB yeniden problandı (2026-07-17):
  `public.quotes` HÂLÂ YOK → aktive edilecek veri yok; kod yolu hazır,
  tablo+seed gelince blok kendiliğinden açılır (madde 4 geçerli).
- **⑥ Ay fazı glifi:** `MoonPhaseGlyph` domain bileşeni (§30 MoonPhase) —
  4 kanonik faz, saf View, emoji yok; B1 çipinde.
- **⑦ B5 mikro-eylemler:** kaydet ♡ (favori koleksiyonu `favorites.quotes.v1`,
  cihazda — gunun-sozu-spec §3, free sınırsız) · paylaş (sistem paylaşım
  sayfası, YALNIZ söz metni — atıf yok, GS-3/K2). Etiketler spec B5 birebir.
- **⑧ Living World A5 dilimi:** ambient katman + minimal scroll paralaksı
  (s96'da ≤s24) + TEK çevresel tepki (başarılı check-in → yumuşak ışık
  kayması, §21.2 "light shift"). Reduced-motion → statik dünya; sürekli
  döngü hiç yok → düşük-güç indirgemesi yapısal olarak boş küme
  (expo-battery dikişi use-motion-scale'de hazır).
- **⑨ Bileşen kontratları (§31):** `docs/components/` — chip · card ·
  reveal · ambient-background · moon-phase-glyph · herb-illustration.

## 2.2A açık kalemleri / sapmalar

1. **Yeni bağımlılıklar (onaya sunulur):** `expo-haptics`, `expo-linear-
   gradient` (ikisi de resmî Expo SDK 57 modülü, `npx expo install` ile
   sürüm-pinli). ③ ve ② bunlarsız uygulanamazdı.
2. **Söz paylaşımı ara adım:** R1.5 görsel şablon hattı (story 9:16 + kare,
   filigranlı) ayrı iş; bugünkü paylaşım metin tabanlı (yalnız söz).
3. **Çevirmeli kart (GS-1=b):** gunun-sozu-spec'in kapalı-kart ritüeli 2.2A
   onay listesinde OLMADIĞI için eklenmedi (kapsam genişletme yasağı);
   ayrı onayla gelir.
4. **Favoriler ekranı:** koleksiyon deposu hazır; liste ekranı ayrı iş
   kalemi (gunun-sozu-spec §3).
5. **timeOfDay saat dilimleri GEÇİCİ** (theme-provider) — master saat
   aralığı vermiyor; ambient degrade bu dilimleri kullanır.
6. **⑩ Cihaz kabulü AÇIK:** 60fps, Dynamic Type, TalkBack, reduced-motion,
   paralaks/ışık kayması hissi + A5 "cihazda onaylanmadan yayılmaz" kuralı.

## Cihaz kabulü — 1. tur bulguları (2026-07-18, Android dev build)

Yeni development build (expo-haptics + expo-linear-gradient native modülleri
ile) kuruldu; eski build'deki `IllegalViewOperationException` giderildi.

- **Geçen kalemler:** açılış/çökme yok · hero boş değil · emoji fallback yok ·
  ay glifi doğru · haptics çalışıyor (5-6) · iskelet zıplaması yok (8) ·
  Dynamic Type (13) · ~60fps scroll (14).
- **Haptic his notu (Görsel Kimlik'e):** titreşim var ama çok minimal
  bulundu; şiddet/his ayarı Görsel Kimlik (Faz 6) kalemi olarak not edildi —
  bu sprintte davranış değiştirilmedi.
- **7 (söz kaydet/paylaş) test edilemedi:** `quotes` tablosu yok (bilinen
  launch-blocker #3); tablo+seed sonrası ayrı tur.
- **12 (TalkBack) ertelendi.**
- **9-10-11 BULGU → TEŞHİS:** ambient/paralaks/ışık kayması cihazda hiç
  algılanmıyordu ("Animasyonları kaldır" KAPALI, ölçek 1x doğrulandı).
  - (a) reduced-motion başlangıç değeri `false` ve abonelik doğru —
    takılı "true" YOK, kusur değil.
  - (b) `AmbientBackground` gerçekten render oluyor; kök zemin arkasında,
    ScrollView şeffaf — örtülme YOK, kusur değil.
  - (c) **KÖK NEDEN:** ilk ambient hex'leri tabana kanal başına Δ≤9/255
    uzaklıktaydı — gerçek ekranda algı eşiğinin altı. Paralaks ve ışık
    kayması bu görünmez katman üzerinde çalıştığı için onlar da görünmezdi
    (transform/opacity mantığı doğru). Ayrıca test saati "day" dilimine
    denk geldiyse degrade tasarım gereği nötrdür (onaylı davranış).
  - **DÜZELTME:** yalnız GEÇİCİ işaretli `primitive.color.ambient`
    morning/evening/night değerleri algılanabilir pastel düzeye
    derinleştirildi (baskın kanal Δ≈15–26/255; day nötr, LOCKED). Kod/
    davranış değişikliği yok. Nihai tonlar Faz 6 Görsel Kimlik'te.
- **2. tur (2026-07-18, evening dilimi): 9✓ 10✓ 11✓** — derinleştirilmiş
  tonlarla ambient yıkama, scroll paralaksı ve check-in ışık kayması cihazda
  algılanabilir ve süptil; reduced-motion hareketi durduruyor.
- **Kabul durumu:** 12 (TalkBack) ERTELENDİ; 7 quotes tablosunu bekliyor.
  Diğer tüm kalemler ürün sahibi tarafından KABUL edildi → Sprint 2.2A
  commit onayı verildi (2026-07-18).
