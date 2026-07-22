/** Hilal (küçülen) — sol ince dilim aydınlık (05 §8; küçülen ay soldan söner). */
import { Circle, Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function WaningCrescent(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Circle cx={12} cy={12} r={8} />
      <Path d="M12 4A8 8 0 0 0 12 20A4.6 8 0 0 1 12 4Z" fill="currentColor" stroke="none" />
    </GlyphSvg>
  );
}
