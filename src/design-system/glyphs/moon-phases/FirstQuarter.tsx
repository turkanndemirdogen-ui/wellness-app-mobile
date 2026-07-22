/** İlk dördün — sağ yarı aydınlık (05 §8; mevcut 4-faz sözleşmesiyle aynı yön). */
import { Circle, Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function FirstQuarter(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Circle cx={12} cy={12} r={8} />
      <Path d="M12 4A8 8 0 0 1 12 20Z" fill="currentColor" stroke="none" />
    </GlyphSvg>
  );
}
