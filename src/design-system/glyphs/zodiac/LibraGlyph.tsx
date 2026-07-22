/** ♎ Terazi — kemerli üst çizgi + taban çizgisi (05 §7). */
import { Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function LibraGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Path d="M4.4 19.2h15.2" />
      <Path d="M4.4 14.7h4.3a3.4 3.4 0 1 1 6.6 0h4.3" />
    </GlyphSvg>
  );
}
