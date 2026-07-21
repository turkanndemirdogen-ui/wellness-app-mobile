/**
 * plant-safety — toksik bitki dışlama politikası (15 §11; SAFETY_MASTER üstü kural).
 *
 * Yüksek riskli toksik türler YALNIZ tarihsel/kültürel/sembolik/sanatsal/estetik
 * referans olabilir. Ürün envanterine, kişisel öneriye, ritüel bileşenine,
 * Bahçe collectible'ına, tüketim/uygulama CTA'sına ve affiliate zincirine
 * GİREMEZ; doz veya kullanım talimatı içeremez. Sembolik gösterim
 * SymbolicReferenceNotice etiketi ister.
 *
 * Bu modül mevcut `app_safe`/`uyari_chip` veri filtrelerinin (lib/home.ts)
 * ÜSTÜNDE ürün-genel bir isim-tabanlı son savunma hattıdır: veri katmanı
 * yanlışlıkla toksik tür sızdırsa bile envanter/öneri yolları burada kesilir.
 * Liste 15 §11'in "ve benzeri" sınıfının bilinen çekirdeğidir; genişletme
 * Safety otoritesine tabidir.
 */

import { lowerTR } from './text-tr';

/** 15 §11 çekirdek dışlama listesi — Latince ad kalıpları (küçük harf). */
export const TOXIC_PLANT_PATTERNS: readonly string[] = [
  'datura',
  'atropa belladonna',
  'belladonna',
  'aconitum',
  'digitalis',
  'ricinus communis',
  'nerium oleander',
  'oleander',
  'conium maculatum',
  'hyoscyamus', // banotu — aynı risk sınıfı
  'mandragora', // adamotu — aynı risk sınıfı
  'taxus', // porsuk — aynı risk sınıfı
];

/** Ad (Latince veya serbest metin) dışlama kalıplarından birine uyuyor mu? */
export function isToxicSpecies(name: string | null | undefined): boolean {
  if (!name) return false;
  const n = lowerTR(name);
  return TOXIC_PLANT_PATTERNS.some((p) => n.includes(p));
}

export type ToxicExclusionContext =
  | 'inventory'
  | 'recommendation'
  | 'ritual'
  | 'collectible'
  | 'cta'
  | 'affiliate';

/**
 * Envanter/öneri/ritüel/collectible/CTA/affiliate yoluna giren her bitki adı
 * bu kapıdan geçirilir; toksik türde hata fırlatır (sessiz sızıntı yok).
 * Sembolik/tarihsel gösterim bu kapıyı KULLANMAZ — o yol
 * SymbolicReferenceNotice etiketiyle ayrı yaşar.
 */
export function assertNotToxicFor(
  context: ToxicExclusionContext,
  name: string | null | undefined,
): void {
  if (isToxicSpecies(name)) {
    throw new Error(`[plant-safety] toksik tür '${name}' ${context} yoluna giremez (15 §11)`);
  }
}
