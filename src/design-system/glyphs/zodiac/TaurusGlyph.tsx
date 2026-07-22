/** ♉ Boğa — daire + üst boynuz yayı (05 §7). */
import { Circle, Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function TaurusGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Circle cx={12} cy={14.9} r={5.2} />
      <Path d="M5.7 3.7a6.3 6.3 0 0 0 12.6 0" />
    </GlyphSvg>
  );
}
