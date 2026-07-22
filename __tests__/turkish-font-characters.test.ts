/**
 * Test 6 — Turkish font characters (yapısal doğrulama).
 *
 * Gerçek glyph render'ı cihazda dev-gallery "P1 · Font rolleri" bölümünde
 * gözle doğrulanır (her variant TR_TEST_STRING satırıyla çizilir); Google
 * Fonts'un Fraunces/Lora/Caveat/Playfair aileleri latin-ext kapsar. Burada
 * jest'te doğrulanabilir katman test edilir: zorunlu karakter setinin tamlığı
 * ve her rolün yüklü bir aile adına bağlı olması.
 */

import { fontFamilies } from '@/design-system/theme/typography';
import { TR_TEST_STRING } from '@/lib/text-tr';

const REQUIRED_CHARS = ['Ç', 'ç', 'Ğ', 'ğ', 'İ', 'ı', 'Ö', 'ö', 'Ş', 'ş', 'Ü', 'ü'];

describe('Türkçe karakter desteği (15 §5)', () => {
  test('TR_TEST_STRING zorunlu 12 karakteri içerir', () => {
    for (const ch of REQUIRED_CHARS) {
      expect(TR_TEST_STRING).toContain(ch);
    }
  });

  test('her özel rol yüklü bir font asset adına bağlı', () => {
    expect(fontFamilies).toEqual({
      display: 'Fraunces_600SemiBold',
      reading: 'Lora_400Regular',
      readingItalic: 'Lora_400Regular_Italic',
      quote: 'Caveat_500Medium',
      ceremonial: 'PlayfairDisplay_500Medium',
    });
  });

  test('font asset modülleri kurulu ve TR kapsayan aileleri dışa veriyor', () => {
    expect(require('@expo-google-fonts/fraunces').Fraunces_600SemiBold).toBeDefined();
    expect(require('@expo-google-fonts/lora').Lora_400Regular).toBeDefined();
    expect(require('@expo-google-fonts/lora').Lora_400Regular_Italic).toBeDefined();
    expect(require('@expo-google-fonts/caveat').Caveat_500Medium).toBeDefined();
    expect(require('@expo-google-fonts/playfair-display').PlayfairDisplay_500Medium).toBeDefined();
  });
});
