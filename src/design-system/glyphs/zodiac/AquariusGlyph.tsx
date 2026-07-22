/** ♒ Kova — iki dalga zikzağı (05 §7). */
import { Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function AquariusGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Path d="m4.2 9.7 3.9-3.5 3.9 3.5 3.9-3.5 3.9 3.5" />
      <Path d="m4.2 16.9 3.9-3.5 3.9 3.5 3.9-3.5 3.9 3.5" />
    </GlyphSvg>
  );
}
