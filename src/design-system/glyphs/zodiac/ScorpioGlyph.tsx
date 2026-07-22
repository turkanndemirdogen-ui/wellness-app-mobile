/** ♏ Akrep — "m" bacakları + ok uçlu kuyruk (05 §7). */
import { Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function ScorpioGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Path d="M4.4 19V7.4c0-1.8 1.1-3 2.6-3s2.7 1.3 2.7 3.1V19" />
      <Path d="M9.7 7.5c0-1.8 1.1-3.1 2.6-3.1s2.7 1.3 2.7 3.1V19" />
      <Path d="M15 7.5c0-1.8 1.1-3.1 2.6-3.1s2.7 1.3 2.7 3.1v8.1c0 2.2 1 3.4 2.9 3.5" />
      <Path d="m18.6 16.8 2 2.3-2.8.8" />
    </GlyphSvg>
  );
}
