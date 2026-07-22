/** ♑ Oğlak — "n" bacakları + halka kuyruk (05 §7). */
import { Circle, Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function CapricornGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Path d="M4.5 15.3V8.2c0-1.8 1-3 2.5-3s2.6 1.2 2.6 3v7.1" />
      <Path d="M9.6 15.3V8.2c0-1.8 1.1-3 2.6-3s2.6 1.2 2.6 3v4.1c0 1.1.1 1.7.4 2.2" />
      <Circle cx={17} cy={16.4} r={2.7} />
    </GlyphSvg>
  );
}
