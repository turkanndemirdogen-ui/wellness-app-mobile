/** ♌ Aslan — küçük daire + yele/kuyruk kıvrımı (05 §7). */
import { Circle, Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function LeoGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Circle cx={7.5} cy={13.6} r={2.6} />
      <Path d="M7.5 11c.3-4.3 2.4-6.6 5.1-6.6 2.8 0 4.6 2.1 4.6 4.7 0 2.8-2.2 4.8-2.2 7.4 0 1.7 1.1 2.8 2.7 2.8" />
    </GlyphSvg>
  );
}
