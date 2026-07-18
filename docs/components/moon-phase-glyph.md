# MoonPhaseGlyph — Component Contract (Design §31)

Statü (§32): **Beta**. Kaynak: `src/domain-ui/moon-phase-glyph.tsx` (domain katmanı, §30 "MoonPhase" kategorisi).

## Purpose
Faz-özel ay glifi (ana-sayfa-spec B1 "ay fazı glifi"). Emoji/ikon-font kullanmadan (§16.1) dört kanonik fazı çizer.

## Responsibilities / Non-responsibilities
- **Yapar:** yeni · ilk_dordun · dolunay · son_dordun fazlarının minimal disk temsili.
- **Yapmaz:** faz hesabı, metin (faz adı bağlamdaki Text'te), 8-faz ince ayrımı (astro sözleşmesi 4 faz).

## Anatomy
İnce çerçeveli daire (overflow hidden) + fazın aydınlık dolgusu (tam / sağ yarı / sol yarı / boş).

## Variants
Faz başına görünüm; büyüyen ay sağdan (ilk dördün sağ yarı), küçülen soldan dolar.

## Sizes
`size.icon` anahtarları (`sm` varsayılan).

## States
Durumsuz (salt gösterim).

## Interaction
Yok.

## Motion
Yok (faz değişimi günlük veri olayıdır; geçiş animasyonu gereksiz — §17 testi).

## Haptics
Yok.

## Accessibility
Dekoratif — ağaçtan gizli (§43.1); faz adı bitişik görünür metinde taşınır.

## Responsive behavior
Token boyutunda sabit; Dynamic Type'tan bağımsız (bitişik metin büyür, glif ikon kuralına uyar).

## Composition rules
Domain → yalnız foundation/token (§49). Çip/satır içinde metinle yan yana kullanılır.

## Developer API
`phase: 'yeni' | 'ilk_dordun' | 'dolunay' | 'son_dordun'` · `size?: keyof size.icon`.

## Design tokens
`size.icon.*` · `radius.full` · `borderWidth.thin` · semantic `text.secondary`.

## Performance
İki statik View; maliyet yok.

## Do / Don't
- **Do:** faz bilgisini her zaman metinle birlikte ver.
- **Don't:** glifi tek bilgi kanalı yapma; emoji ay ile karıştırma.

## Known limitations
Hilal/şişkin (8-faz) çizimi yok — astro sözleşmesi 4 faza genişlerse SVG/ikon seti kararıyla birlikte ele alınır (Faz 6).
