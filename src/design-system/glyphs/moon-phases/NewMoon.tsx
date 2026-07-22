/** Yeni ay — boş disk (05 §8 veri glyphi: düz, tek renkli, faz DOĞRU temsil edilir). */
import { Circle } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function NewMoon(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Circle cx={12} cy={12} r={8} />
    </GlyphSvg>
  );
}
