/** ☉ Güneş — daire + merkez nokta (05 §6). Nokta dolgusu semantic parçadır. */
import { Circle } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function SunGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Circle cx={12} cy={12} r={7.25} />
      <Circle cx={12} cy={12} r={1.3} fill="currentColor" stroke="none" />
    </GlyphSvg>
  );
}
