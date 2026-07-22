/** ♐ Yay — çapraz ok + kiriş çizgisi (05 §7). */
import { Path } from 'react-native-svg';

import { GlyphSvg, type GlyphSvgProps } from '../base';

export function SagittariusGlyph(props: GlyphSvgProps) {
  return (
    <GlyphSvg {...props}>
      <Path d="M5 19 19 5" />
      <Path d="M12.4 5H19v6.6" />
      <Path d="m7 12.2 4.8 4.8" />
    </GlyphSvg>
  );
}
