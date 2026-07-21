/**
 * Test 4 — typography role mapping: eski `Text role` adları → yeni AppText
 * variant'ları (deprecated-alias köprüsü) + 15 §5 rol/aile kilitleri.
 */

import {
  appTextVariantMeta,
  appTextVariants,
  fontFamilies,
  fontRoles,
  legacyRoleToVariant,
  textRoles,
} from '@/design-system/theme/typography';

describe('typography role mapping (15 §5)', () => {
  test('fontRoles 15 §5 ile birebir', () => {
    expect(fontRoles).toEqual({
      display: 'Fraunces',
      reading: 'Lora',
      quote: 'Caveat',
      ceremonial: 'Playfair Display',
      ui: 'System',
    });
  });

  test('her eski rolün bir variant karşılığı var (alias tablosu tam)', () => {
    for (const role of Object.keys(textRoles) as (keyof typeof textRoles)[]) {
      const variant = legacyRoleToVariant[role];
      expect(variant).toBeDefined();
      expect(appTextVariants[variant]).toBeDefined();
    }
  });

  test('display variantları Fraunces, reading Lora, quote Caveat, ceremonial Playfair', () => {
    expect(appTextVariants.displayHero.fontFamily).toBe(fontFamilies.display);
    expect(appTextVariants.screenTitle.fontFamily).toBe('Fraunces_600SemiBold');
    expect(appTextVariants.reading.fontFamily).toBe('Lora_400Regular');
    expect(appTextVariants.scientificName.fontFamily).toBe('Lora_400Regular_Italic');
    expect(appTextVariants.scientificName.fontStyle).toBe('italic');
    expect(appTextVariants.quote.fontFamily).toBe('Caveat_500Medium');
    expect(appTextVariants.ceremonial.fontFamily).toBe('PlayfairDisplay_500Medium');
  });

  test('ui variantları sistem ailesinde (Inter canonical body DEĞİL)', () => {
    for (const name of ['uiBody', 'uiLabel', 'uiCaption', 'uiButton'] as const) {
      const family = String(appTextVariants[name].fontFamily);
      expect(family).not.toMatch(/Inter|Fraunces|Lora|Caveat|Playfair/);
    }
  });

  test('her variant Dynamic Type üst sınırı taşır', () => {
    for (const meta of Object.values(appTextVariantMeta)) {
      expect(meta.maxFontSizeMultiplier).toBeGreaterThanOrEqual(1.4);
    }
  });
});
