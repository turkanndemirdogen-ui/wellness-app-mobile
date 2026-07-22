/**
 * Test 5 — Turkish locale: case dönüşümleri tr-TR ile (İ/ı ayrımı dahil).
 */

import { capitalizeTR, lowerTR, upperTR } from '@/lib/text-tr';

describe('tr-TR locale dönüşümleri (15 §5)', () => {
  test('i → İ (noktalı büyük İ)', () => {
    expect(upperTR('istanbul')).toBe('İSTANBUL');
    expect(upperTR('iyi geceler')).toBe('İYİ GECELER');
  });

  test('I → ı (noktasız küçük ı)', () => {
    expect(lowerTR('IŞIK')).toBe('ışık');
    expect(lowerTR('ILGIN')).toBe('ılgın');
  });

  test('ötekiler: Ç Ğ Ö Ş Ü gidiş-dönüş', () => {
    expect(upperTR('çğöşü')).toBe('ÇĞÖŞÜ');
    expect(lowerTR('ÇĞÖŞÜ')).toBe('çğöşü');
  });

  test('capitalizeTR ilk harfi TR kuralıyla büyütür', () => {
    expect(capitalizeTR('istanbul')).toBe('İstanbul');
    expect(capitalizeTR('ışık')).toBe('Işık');
    expect(capitalizeTR('')).toBe('');
  });
});
