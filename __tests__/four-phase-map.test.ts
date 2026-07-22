/**
 * 4→8 faz köprüsü (checkpoint açık kalem 10) — mevcut astro sözleşmesinin
 * 4 fazı DOĞRU glyph'lere gider; arayüz 4 fazın altına düşmez, 8-faz iddiası
 * da yapılmaz (ara fazlar Adım 6 veri genişlemesine dek KULLANILMAZ).
 * Tip eşitliği domain-ui MoonPhaseName ile tsc'de zorlanır.
 */

import { fourPhaseToGlyph, MOON_PHASE_GLYPH_NAMES } from '@/design-system/glyphs';
import type { MoonPhaseGlyphName } from '@/design-system/glyphs';
import type { MoonPhaseName } from '@/domain-ui/moon-phase-glyph';

// Tip senkronu (tsc): domain-ui 4-faz sözleşmesi değişirse burada derleme kırılır.
const _typeSync: Record<MoonPhaseName, MoonPhaseGlyphName> = fourPhaseToGlyph;
void _typeSync;

describe('fourPhaseToGlyph (4→8 köprüsü)', () => {
  it('tam olarak 4 kanonik fazı eşler', () => {
    expect(Object.keys(fourPhaseToGlyph).sort()).toEqual(
      ['dolunay', 'ilk_dordun', 'son_dordun', 'yeni'].sort(),
    );
  });

  it('fazlar astronomik olarak doğru glyph adlarına gider (05 §8: yanlış faz yasak)', () => {
    expect(fourPhaseToGlyph.yeni).toBe('new');
    expect(fourPhaseToGlyph.ilk_dordun).toBe('firstQuarter');
    expect(fourPhaseToGlyph.dolunay).toBe('full');
    expect(fourPhaseToGlyph.son_dordun).toBe('lastQuarter');
  });

  it('tüm hedefler 8-faz setinin geçerli üyeleri', () => {
    for (const glyphName of Object.values(fourPhaseToGlyph)) {
      expect(MOON_PHASE_GLYPH_NAMES).toContain(glyphName);
    }
  });

  it('ara fazlar (crescent/gibbous) 4-faz köprüsünde KULLANILMAZ', () => {
    const used = new Set<MoonPhaseGlyphName>(Object.values(fourPhaseToGlyph));
    for (const intermediate of ['waxingCrescent', 'waxingGibbous', 'waningGibbous', 'waningCrescent']) {
      expect(used.has(intermediate as MoonPhaseGlyphName)).toBe(false);
    }
  });
});
