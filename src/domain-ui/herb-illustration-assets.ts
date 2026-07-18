/**
 * Bitki illüstrasyonu varlık haritası — `illus_ref` → paketlenmiş görsel.
 *
 * Nihai görseller illustrasyon-uretim-spec v1.0 hattından gelecek (marka
 * LoRA'sı, 37 kart, tek stil). Varlıklar hazır olduğunda:
 *   1. Dosyayı `src/assets/illustrations/<illus_ref>.png` olarak ekle,
 *   2. buraya `<illus_ref>: require('@/assets/illustrations/<illus_ref>.png')`
 *      satırını yaz.
 * Başka HİÇBİR kod değişmez — HerbIllustration haritada eşleşme bulunca
 * görseli, bulamayınca üretim-güvenli yer tutucu motifi çizer.
 */

export const HERB_ILLUSTRATIONS: Record<string, number> = {
  // Henüz varlık yok — illüstrasyon seti B-üretim #2 (launch-blocker, spec §7).
};
