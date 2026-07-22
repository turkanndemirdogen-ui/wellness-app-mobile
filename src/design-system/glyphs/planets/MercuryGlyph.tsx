/** ☿ Merkür — boynuz yayı + daire + haç (05 §6). */
import { Circle, Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function MercuryGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Path d="M8.6 3.4a3.4 3.4 0 0 0 6.8 0" />
      <Circle cx={12} cy={10.4} r={3.9} />
      <Path d="M12 14.3v6" />
      <Path d="M9.2 17.3h5.6" />
    </GlyphSvg>
  );
}
