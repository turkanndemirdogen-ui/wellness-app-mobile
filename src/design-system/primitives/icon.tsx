/**
 * Icon — ikon primitive'i (Design §28).
 *
 * İç temsil `lucide-react-native` SVG ikonlarıdır (react-native-svg üzerinden
 * render). API kararlıdır (`<Icon name="moon" />`) — Phase 3 geçişinde YALNIZ
 * bu dosyanın içi emoji'den SVG'ye döndü; çağıran kod değişmedi.
 *
 * Erişilebilirlik (§43.1): dekoratif ikon a11y ağacından gizlenir; işlevsel
 * ikon `label` ile adlandırılır. Boyut ve renk token kaynaklıdır.
 */

import {
  AlertCircle,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronLeft,
  Info,
  Leaf,
  MessageCircle,
  Moon,
  Orbit,
  Search,
  Share2,
  Sparkles,
  Sprout,
  X,
} from 'lucide-react-native';

import { primitive } from '../tokens/primitive.generated';
import { useTheme } from '../theme';

/**
 * IconSource — P2 MIGRATION BOUNDARY. Phase 3'te 'svg' (lucide-react-native +
 * react-native-svg) aktif edildi; yeni native build GEREKMEDİ (react-native-svg
 * P2 glyph setinde zaten linkli). Emoji temsili geride bırakıldı.
 */
export type IconSource = 'emoji' | 'svg';
export const ICON_SOURCE: IconSource = 'svg';

// UI ikon adları → lucide component. İçerik-alanı eşlemeleri (ör. gezegen
// glyph'leri, lib/content.ts PLANET_GLYPH) burada DEĞİL — bu set yalnız arayüz
// ikonları. Eşleme Phase 3'te kilitlendi (crystalBall→Orbit ürün kararı).
// İlk blok: P1/P2 tab + vurgu ikonları. İkinci blok: Phase 3 çekirdek component
// ikonları (input/search/error/back/notice) — hepsi Icon API'sinden geçer.
const ICONS = {
  moon: Moon,
  crystalBall: Orbit,
  herb: Leaf,
  chat: MessageCircle,
  seedling: Sprout,
  sparkles: Sparkles,
  alert: AlertCircle,
  search: Search,
  close: X,
  back: ChevronLeft,
  info: Info,
  check: Check,
  bookmark: Bookmark,
  savedBookmark: BookmarkCheck,
  share: Share2,
};

export type IconName = keyof typeof ICONS;

/** Tüm UI ikon adları (dev-gallery vitrini + sözleşme testleri için). */
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

// Boyutlar token kaynağından (size.icon).
const SIZES = primitive.size.icon;

export type IconSize = keyof typeof SIZES;

export type IconProps = {
  name: IconName;
  size?: IconSize;
  /** true → salt süsleme; ekran okuyucudan gizlenir (§43.1). */
  decorative?: boolean;
  /** İşlevsel ikonun ekran okuyucu etiketi. */
  label?: string;
  /** Stroke rengi; verilmezse tema text.primary (currentColor deseni). */
  color?: string;
};

export function Icon({ name, size = 'md', decorative = false, label, color }: IconProps) {
  const { colors } = useTheme();
  const LucideGlyph = ICONS[name];

  return (
    <LucideGlyph
      size={SIZES[size]}
      color={color ?? colors.text.primary}
      accessible={!decorative}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'auto'}
      accessibilityLabel={decorative ? undefined : label}
    />
  );
}
