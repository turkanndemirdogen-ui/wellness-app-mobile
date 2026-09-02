/**
 * Test 4 — typography role mapping: eski `Text role` adları → yeni AppText
 * variant'ları (deprecated-alias köprüsü) + 15 §5 rol/aile kilitleri.
 *
 * TİPOGRAFİ DEĞİŞİMİ 2026-09-02 (ürün sahibi kararı): Fraunces+Lora →
 * Cinzel+Jost; Playfair kaldırıldı. Bu test yeni kilidi tutar.
 */

import {
  appTextVariantMeta,
  appTextVariants,
  DISPLAY_MIN_SIZE,
  DISPLAY_VARIANTS,
  fontFamilies,
  fontRoles,
  legacyRoleToVariant,
  textRoles,
} from '@/design-system/theme/typography';
import { primitive } from '@/design-system/tokens/primitive.generated';

describe('typography role mapping (15 §5)', () => {
  test('fontRoles 15 §5 (2026-09-02 revizyonu) ile birebir', () => {
    expect(fontRoles).toEqual({
      display: 'Cinzel',
      body: 'Jost',
      ui: 'Jost',
      sci: 'Jost Italic',
      quote: 'Caveat',
    });
  });

  test('her eski rolün bir variant karşılığı var (alias tablosu tam)', () => {
    for (const role of Object.keys(textRoles) as (keyof typeof textRoles)[]) {
      const variant = legacyRoleToVariant[role];
      expect(variant).toBeDefined();
      expect(appTextVariants[variant]).toBeDefined();
    }
  });

  test('display Cinzel, gövde/ui Jost, bilimsel ad Jost italik, söz Caveat', () => {
    expect(appTextVariants.displayHero.fontFamily).toBe('Cinzel_600SemiBold');
    expect(appTextVariants.screenTitle.fontFamily).toBe('Cinzel_600SemiBold');
    expect(appTextVariants.plantName.fontFamily).toBe('Cinzel_600SemiBold');
    expect(appTextVariants.reading.fontFamily).toBe('Jost_400Regular');
    expect(appTextVariants.uiBody.fontFamily).toBe('Jost_400Regular');
    expect(appTextVariants.uiLabel.fontFamily).toBe('Jost_500Medium');
    expect(appTextVariants.uiButton.fontFamily).toBe('Jost_500Medium');
    expect(appTextVariants.scientificName.fontFamily).toBe('Jost_400Regular_Italic');
    expect(appTextVariants.scientificName.fontStyle).toBe('italic');
    expect(appTextVariants.quote.fontFamily).toBe('Caveat_500Medium');
  });

  test('Fraunces/Lora/Playfair hiçbir variant’ta kalmadı', () => {
    for (const style of Object.values(appTextVariants)) {
      expect(String(style.fontFamily)).not.toMatch(/Fraunces|Lora|Playfair|Inter/);
    }
    for (const style of Object.values(textRoles)) {
      expect(String(style.fontFamily)).not.toMatch(/Fraunces|Lora|Playfair|Inter/);
    }
  });

  test('KİLİT: display ailesi 20px altında kullanılamaz', () => {
    for (const name of DISPLAY_VARIANTS) {
      expect(appTextVariants[name].fontSize).toBeGreaterThanOrEqual(DISPLAY_MIN_SIZE);
    }
    // Eski alias tarafı: 16px heading.s bilinçli olarak ui ailesine düşer.
    expect(textRoles['heading.s'].fontFamily).toBe('Jost_500Medium');
    for (const [name, style] of Object.entries(textRoles)) {
      if (String(style.fontFamily).startsWith('Cinzel')) {
        expect(style.fontSize).toBeGreaterThanOrEqual(DISPLAY_MIN_SIZE);
        expect(name).not.toBe('heading.s');
      }
    }
  });

  test('display harf aralığı 0.03em; gövde/ui ailesinde harf aralığı yok', () => {
    const em = primitive.typography.displayLetterSpacingEm;
    for (const name of DISPLAY_VARIANTS) {
      const style = appTextVariants[name];
      expect(style.letterSpacing).toBeCloseTo((style.fontSize as number) * em, 5);
    }
    expect(appTextVariants.reading.letterSpacing).toBeUndefined();
    expect(appTextVariants.uiBody.letterSpacing).toBeUndefined();
  });

  test('gövde ailesi minimum 15px ve lineHeight 1.7 bandında', () => {
    for (const name of ['readingLead', 'reading', 'uiBody'] as const) {
      const style = appTextVariants[name];
      const size = style.fontSize as number;
      const lineHeight = style.lineHeight as number;
      expect(size).toBeGreaterThanOrEqual(15);
      expect(lineHeight / size).toBeGreaterThanOrEqual(1.65);
      expect(lineHeight / size).toBeLessThanOrEqual(1.75);
    }
  });

  test('özel ailelerde fontWeight verilmez (Android fake-bold çakışması)', () => {
    for (const style of Object.values(appTextVariants)) {
      expect(style.fontWeight).toBeUndefined();
    }
  });

  test('her variant Dynamic Type üst sınırı taşır', () => {
    for (const meta of Object.values(appTextVariantMeta)) {
      expect(meta.maxFontSizeMultiplier).toBeGreaterThanOrEqual(1.4);
    }
  });

  test('yüklü kesim adları fontFamilies ile birebir', () => {
    expect(fontFamilies).toEqual({
      display: 'Cinzel_600SemiBold',
      displayRegular: 'Cinzel_400Regular',
      body: 'Jost_400Regular',
      ui: 'Jost_500Medium',
      sci: 'Jost_400Regular_Italic',
      quote: 'Caveat_500Medium',
    });
  });
});
