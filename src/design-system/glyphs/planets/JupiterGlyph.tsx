/** ♃ Jüpiter — "4" anatomisi: eğri + yatay + dikey (05 §6). */
import { Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function JupiterGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Path d="M14.7 4.1c-4.9 1.8-8.5 5.8-9.9 11" />
      <Path d="M4.6 15.1h13" />
      <Path d="M14.7 4.1v16" />
    </GlyphSvg>
  );
}
