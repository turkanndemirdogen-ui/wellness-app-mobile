/** Şişkin ay (büyüyen) — sağ yarı + sola taşan aydınlık (05 §8). */
import { Circle, Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function WaxingGibbous(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Circle cx={12} cy={12} r={8} />
      <Path d="M12 4A8 8 0 0 1 12 20A4.6 8 0 0 1 12 4Z" fill="currentColor" stroke="none" />
    </GlyphSvg>
  );
}
