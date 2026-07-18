# Card — Component Contract (Design §31)

Statü (§32): **Beta → Stable adayı** (bu kontratla). Kaynak: `src/design-system/components/card.tsx`.

## Purpose
Editoryal içerik yüzeyi (§25, §29; Paper material). Ana Sayfa B3 hero, B4 check-in, B5 söz kartı kullanır.

## Responsibilities / Non-responsibilities
- **Yapar:** sabit slot sırası (header → content → media → footer), tüm-yüzey basılabilirlik, kart zemini/yüksekliği.
- **Yapmaz:** içerik tipografisi (çağıran Text rolleriyle), veri çekme, kaydırma, iç içe kart (context ile geliştirmede uyarılır — §25 yasak).

## Anatomy
`header` (satır) → `children` (içerik) → `media` (illüstrasyon alanı) → `footer` (satır). Sıra API ile ZORLANIR; çağıran değiştiremez.

## Variants
- **standard** (varsayılan): elevation level 1.
- **hero** (`hero` prop): elevation level 2 (§14.3 hero/highlight) — ekran başına tek hero önerilir.

## Sizes
Genişlik çağıranın; iç boşluk `s16`, slot arası `s4/s8`. Sabit yükseklik yok (içerik dikey büyür — §12.1).

## States (§33)
default · pressed (yalnız `onPress` verilmişse; ölçek/opacity geri bildirimi) · disabled (`opacity.disabled` + `accessibilityState`). Loading durumu kartın İÇERİĞİYLE (Skeleton slotları) temsil edilir.

## Interaction
`onPress` verilirse TÜM yüzey basılır (§25); kart içinde küçük hassas hedeflerden kaçınılır — istisna: basılMAYAN kartın footer mikro-eylemleri (B5), hedefler ≥48pt.

## Motion
Basılı geri bildirim `usePressFeedback` (duration.instant/feedback, §18.2); reduced-motion → statik opacity (§19).

## Haptics
Yok. Gerekirse çağıran yüzey §20 eşlemesiyle ekler.

## Accessibility
Basılabilir kart: `accessibilityRole="button"` + `accessibilityLabel` (çağıran anlamlı özet verir). Basılamayan kart şeffaf konteynerdir; slot içerikleri kendi semantiğini taşır.

## Responsive behavior
Genişlik sınıfı marjları çağıranın (§13.3); içerik dikey büyür, metin küçültülmez.

## Composition rules
Core bileşen (§49). İç içe Card YASAK. Media slotu illüstrasyon yuvası içindir (domain: HerbIllustration).

## Developer API
`header? · children? · media? · footer?: ReactNode` · `onPress?` · `hero?: boolean` · `disabled?` · `accessibilityLabel?` · `style?` · `testID?`.

## Design tokens
`radius.lg` · `space.s16/s8/s4` · `elevation.level1/level2` · `opacity.disabled` · semantic `surface.card`.

## Performance
Slot render'ı saf; basılı animasyon tek shared value. Liste kartlarında media slotuna ağır görsel verirken sabit yükseklik kullanın (yerleşim zıplamasın).

## Do / Don't
- **Do:** başlığı header, eylemleri footer slotuna koy; hero'yu ekranda bir kez kullan.
- **Don't:** kart içine kart; basılabilir kartın içine ikinci basılabilir hedef; renkli/sert gölge.

## Known limitations
Milk Glass / Atmospheric material varyantları yok (Faz 6 görsel kilidi); iOS'ta elevation ayrımı tonal kontrastla sınırlı (gölge yok — §14.2 öncelik).
