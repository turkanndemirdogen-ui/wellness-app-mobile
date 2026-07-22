/** ♆ Neptün — üç dişli mızrak + haç (05 §6). */
import { Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function NeptuneGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Path d="M6.6 5.1v3.1a5.4 5.4 0 0 0 10.8 0V5.1" />
      <Path d="M12 4v15.9" />
      <Path d="M8.9 16.7h6.2" />
    </GlyphSvg>
  );
}
