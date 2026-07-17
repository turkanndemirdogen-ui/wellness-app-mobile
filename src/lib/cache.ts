/**
 * cache — sürümlü AsyncStorage read-through önbelleği (Faz 1, bağımlılıksız).
 *
 * Amaç (Design §38): bağlantı yokken elde veri varsa GÖSTER; girdi/veri kaybı
 * yok. Anahtar şeması `cache.v<N>.<key>` — CACHE_VERSION artınca eski girdiler
 * anahtar değişimiyle doğal geçersizleşir (şema değişikliği çöp render edemez).
 * Bozuk/parse edilemeyen girdi sessizce ıskalanır (miss), asla fırlatmaz.
 *
 * İzole ve test edilebilir: ekran/bileşen bağımlılığı yok.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'cache';
/** Önbelleğe yazılan veri şekli değişirse artır. */
const CACHE_VERSION = 1;

export type CacheEntry<T> = {
  data: T;
  /** ISO zaman damgası — bayatlık sunumu ileride bunu kullanabilir. */
  savedAt: string;
};

function keyFor(key: string): string {
  return `${PREFIX}.v${CACHE_VERSION}.${key}`;
}

export async function readCache<T>(key: string): Promise<CacheEntry<T> | null> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(key));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed === null ||
      typeof parsed !== 'object' ||
      !('data' in parsed) ||
      !('savedAt' in parsed)
    ) {
      return null;
    }
    return parsed as CacheEntry<T>;
  } catch {
    return null;
  }
}

export async function writeCache<T>(key: string, data: T): Promise<void> {
  try {
    const entry: CacheEntry<T> = { data, savedAt: new Date().toISOString() };
    await AsyncStorage.setItem(keyFor(key), JSON.stringify(entry));
  } catch {
    // Yazım hatası (kota/serileştirme) canlı akışı BOZMAZ — önbellek iyileştirmedir.
  }
}
