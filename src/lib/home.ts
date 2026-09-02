/**
 * home — Günlük Pusula veri montajı (ana-sayfa-spec v1.2, roadmap Phase 4).
 *
 * Roadmap Phase 4 izni: günün kartı v1 = deterministik dönüşümlü seçim; canlı
 * transit motoru (Arch Faz 5, Swiss Ephemeris) bu fazı BLOKLAMAZ. Seçimler
 * tarih anahtarından türetilir → gün boyu sabit, kullanıcı sayısından bağımsız
 * (spec §8: global günlük seçim, maliyet ~0).
 *
 * B2 satırı: derived_ai/theme_line servisi henüz yok; satır, base'deki GERÇEK
 * `match_engine_rules` RPC'sinden gelen kural varyantlarından seçilir (K4:
 * kural metni LLM'siz, birebir gösterilir — haftalik-bakis Blok-4 ile aynı
 * ilke). YALNIZ transit-only kurallar (aspect/natal null) kullanılır → free
 * yüzeye natal iması sızmaz (spec §4 free/pro sınırı).
 *
 * İzole ve test edilebilir: saf seçim fonksiyonları + tek fetch montajı.
 */

import type { EngineEvent } from './astro';
import { fetchHerbs, fetchQuotes, type Herb, type Quote } from './content';
import { supabase } from './supabase';

/**
 * Bitkinin bilimsel adı (`data.names.la`). Bitki yüzeylerinde zorunlu alan
 * (07 §6 kilidi, 12 §F) — yoksa null döner, çağıran bekleme etiketi gösterir.
 */
export function herbLatin(herb: Herb): string | null {
  return herb.data?.names?.la ?? null;
}

/** Yerel gün anahtarı — 'YYYY-MM-DD' (cihaz saat dilimi; gün dönümü yerel). */
export function todayKey(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Deterministik gün karması — aynı gün aynı seçim (FNV-1a, taşma güvenli). */
export function hashDateKey(key: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** engine_rules satırının ekran için gereken alt kümesi. */
export type ThemeRule = {
  rule_id: string;
  aspect_quality: string | null;
  natal_target: string | null;
  priority: number | null;
  user_text_variants: string[] | null;
};

export type HomeDaily = {
  herbs: Herb[] | null;
  rules: ThemeRule[] | null;
  quotes: Quote[] | null;
};

/** Free yüzeye giden olaylar: yalnız transit-only (natal iması taşımayan). */
export function transitOnlyEvents(events: EngineEvent[]): EngineEvent[] {
  return events.filter((e) => e.aspect_quality == null && e.natal_target == null);
}

async function fetchThemeRules(events: EngineEvent[]): Promise<ThemeRule[]> {
  if (!supabase) throw new Error('supabase-not-configured');
  if (events.length === 0) return [];
  const { data, error } = await supabase.rpc('match_engine_rules', {
    p_events: events,
  });
  if (error) throw error;
  return (data ?? []) as ThemeRule[];
}

/**
 * Günlük içerik montajı — parçalar bağımsız düşer (kısmi başarı bloğu değil
 * yalnız ilgili bloğu gizler; spec §2 "Haller"). Hepsi düşerse ilk hata
 * fırlatılır → useAsyncResource önbellek düşüşü devreye girer (§38).
 */
export async function fetchHomeDaily(events: EngineEvent[]): Promise<HomeDaily> {
  const settled = await Promise.allSettled([
    fetchHerbs(),
    fetchThemeRules(transitOnlyEvents(events)),
    fetchQuotes(),
  ]);
  const [herbs, rules, quotes] = settled;

  const allFailed = settled.every((s) => s.status === 'rejected');
  if (allFailed && herbs.status === 'rejected') throw herbs.reason;

  return {
    herbs: herbs.status === 'fulfilled' ? herbs.value : null,
    rules: rules.status === 'fulfilled' ? rules.value : null,
    quotes: quotes.status === 'fulfilled' ? quotes.value : null,
  };
}

/** Bitkinin gösterilebilir bir Storage görseli var mı (10 §10). */
function hasCardImage(herb: Herb): boolean {
  return Boolean(herb.image_path) && (herb.image_version ?? 0) >= 1;
}

/**
 * B3 — günün bitki kartı seçimi. Havuz kuralı (spec): daima app_safe; uyarı
 * çipli (T1–T3) bitkiler Keşif'te yaşar, günün kartına GİRMEZ. Sıralama
 * herb_id ile sabitlenir (fetch sırasından bağımsız determinizm).
 *
 * GÖRSEL KOŞULU (ürün sahibi kararı, 2026-09-02): hero artık katmansız, düpedüz
 * bitki fotoğrafıdır — görseli olmayan bitki seçilirse ekranın üst üçte biri boş
 * bir yer tutucu kutusu olur. Bu yüzden havuz önce GÖRSELİ OLANLARA daraltılır.
 * Ölçüldü (npm run db:check:hero): 35 bitkilik güvenli havuzun yalnız 9'unda
 * görsel var; daraltma olmadan günlerin ~%74'ünde yer tutucu çıkıyordu.
 *
 * Daraltma GÜVENLİ tarafa düşer: görselli hiçbir bitki yoksa (yeni kurulum,
 * eksik seed) eski havuza geri döner — ekran boş kalmaktansa yer tutucuyla
 * çalışır. Görseller üretildikçe havuz kendiliğinden genişler.
 */
export function pickDailyHerb(herbs: Herb[] | null, dateKey: string): Herb | null {
  if (!herbs || herbs.length === 0) return null;
  const safePool = herbs
    .filter((h) => h.app_safe === true && !h.data?.guvenlik?.uyari_chip)
    .sort((a, b) => a.herb_id.localeCompare(b.herb_id));
  if (safePool.length === 0) return null;
  const imaged = safePool.filter(hasCardImage);
  const pool = imaged.length > 0 ? imaged : safePool;
  return pool[hashDateKey(dateKey) % pool.length];
}

/**
 * B2 — kozmik hava satırı (free): en yüksek öncelikli transit-only kuralın
 * varyantlarından günlük seçim. Kural/varyant yoksa null → satır gizlenir.
 */
export function pickThemeLine(rules: ThemeRule[] | null, dateKey: string): string | null {
  if (!rules || rules.length === 0) return null;
  const pool = rules
    .filter(
      (r) =>
        r.aspect_quality == null &&
        r.natal_target == null &&
        Array.isArray(r.user_text_variants) &&
        r.user_text_variants.length > 0,
    )
    .sort(
      (a, b) =>
        (b.priority ?? 0) - (a.priority ?? 0) || a.rule_id.localeCompare(b.rule_id),
    );
  const rule = pool[0];
  if (!rule) return null;
  const variants = rule.user_text_variants as string[];
  return variants[hashDateKey(dateKey) % variants.length] ?? null;
}

/** B5 — günün sözü (free: global seçim, herkese aynı). Havuz boş → null. */
export function pickDailyQuote(quotes: Quote[] | null, dateKey: string): Quote | null {
  if (!quotes || quotes.length === 0) return null;
  const pool = [...quotes]
    .filter((q) => q.text_tr)
    .sort((a, b) => a.soz_id.localeCompare(b.soz_id));
  if (pool.length === 0) return null;
  return pool[hashDateKey(dateKey) % pool.length];
}
