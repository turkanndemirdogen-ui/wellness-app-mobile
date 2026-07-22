/** ♇ Plüton — küre + hilal beşik + haç formu (05 §6). */
import { Circle, Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function PlutoGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Circle cx={12} cy={5.9} r={2.2} />
      <Path d="M7.3 6.6a4.7 4.7 0 0 0 9.4 0" />
      <Path d="M12 11.3v7.2" />
      <Path d="M9.2 15.5h5.6" />
    </GlyphSvg>
  );
}
