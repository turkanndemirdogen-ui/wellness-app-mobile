/** ♈ Koç — merkez gövdeye inen iki boynuz (05 §7). */
import { Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function AriesGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Path d="M12 20.3V10.9c0-3.6-1.2-6.9-3.9-7.3-1.8-.3-3.5 1.2-3.2 3.6" />
      <Path d="M12 10.9c0-3.6 1.2-6.9 3.9-7.3 1.8-.3 3.5 1.2 3.2 3.6" />
    </GlyphSvg>
  );
}
