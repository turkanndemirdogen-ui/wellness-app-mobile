/** Dolunay — tam aydınlık disk (05 §8). */
import { Circle } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function FullMoon(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Circle cx={12} cy={12} r={8} fill="currentColor" />
    </GlyphSvg>
  );
}
