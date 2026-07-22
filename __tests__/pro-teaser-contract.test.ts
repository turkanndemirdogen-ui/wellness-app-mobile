/**
 * Test 10 — ProTeaser contract (15 §14): token bağları + "sonucun tamamı
 * kilitlenemez" kuralı (preview zorunlu).
 */

import { validateProTeaserProps } from '@/design-system/components/pro-teaser';
import { primitive } from '@/design-system/tokens/primitive.generated';

describe('ProTeaser contract (15 §14)', () => {
  test('proTeaser token seti 15 §14 ile birebir', () => {
    expect(primitive.proTeaser).toEqual({
      background: '#FFFDFC',
      accent: '#C5A260',
      border: '#D8CEC5',
      lockedPanel: '#31303D',
      radius: 16,
      padding: 16,
      gap: 12,
    });
  });

  test('preview zorunlu — sonucun tamamı paywall arkasına konamaz', () => {
    expect(validateProTeaserProps({ preview: '', ctaLabel: 'Aç' })).toBe(false);
    expect(validateProTeaserProps({ preview: '   ', ctaLabel: 'Aç' })).toBe(false);
    expect(
      validateProTeaserProps({ preview: 'Bugünün temel yorumu ücretsiz.', ctaLabel: 'Aç' }),
    ).toBe(true);
  });

  test('CTA dürüst ve net — boş etiket geçersiz', () => {
    expect(validateProTeaserProps({ preview: 'önizleme', ctaLabel: '' })).toBe(false);
  });
});
