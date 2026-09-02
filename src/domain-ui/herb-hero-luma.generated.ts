// OTOMATİK ÜRETİLDİ — ELLE DÜZENLEME.
// Kaynak: content/bitki-gorselleri.json · Üretim: python scripts/measure-hero-contrast.py
//
// Hero metin bandı ölçümü: her görselin metin dikdörtgenindeki EN AÇIK piksel,
// hero katmanları bindirildikten sonra beyaz yazıyla hangi kontrastı veriyor.
// `needsCloud` true ise o görselde lokal koyu bulut katmanı çizilir.
// Ölçüm görsel başına BİR KEZ yapılır; cihazda hesaplanmaz.

export type HerbHeroLuma = {
  /** Vinyet + lila sis sonrası kontrast (bulut YOKken). */
  contrastPlain: number;
  /** Metin bandı açık → lokal koyu bulut gerekli mi? */
  needsCloud: boolean;
  /** Çözülen bulut tepe alfası (0 = bulut yok). */
  cloudAlpha: number;
  /** Uygulanan katmanlarla ulaşılan nihai kontrast. */
  contrast: number;
};

/** Kabul eşiği (15 §10 normal metin). */
export const HERO_TEXT_AA = 4.5;

/**
 * Görseli olmayan bitkide (yer tutucu yüzeyi) gereken bulut alfası.
 * Yer tutucu da AÇIK bir yüzeydir — beyaz yazı orada da emniyete alınır.
 */
export const HERO_PLACEHOLDER_CLOUD_ALPHA = 0.842;
/** Yer tutucuda ulaşılan kontrast. */
export const HERO_PLACEHOLDER_CONTRAST = 4.603;

/**
 * Ölçümün yapıldığı katman değerleri. Testler bunu canlı token’larla
 * karşılaştırır: vinyet/sis/bulut değeri değişirse ölçüm bayatlar ve test
 * kırmızıya döner — yeniden koşulması gerektiğini söyler.
 */
export const HERO_MEASURED_WITH = {
  "lilacMist": "rgba(140,96,190,0.18)",
  "vignetteCenterX": 0.5,
  "vignetteCenterY": 0.38,
  "vignetteInner": "rgba(74,42,110,0)",
  "vignetteMid": "rgba(74,42,110,0.42)",
  "vignetteOuter": "rgba(40,20,64,0.78)",
  "vignetteRadius": 0.8,
  "vignetteStop0": 0.3,
  "vignetteStop1": 0.78,
  "cloudAlphaMax": 0.92,
  "cloudCenterX": 0.22,
  "cloudCenterY": 0.88,
  "cloudColor": "rgba(30,12,45,1)",
  "cloudMidRatio": 0.58,
  "cloudRadius": 0.78,
  "cloudStopMid": 0.55,
  "shadowColor": "rgba(30,12,45,0.55)",
  "shadowOffsetY": 1,
  "shadowRadius": 10,
  "textRectBottom": 0.95,
  "textRectLeft": 0.03,
  "textRectRight": 0.62,
  "textRectTop": 0.74
} as const;

export const HERB_HERO_LUMA: Record<string, HerbHeroLuma> = {
  "rezene": { contrastPlain: 1.971, needsCloud: true, cloudAlpha: 0.647, contrast: 4.598 },
  "karahindiba": { contrastPlain: 1.625, needsCloud: true, cloudAlpha: 0.801, contrast: 4.598 },
  "nane": { contrastPlain: 1.598, needsCloud: true, cloudAlpha: 0.675, contrast: 4.602 },
  "biberiye": { contrastPlain: 3.252, needsCloud: true, cloudAlpha: 0.357, contrast: 4.602 },
  "melisa": { contrastPlain: 1.86, needsCloud: true, cloudAlpha: 0.684, contrast: 4.597 },
  "lavanta": { contrastPlain: 2.622, needsCloud: true, cloudAlpha: 0.498, contrast: 4.6 },
  "adacayi": { contrastPlain: 2.219, needsCloud: true, cloudAlpha: 0.526, contrast: 4.603 },
  "aynisefa": { contrastPlain: 2.908, needsCloud: true, cloudAlpha: 0.372, contrast: 4.598 },
  "isirgan": { contrastPlain: 1.927, needsCloud: true, cloudAlpha: 0.567, contrast: 4.598 },
  "atkuyrugu": { contrastPlain: 1.869, needsCloud: true, cloudAlpha: 0.711, contrast: 4.603 },
  "sari_kantaron": { contrastPlain: 2.46, needsCloud: true, cloudAlpha: 0.426, contrast: 4.598 },
};
