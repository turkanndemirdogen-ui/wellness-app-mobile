/**
 * haptics — dokunsal geri bildirim köprüsü (Design §20).
 *
 * Kanonik eşleme: selection/toggle → light · completion → medium. Sprint 2.2A
 * onaylı kapsam YALNIZ iki etkileşim: duygu çipi seçimi (light) + başarılı
 * günlük kayıt (medium). Yeni haptic eklemek tasarım kararıdır — buraya
 * fonksiyon eklemeden önce §20 eşlemesi ve onay gerekir.
 *
 * Haptic hiçbir zaman TEK geri bildirim kanalı değildir (§20) — çağıran yüzey
 * görsel durumu ayrıca gösterir. Hata sessizce yutulur (desteklemeyen
 * cihaz/emülatör/web ekranı düşürmez).
 */

import * as Haptics from 'expo-haptics';

/** Seçim geri bildirimi — §20 "selection: light". */
export async function hapticSelection(): Promise<void> {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Sessiz: haptic iyileştirmedir, yokluğu davranışı değiştirmez.
  }
}

/** Tamamlanma geri bildirimi — §20 "completion: medium". */
export async function hapticCompletion(): Promise<void> {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // Sessiz.
  }
}
