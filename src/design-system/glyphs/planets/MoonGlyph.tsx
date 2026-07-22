/** ☽ Ay — sağa açılan hilal (05 §6). */
import { Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function MoonGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Path d="M14.6 4.4a8.1 8.1 0 1 0 0 15.2A6.3 6.3 0 0 1 14.6 4.4Z" />
    </GlyphSvg>
  );
}
