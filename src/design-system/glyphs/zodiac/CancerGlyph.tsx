/** ♋ Yengeç — çapraz iki daire + kuyruk yayları (05 §7). */
import { Circle, Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function CancerGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Circle cx={7.4} cy={9.1} r={2.7} />
      <Circle cx={16.6} cy={14.9} r={2.7} />
      <Path d="M7.4 6.4c4.5-2.6 9.3-2.2 12.3 1.1" />
      <Path d="M16.6 17.6c-4.5 2.6-9.3 2.2-12.3-1.1" />
    </GlyphSvg>
  );
}
