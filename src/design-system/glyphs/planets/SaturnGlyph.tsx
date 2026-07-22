/** ♄ Satürn — üstte haçlı "h" + kuyruk (05 §6). */
import { Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function SaturnGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Path d="M8.3 3.9v14.6" />
      <Path d="M5.5 6.9h5.6" />
      <Path d="M8.3 12.1c1.2-1.9 3-2.8 4.7-2.2 2.1.8 2.8 3.2 1.6 5.6-.6 1.3-1.5 2.4-1.9 3.4-.3.9 0 1.7.8 2.1" />
    </GlyphSvg>
  );
}
