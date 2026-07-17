/**
 * Motion ölçeği runtime token'ı (Design §45 motionScale, §21.4 düşük-güç).
 *
 * 1 = tam hareket · 0 = statik dünya. Animasyon süreleri bununla çarpılır;
 * 0'da tüketici animasyonsuz son durumu gösterir (bilgi kaybolmaz, §19).
 *
 * Düşük-güç sinyali ŞİMDİLİK STUB (false): pil durumu okumak expo-battery
 * gerektirir (bağımlılık onayı bekler — Faz 1 kuralı). Kanca dikişi hazır;
 * paket onaylanınca yalnız useLowPower içi değişir.
 */

import { useReducedMotion } from './use-reduced-motion';

function useLowPower(): boolean {
  // STUB — expo-battery onaylanana kadar her zaman false (bkz. üst açıklama).
  return false;
}

export type MotionScale = 0 | 1;

export function useMotionScale(): MotionScale {
  const reducedMotion = useReducedMotion();
  const lowPower = useLowPower();
  return reducedMotion || lowPower ? 0 : 1;
}
