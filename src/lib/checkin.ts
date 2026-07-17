/**
 * checkin — B4 "Bugünün kaydı" yerel deposu (kanıt akışı).
 *
 * Auth (Phase 2) ve `mood_logs` tablosu henüz yok; kayıt CİHAZDA tutulur
 * (Design §38: çevrimdışında kullanıcı girdisi güvenle korunur). Kayıt şekli
 * mood_logs'un çekirdek alt kümesidir (roadmap Phase 4: tek tablo, çift şema
 * yok) — sunucu şeması gelince buradan taşınır/eşitlenir.
 *
 * Aynı gün ikinci seçim = nazik güncelleme, çift kayıt yok (Phase 4 kabul #4).
 * Gün başına tek anahtar: `checkin.v1.<YYYY-MM-DD>`.
 *
 * İzole ve test edilebilir: yalnız AsyncStorage; hata sessizce yutulur (kayıt
 * iyileştirmedir, ekranı düşürmez — cache.ts ile aynı ilke).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export type CheckinEntry = {
  /** modules/mood.json emotions[].id — kanonik duygu anahtarı. */
  emotionId: string;
  /** ISO zaman damgası (mood_logs zaman alanının çekirdeği). */
  savedAt: string;
};

function keyFor(dateKey: string): string {
  return `checkin.v1.${dateKey}`;
}

export async function readCheckin(dateKey: string): Promise<CheckinEntry | null> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(dateKey));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed === null ||
      typeof parsed !== 'object' ||
      typeof (parsed as CheckinEntry).emotionId !== 'string'
    ) {
      return null;
    }
    return parsed as CheckinEntry;
  } catch {
    return null;
  }
}

export async function saveCheckin(
  dateKey: string,
  emotionId: string,
): Promise<CheckinEntry> {
  const entry: CheckinEntry = { emotionId, savedAt: new Date().toISOString() };
  try {
    await AsyncStorage.setItem(keyFor(dateKey), JSON.stringify(entry));
  } catch {
    // Yazım hatası ekranı düşürmez; seçim en azından oturum boyunca yaşar.
  }
  return entry;
}
