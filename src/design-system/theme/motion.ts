/**
 * Motion sistemi köprüsü (Design §17-19) — token → Reanimated.
 *
 * TEK NOKTA: animasyonlu bileşenler easing/duration'ı BURADAN alır; hiçbir
 * bileşen kendi Easing.bezier'ini kurmaz, süre literal'i yazmaz. Değerler
 * tokens.json'dan (duration/easing/motionDistance — GEÇİCİ işaretleri orada).
 *
 * Kurallar:
 * - Her animasyon §17'nin beş sorusundan en az birine cevap vermeli
 *   (ne değişti / nereye gitti / eylem oldu mu / odak nerede / uzamsal ilişki);
 *   cevapsızsa kaldırılır.
 * - Reduced motion / düşük güç (useMotionScale=0): uzamsal hareket yerine
 *   statik opacity ya da animasyonsuz durum (§19; bilgi asla kaybolmaz).
 * - Ekran başına bütçe (§18.3): ≤3 arayüz animasyonu (iskelet nabzı tek
 *   koordineli desen sayılır).
 */

import { Easing } from 'react-native-reanimated';

import { primitive } from '../tokens/primitive.generated';

/** §18.2 süre bantları (ms) — tokens.json'daki temsili değerler. */
export const motionDurations = primitive.duration;

/** Basılı durum ölçek hedefi vb. mesafe token'ları. */
export const motionDistances = primitive.motionDistance;

/** Token bezier'lerinden bir kez kurulan Reanimated easing'leri. */
export const motionEasing = {
  standard: Easing.bezier(...primitive.easing.standard),
  decelerate: Easing.bezier(...primitive.easing.decelerate),
  accelerate: Easing.bezier(...primitive.easing.accelerate),
} as const;
