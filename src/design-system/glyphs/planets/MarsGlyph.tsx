/** ♂ Mars — daire + ok (05 §6). */
import { Circle, Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function MarsGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Circle cx={10.2} cy={13.8} r={4.9} />
      <Path d="m13.7 10.3 5.3-5.3" />
      <Path d="M14.3 4.8h4.9v4.9" />
    </GlyphSvg>
  );
}
