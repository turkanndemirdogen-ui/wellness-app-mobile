# AmbientBackground — Component Contract (Design §31)

Statü (§32): **Experimental** (A5 dilimi cihazda onaylanana dek — A5 kuralı: onaysız yayılmaz). Kaynak: `src/design-system/components/ambient-background.tsx`.

## Purpose
Living World katman 1 (Environment, §21.1): ekran arkasına günün saat diliminin yumuşak ışık yıkaması (§11.5 adaptive ambient; §15 Atmospheric material).

## Responsibilities / Non-responsibilities
- **Yapar:** ambient degrade (wash → base), minimal scroll paralaksı, tek çevresel tepki (light shift, §21.2).
- **Yapmaz:** etkileşim (Atmospheric kuralı: pointerEvents none), içerik, parçacık/döngü, navigasyon geçişi.

## Anatomy
Absolute-fill katman: taban LinearGradient (wash→base, üst ~%60) + tepki anında görünen derin yıkama katmanı (opacity 0 tabanlı).

## Variants
Yok — görünüm `timeOfDay` runtime token'ından türetilir (morning/day/evening/night). Gün diliminde wash === base → degrade nötr/görünmez.

## Sizes
Ebeveynini doldurur.

## States
static (varsayılan) · parallax (scrollY verildiğinde) · responding (responseSignal artışında bir kez).

## Interaction
YOK — dokunuşları asla yakalamaz.

## Motion
- Paralaks: scroll'a bağlı pasif interpolasyon; `s96` kaydırmada en çok `s24` kayma (environmental kategori, §18).
- Light shift: hero süre bandında yüksel-sön (tek atış; sürekli döngü YOK).
- Reduced-motion / düşük güç (§21.4, §19): statik dünya — paralaks ve tepki tamamen kapalı. Sürekli döngü hiç olmadığından düşük-güçte ek indirgeme gerekmez.

## Haptics
Yok (§20: ambient motion → none).

## Accessibility
Salt dekoratif; içerik taşımaz. Okunabilirlik: ambient tonlar kontrastı değiştirmez (§11.5 garanti — semantic çekirdek renkler sabit).

## Responsive behavior
Tüm genişlik sınıflarında aynı; degrade oransal.

## Composition rules
Core (§49). Ekran kökünde, kaydırılabilir içeriğin ARKASINA yerleştirilir; ekranda en fazla bir adet.

## Developer API
`scrollY?: SharedValue<number>` (paralaks) · `responseSignal?: number` (her artışta tek light shift).

## Design tokens
semantic `ambient.wash/base` · `space.s96/s24` (paralaks aralığı) · `duration.hero` · `easing.decelerate/standard`.

## Performance
UI-thread interpolasyon (reanimated); zamanlayıcı/döngü yok; pil dostu (timeOfDay yalnız önplan dönüşünde tazelenir — theme-provider).

## Do / Don't
- **Do:** ekran başına bir kez, kökte kullan; tepkiyi yalnız anlamlı tamamlanma anına bağla.
- **Don't:** üstüne etkileşim koyma; sinematik/dramatik geçiş için kullanma; birden çok tepkiyi arka arkaya tetikleme.

## Known limitations
Texture/grain katmanı yok (kanonda tanımlı somut doku varlığı yok — Faz 6); low-power sinyali stub (expo-battery bağımlılık onayı bekliyor, use-motion-scale ile aynı dikiş). A5 gereği cihaz onayı olmadan diğer ekranlara yayılmaz.
