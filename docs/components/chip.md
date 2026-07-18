# Chip — Component Contract (Design §31)

Statü (§32): **Beta → Stable adayı** (bu kontratla). Kaynak: `src/design-system/components/chip.tsx`.

## Purpose
Seçilebilir filtre / hızlı-seçim çipi (§29). Ana Sayfa B4 duygu seti ve B5 mikro-eylemleri kullanır.

## Responsibilities / Non-responsibilities
- **Yapar:** tek satırlık etiketli, basılabilir, seçilebilir hap; seçim durumunu iki kanalda bildirir.
- **Yapmaz:** çoklu seçim yönetimi, grup düzeni (satır/sarma çağıranın), giriş/silme (input-chip değildir), ikon barındırma.

## Anatomy
Hap zemin (Pressable) → etiket (`Text role="label"`). Tek slot: `label`.

## Variants
Tek görsel varyant. Davranışsal ayrım: kalıcı seçim (selected yönetilir) veya anlık eylem (selected hiç verilmez — B5 "paylaş").

## Sizes
Tek boyut: görünür yükseklik `s40` + `hitSlop s4` → etkin hedef 48pt.

## States (§33)
default · pressed (zemin `surface.selected`) · selected (zemin + `600` ağırlık + `accessibilityState.selected`) · disabled (`opacity.disabled` + `accessibilityState.disabled`). Belirsiz durum yok.

## Interaction
Tap → `onPress`. Basılı geri bildirim hareketsiz zemin değişimi (ListItem deseni).

## Motion
Yok (zemin değişimi anlık) → reduced-motion'da kayıpsız (§19).

## Haptics
Bileşen İÇİNDE yok. Çağıran yüzey §20 eşlemesiyle verir (B4: seçim → light; `lib/haptics`). Haptic tek kanal değildir.

## Accessibility
`accessibilityRole="button"`, `accessibilityLabel` (varsayılan: label), `accessibilityState.{selected,disabled}`. Seçim renk-tek-kanal değil (§43): renk + ağırlık + state.

## Responsive behavior
İçerik genişliğinde; satır düzeni/sarma çağıranın (`flexWrap`). Dynamic Type: etiket rol rampasıyla büyür, `minHeight` alttan sınırlar.

## Composition rules
Core bileşen — yalnız foundation + token (§49). Kart içinde footer/satır olarak kullanılabilir; Chip içine bileşen konmaz.

## Developer API
`label: string` · `selected?: boolean` · `disabled?: boolean` · `onPress?: () => void` · `accessibilityLabel?: string` · `style?` · `testID?`.

## Design tokens
`space.s40/s16/s4` · `radius.full` · `borderWidth.thin` · `opacity.disabled` · semantic `surface.base/selected`, `border.subtle/strong`.

## Performance
Durum yok, animasyon yok; liste içinde güvenle çoğaltılır.

## Do / Don't
- **Do:** kısa tek satır etiket; anlık eylem çipinde `selected` hiç verme.
- **Don't:** uzun cümle; çip içinde ikon/emoji; navigasyon sekmesi yerine kullanma.

## Known limitations
İkonlu/silinebilir (input) çip varyantı yok — ihtiyaç doğarsa §50 onay adımıyla genişletilir.
