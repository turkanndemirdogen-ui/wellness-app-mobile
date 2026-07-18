# Reveal — Component Contract (Design §31)

Statü (§32): **Beta → Stable adayı** (bu kontratla). Kaynak: `src/design-system/components/reveal.tsx`.

## Purpose
Durum geçişi cross-fade'i: beklenen içerik geldiğinde yumuşak belirme (§17 sorusu: "ne değişti"; §19: zoom yerine opacity).

## Responsibilities / Non-responsibilities
- **Yapar:** çocuk içeriği bir kez FadeIn ile gösterir.
- **Yapmaz:** çıkış animasyonu, liste sıralı belirme (stagger), yükleme durumu yönetimi (Skeleton çağıranın).

## Anatomy
Tek sarmalayıcı: `children`.

## Variants
Yok.

## Sizes
İçerik boyutunda; kendi boyutu yok.

## States
Yalnız giriş anı; kalıcı durum taşımaz.

## Interaction
Yok (şeffaf sarmalayıcı; dokunuşlar çocuğa geçer).

## Motion
`FadeIn` — `duration.component` bandı (§18.2), tek arayüz animasyonu sayılır (§18.3 bütçe).

## Haptics
Yok.

## Accessibility
Semantik eklemez; içerik kendi rollerini taşır. Reduced-motion'da içerik animasyonsuz ve TAM görünür (bilgi kaybolmaz, §19).

## Responsive behavior
İçeriğe şeffaftır.

## Composition rules
Core (§49). İskelet→içerik değişiminde içeriğin etrafına sarılır; iskeletin kendisine sarılmaz.

## Developer API
`children: ReactNode` · `style?`.

## Design tokens
`duration.component` (motion köprüsünden).

## Performance
motionScale=0 → düz View (sıfır maliyet); aksi halde tek entering animasyonu.

## Do / Don't
- **Do:** asenkron gelen blokların ilk görünümünde kullan.
- **Don't:** her render'da anahtar değiştirerek tekrar tetikleme; navigasyon geçişi olarak kullanma.

## Known limitations
Çıkış (FadeOut) ve layout geçişi kapsam dışı — ihtiyaç doğarsa §50 adımıyla genişletilir.
