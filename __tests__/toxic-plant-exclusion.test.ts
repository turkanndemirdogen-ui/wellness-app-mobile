/**
 * Test 9 — toxic plant exclusion helper/policy (15 §11): çekirdek liste
 * envanter/öneri/ritüel/collectible/CTA/affiliate yollarında kesilir.
 */

import {
  assertNotToxicFor,
  isToxicSpecies,
  TOXIC_PLANT_PATTERNS,
} from '@/lib/plant-safety';

const CORE_15_11 = [
  'Datura stramonium',
  'Atropa belladonna',
  'Aconitum napellus',
  'Digitalis purpurea',
  'Ricinus communis',
  'Nerium oleander',
  'Conium maculatum',
];

describe('toksik bitki dışlaması (15 §11)', () => {
  test('15 §11 çekirdek türlerinin tamamı yakalanır', () => {
    for (const name of CORE_15_11) {
      expect(isToxicSpecies(name)).toBe(true);
    }
  });

  test('büyük/küçük harf ve serbest metin varyantları yakalanır (TR locale dahil)', () => {
    expect(isToxicSpecies('DATURA')).toBe(true);
    expect(isToxicSpecies('güzelavrat otu (belladonna)')).toBe(true);
    expect(isToxicSpecies('Oleander çayı')).toBe(true);
  });

  test('güvenli türler geçer', () => {
    expect(isToxicSpecies('Matricaria chamomilla')).toBe(false);
    expect(isToxicSpecies('Papatya')).toBe(false);
    expect(isToxicSpecies('Lavandula angustifolia')).toBe(false);
    expect(isToxicSpecies(null)).toBe(false);
    expect(isToxicSpecies(undefined)).toBe(false);
  });

  test('assertNotToxicFor tüm ürün yollarında hata fırlatır', () => {
    const contexts = [
      'inventory',
      'recommendation',
      'ritual',
      'collectible',
      'cta',
      'affiliate',
    ] as const;
    for (const context of contexts) {
      expect(() => assertNotToxicFor(context, 'Datura stramonium')).toThrow(/15 §11/);
      expect(() => assertNotToxicFor(context, 'Matricaria chamomilla')).not.toThrow();
    }
  });

  test('dışlama listesi çekirdeğin altına inemez (regresyon koruması)', () => {
    expect(TOXIC_PLANT_PATTERNS.length).toBeGreaterThanOrEqual(7);
  });
});
