/** ♅ Uranüs — H formu + alt daire (05 §6). */
import { Circle, Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function UranusGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Path d="M7.4 3.9v7.6" />
      <Path d="M16.6 3.9v7.6" />
      <Path d="M7.4 7.7h9.2" />
      <Path d="M12 7.7v7.2" />
      <Circle cx={12} cy={17.3} r={2.5} />
    </GlyphSvg>
  );
}
