/** ♊ İkizler — iki dikey + üst/alt yay (05 §7). */
import { Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function GeminiGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Path d="M4.5 4.3c4.7 2.8 10.3 2.8 15 0" />
      <Path d="M4.5 19.7c4.7-2.8 10.3-2.8 15 0" />
      <Path d="M9 6.3v11.4" />
      <Path d="M15 6.3v11.4" />
    </GlyphSvg>
  );
}
