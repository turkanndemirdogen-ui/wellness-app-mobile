/**
 * Foundation primitives (Design §28) — çekirdek bileşenler (§29, T7+) yalnız
 * bunlardan ve token'lardan kurulur (§49 bağımlılık kuralı).
 *
 * Ad çakışması (§34): RN'in Text/View'ü ile çakışan adlar tüketicide bu
 * modülden import edilerek çözülür; marka adı öneki KULLANILMAZ.
 */

export { Surface, type SurfaceProps, type SurfaceRole, type RadiusKey } from './surface';
export { Stack, type StackProps, type SpaceKey } from './stack';
export { Text, type TextProps, type TextRole, type TextTone } from './text';
export { Icon, type IconProps, type IconName, type IconSize } from './icon';
export { Divider, type DividerProps } from './divider';
export { Spacer, type SpacerProps } from './spacer';
