/**
 * Reduced-motion runtime token'ı (Design §19, §45 runtime katmanı).
 *
 * Sistem "animasyonları azalt / kaldır" ayarını dinler. Tüketiciler animasyonu
 * kapatırken BİLGİYİ ASLA kaybetmez (§19: parallax→statik, zoom→crossfade,
 * bilgi kaybolmaz) — bu hook yalnız sinyali verir, davranış tüketicinindir.
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let alive = true;
    // Başlangıç değeri asenkron gelir; abonelik sonraki değişimleri izler.
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (alive) setReduced(value);
    });
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  return reduced;
}
