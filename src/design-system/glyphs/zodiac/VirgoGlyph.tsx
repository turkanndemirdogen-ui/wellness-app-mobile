/** ♍ Başak — üç bacaklı "m" + içe kıvrılan kuyruk (05 §7). */
import { Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function VirgoGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Path d="M4.4 19.4V7.7c0-1.9 1.1-3.1 2.6-3.1s2.7 1.3 2.7 3.2v11.6" />
      <Path d="M9.7 7.8c0-1.9 1.1-3.2 2.6-3.2s2.7 1.3 2.7 3.2v11.6" />
      <Path d="M15 7.8c0-1.9 1.1-3.2 2.6-3.2s2.7 1.3 2.7 3.2v5.6c0 4.6-2.5 7.4-6.6 8.4" />
    </GlyphSvg>
  );
}
