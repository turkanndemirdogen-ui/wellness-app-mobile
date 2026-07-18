/**
 * favorites — günün sözü favori koleksiyonu (gunun-sozu-spec §3 "Favori
 * (kaydet)": kişisel söz koleksiyonu, free sınırsız — K7 kalıcı).
 *
 * Auth (Faz 2) yokken koleksiyon CİHAZDA yaşar (checkin.ts ile aynı ilke);
 * sunucu şeması gelince buradan taşınır/eşitlenir. Favoriler ekranı ayrı iş
 * kalemidir — bu modül yalnız depoyu ve aç/kapa işlemini verir.
 *
 * İzole ve test edilebilir: yalnız AsyncStorage; hata sessizce yutulur
 * (favori iyileştirmedir, ekranı düşürmez).
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'favorites.quotes.v1';

export async function readFavoriteQuoteIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Sözü favorilere ekler/çıkarır; yeni listeyi döner. Yazım hatasında bellek
 * içi sonuç yine döner — seçim en azından oturum boyunca yaşar.
 */
export async function toggleFavoriteQuote(sozId: string): Promise<string[]> {
  const current = await readFavoriteQuoteIds();
  const next = current.includes(sozId)
    ? current.filter((id) => id !== sozId)
    : [...current, sozId];
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Sessiz.
  }
  return next;
}
