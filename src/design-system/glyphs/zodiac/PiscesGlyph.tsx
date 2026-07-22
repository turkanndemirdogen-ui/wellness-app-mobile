/** ♓ Balık — dışa bakan iki yay + orta çizgi (05 §7). */
import { Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function PiscesGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Path d="M8.7 3.9a11.2 11.2 0 0 0 0 16.2" />
      <Path d="M15.3 3.9a11.2 11.2 0 0 1 0 16.2" />
      <Path d="M6.4 12h11.2" />
    </GlyphSvg>
  );
}
