/** ♀ Venüs — daire + haç (05 §6). */
import { Circle, Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function VenusGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Circle cx={12} cy={8.4} r={4.6} />
      <Path d="M12 13v7.2" />
      <Path d="M8.8 16.6h6.4" />
    </GlyphSvg>
  );
}
