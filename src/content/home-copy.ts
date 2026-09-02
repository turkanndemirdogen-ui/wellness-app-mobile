/**
 * ANA SAYFA METİNLERİ — ONAYLI (dil incelemesi: Türkan, 2026-07-17).
 *
 * Kaynak sıradüzeni:
 * - specs/ana-sayfa-spec.md v1.2 (blok yapısı + spec'te yazılı metinler)
 * - modules/mood.json (duygu id + label_tr — BİREBİR, yeniden yazılmadı)
 * - EDITORIAL_MASTER_SPEC (davet dili; buyurgan kalıp yok)
 *
 * Görünen ve erişilebilirlik metinlerinin tamamı onaylıdır; sonraki metin
 * değişikliklerinin tek noktası bu dosyadır. Ay/gün adları içerik değil
 * yerel-tarih sabitleridir.
 */

import type { DailyTransit, ZodiacSign } from '@/lib/astro';
import type { Herb } from '@/lib/content';

/** Tarih başlığı sabitleri — Date.getMonth() / Date.getDay() dizinleriyle. */
export const MONTHS_TR = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
] as const;

export const WEEKDAYS_TR = [
  'Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi',
] as const;

/**
 * Ay çipi metni — burç başına hazır yazım (Türkçe bulunma eki burca göre
 * değiştiği için şablonla üretilmez; yazım hatası riski sıfırlanır).
 */
export const MOON_IN_SIGN_TR: Record<ZodiacSign, string> = {
  koc: "Ay Koç'ta",
  boga: "Ay Boğa'da",
  ikizler: "Ay İkizler'de",
  yengec: "Ay Yengeç'te",
  aslan: "Ay Aslan'da",
  basak: "Ay Başak'ta",
  terazi: "Ay Terazi'de",
  akrep: "Ay Akrep'te",
  yay: "Ay Yay'da",
  oglak: "Ay Oğlak'ta",
  kova: "Ay Kova'da",
  balik: "Ay Balık'ta",
};

export const MOON_PHASE_TR: Record<DailyTransit['moonPhase'], string> = {
  yeni: 'Yeni Ay',
  ilk_dordun: 'İlk Dördün',
  dolunay: 'Dolunay',
  son_dordun: 'Son Dördün',
};

/**
 * B4 hızlı duygu seti — ana-sayfa-spec B4 önerisindeki 6'lı küme.
 * id + etiket modules/mood.json'dan BİREBİR (etiket yeniden yazılmaz).
 * Not: spec önerisindeki "hüzünlü" mood.json'da "üzgün" (id: sad) olarak
 * yaşar — kanonik sözlük esas alındı (gap raporunda kayıtlı).
 * Dörtlü çeyrek dengesi: poz-yüksek ×2 · poz-düşük ×1 · neg-yüksek ×1 ·
 * neg-düşük ×2.
 */
export const QUICK_MOODS = [
  { id: 'calm', label: 'sakin' },
  { id: 'joyful', label: 'neşeli' },
  { id: 'tired', label: 'yorgun' },
  { id: 'tense', label: 'gergin' },
  { id: 'energetic', label: 'enerjik' },
  { id: 'sad', label: 'üzgün' },
] as const;

export const homeCopy = {
  checkin: {
    /** Spec §B4 — bölüm başlıkçığı (kanıt bölgesi ayracı). */
    sectionTitle: 'Bugünün kaydı',
    /** Spec §B4 — mod satırı sorusu. */
    question: 'Bugün nasılsın?',
    /** Kayıt sonrası sessiz durum satırı (davet dili; onaylı). */
    loggedHint: 'Bugünün kaydı alındı. Dilersen değiştirebilirsin.',
  },
  /** Spec §3 — tüm sembolik bölge boşsa gösterilen tek yumuşak satır. */
  offlineSky: 'Şu an göğe ulaşamıyoruz — az sonra tekrar dene.',
  herbCard: {
    /** B3 erişilebilirlik etiketi şablon başı (onaylı). */
    a11yPrefix: 'Günün bitkisi',
    /**
     * Bilimsel ad kaydı eksikse gösterilen bekleme etiketi. Bilimsel ad hiçbir
     * varyantta gizlenemez (07 §6) — boşluk yerine durum metni yazılır.
     * Editoryal onay bekliyor (HerbImage 'Görsel doğrulama bekliyor' deseniyle aynı).
     */
    scientificPending: 'bilimsel ad bekleniyor',
  },
  quote: {
    /**
     * B5 mikro-eylem etiketleri — ana-sayfa-spec B5 BİREBİR: "kaydet ♡ ·
     * paylaş" (Sprint 2.2A ⑦; spec metni olduğu için yeniden yazılmadı).
     */
    save: 'kaydet',
    share: 'paylaş',
  },
} as const;

/**
 * B3 açılış bitkisi — spec B3 Haller: "İlk açılış + cache yok → sabit 'açılış
 * bitkisi' kartı". Sprint 2.2A ürün sahibi kararı (ONAYLI): canlı veri yoksa
 * hero asla boş kalmaz; minimal üretim-güvenli içerik gömülür (ad + kısa
 * açıklama + küçük illüstrasyon). Cümle, spec'in kendi örnek tonudur
 * ("Papatya · ☉ — geleneksel olarak sakinlik anlarıyla anılır") — doz/tedavi
 * dili yok. B-üretim #2 launch setinde işaretli açılış bitkisi gelince bu
 * kayıt onunla değiştirilir.
 */
export const OPENING_HERB: Herb = {
  herb_id: 'papatya',
  name_tr: 'Papatya',
  gezegen_birincil: 'gunes',
  app_safe: true,
  guven_tier: null,
  // Gömülü kayıt ağ erişimi olmadan çalışır → uzak görsele bağlanmaz; yüzey
  // placeholder gösterir (10 §11). Papatya kartı Storage'a girince burada
  // değil, canlı veriyle gelir.
  image_path: null,
  image_version: null,
  // names: kanonik motor-tablo kaydından (content/motor-tablo-pilot.json).
  data: {
    tek_satir: 'Geleneksel olarak sakinlik anlarıyla anılır.',
    names: { tr: 'Papatya', en: 'Chamomile', la: 'Matricaria chamomilla' },
  },
};
