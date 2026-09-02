/**
 * SEMANTIC katman — primitive → semantic eşlemesi (Design master §44-45).
 *
 * LIGHT-FIRST (LOCKED, 15 §3 ile teyitli): tam dark mode YOK. Semantic renkler
 * yalnız açık primitivlerden türetilir; koyuluk yalnız panel-only token'larda
 * yaşar (panel-only — VisualPanel bileşeni) ve ana kroma asla sızmaz.
 *
 * KROM KAYNAĞI (Phase 4 taşıması, 2026-09-02): renkler artık `color.chrome`
 * (15 §4 KESİN HEX kilidi) üzerinden okunur. Önceki `color.light` pudra seti
 * tokens.json'da zaten "deprecated-alias — ekranlar Phase 4-5'te chrome'a
 * taşınır" diye işaretliydi; bu dosya o taşımanın tek noktasıdır. `color.light`
 * SİLİNMEDİ (kalıcı silme yasağı), yalnız artık okunmuyor.
 *
 * ADAPTIVE AMBIENT (Design §11.5): günün saatine göre YALNIZ surface.canvas
 * tonu ve ambient.wash değişir (primitive.color.ambient). Kart, metin,
 * navigasyon gibi çekirdek semantic renkler ve okunabilirlik ASLA değişmez.
 *
 * ACCENT (15 §6): accent ekran sözleşmesinden gelir (`ScreenVisualSpec.accentHex`)
 * — ScreenShell ekranın accent'ini `withAccent` ile yayar. Varsayılan, ürünün
 * botanik kimliği: botanical.sage.
 *
 * Bileşenler primitive'e DOĞRUDAN bağlanamaz (§11.4) — bu dosya tek eşleme
 * noktasıdır; grup adları §45'in semantic setinden (surface/text/border/action/
 * navigation).
 */

import { primitive } from '../tokens/primitive.generated';
import { bestTextOn } from './contrast';

export type TimeOfDay = keyof typeof primitive.color.ambient;

const c = primitive.color.chrome;
const m = primitive.material;

/** Ekran sözleşmesi accent vermezse kullanılan varsayılan (15 §7 home accent). */
export const DEFAULT_ACCENT = primitive.color.botanical.sage;

export function buildSemanticColors(timeOfDay: TimeOfDay, accentHex: string = DEFAULT_ACCENT) {
  return {
    surface: {
      /** Ekran zemini — TEK ambient'e duyarlı renk. */
      canvas: primitive.color.ambient[timeOfDay],
      /** Ambient'ten bağımsız sabit taban (kart üstü rozet/çip zeminleri). */
      base: c.background,
      card: c.surface,
      selected: c.surfaceTint,
      /** Pudra rozet/çip zemini (15 §3 "powder blush"); koyu metinle 10.7:1. */
      powder: c.powder,
      /**
       * Editoryal kâğıt yüzeyi (04 §12.2 quiet / §12.4 journal ruhu) — söz,
       * günlük, uzun okuma gibi "kâğıt" blokları beyaz karttan ayırır;
       * ekrandaki kartlar yalnız renkle değil MALZEMEYLE çeşitlenir (01 §11.3).
       */
      parchment: c.parchment,
      /**
       * Cam yüzeyler (04 §5) — ÖN-TONLANMIŞ hâl: gerçek blur yerine alfa'lı
       * tint (04 §6.3 Reduce-Transparency yolu). Gövde metni taşıyan camın
       * opaklığı ≥ 0.78 (04 §5.1) → koyu metin AA'da kalır.
       */
      glassMist: m.glass.mist.tint,
      glassFrost: m.glass.frost.tint,
      glassDeep: m.glass.deepFrost.tint,
    },
    /**
     * Ambient grubu (§45 semantic seti; §11.5): ekran üstünün yumuşak ışık
     * yıkaması. `wash` günün saat diliminin tonudur, `base` eridiği nötr
     * krom zemin (15 §4 background). YENİ RENK DEĞİL.
     */
    ambient: {
      wash: primitive.color.ambient[timeOfDay],
      base: c.background,
    },
    text: {
      primary: c.textPrimary,
      secondary: c.textSecondary,
      /**
       * Yalnız büyük/dekoratif metin: kart üstünde 4.35:1 — normal gövde
       * metninin AA sınırının (4.5:1) altında (15 §10).
       */
      muted: c.textMuted,
      /**
       * KOYU hero/panel üstü metin (02 §12 dark seti). Krom metniyle
       * karıştırılmaz: yalnız atmosferik scrim taşıyan görsel katmanda geçerli.
       */
      onPanel: m.onPanel.primary,
      onPanelSecondary: m.onPanel.secondary,
      /** Bilimsel ad, hero scrim'i üstünde (Büyülü yönü — açık lila). */
      onPanelAccent: m.onPanel.lilac,
    },
    border: {
      subtle: c.border,
      strong: c.textPrimary,
      /** Mürekkep kenarları (04 §7.1) — kartın düzlüğünü kıran 1px tanım. */
      hairline: m.borderTone.hairline,
      soft: m.borderTone.soft,
      medium: m.borderTone.medium,
      /** Cam kenarı: camın üstündeki ışık çizgisi (04 §5, §7.3). */
      glass: m.glassBorder.frost,
      glassSoft: m.glassBorder.mist,
      /** İnce altın saç çizgisi — Büyülü yönünün kart kenarı (04 §7.3: max 1px). */
      gold: m.borderTone.gold,
    },
    /** İç ışık (04 §11) — 1px üst kenar / yumuşak radial yıkama. */
    highlight: {
      light: m.innerHighlight.light,
      soft: m.innerHighlight.soft,
      gold: m.innerHighlight.gold,
    },
    /**
     * Glow (04 §10) — ana elevation yöntemi DEĞİL: yalnız selected/active/
     * celestial/ceremonial durumda, viewport başına en fazla 2 kaynak.
     */
    glow: m.glow,
    /**
     * Hero şeridi — görselin ALTINDAKİ açık krem bant. Hero katmansız olduğu
     * için metin/zemin kontrastı görselden bağımsızdır (bkz. heroStrip token'ı).
     */
    heroStrip: m.heroStrip,
    /** Zemin lila-krem tonlaması (Büyülü yönü) — koyulaşma değil, tonlama. */
    ambientTint: m.ambientTint,
    /** Doku opaklıkları (04 §17.2). */
    texture: m.texture,
    action: {
      /** Primary buton zemini / vurgu eylem rengi — ekran accent'i. */
      primary: accentHex,
      /**
       * Accent zemin üstü metin: krom metni ile krom yüzeyinden HESAPLA ile
       * seçilir (15 §10). Sabit "beyaz metin" varsayımı orta tonlu accent'lerde
       * AA'yı geçmiyordu (adaçayı üstünde beyaz 3.03:1 → koyu metin 4.76:1);
       * koyu accent'lerde (yosun) tersi doğru. Tek hesap kaynağı: theme/contrast.
       */
      onPrimary: bestTextOn(accentHex, [c.textPrimary, c.surface]),
      /** Secondary (çerçeveli) buton çerçevesi + metni. */
      outline: accentHex,
      /** Tertiary (tonal) buton zemini. */
      tonal: c.surfaceTint,
      onTonal: c.textPrimary,
      /** Ghost (yalnız metin) buton metni. */
      ghost: accentHex,
      /** Yıkıcı eylem zemini — botanik ailenin terracotta'sı (15 §4). */
      destructive: primitive.color.botanical.terracotta,
      onDestructive: c.surface,
    },
    navigation: {
      /** Tab bar / header zemini sabittir — ambient yalnız canvas'ı tonlar. */
      background: c.surface,
      border: c.border,
      active: c.textPrimary,
      inactive: c.textSecondary,
    },
  } as const;
}

export type SemanticColors = ReturnType<typeof buildSemanticColors>;

/**
 * Hazır semantic setin accent'ini ekran sözleşmesininkiyle değiştirir
 * (15 §6 accentHex). ScreenShell kullanır; ambient/krom değerlerine dokunmaz.
 */
export function withAccent(colors: SemanticColors, accentHex: string): SemanticColors {
  if (colors.action.primary === accentHex) return colors;
  return {
    ...colors,
    action: {
      ...colors.action,
      primary: accentHex,
      onPrimary: bestTextOn(accentHex, [c.textPrimary, c.surface]),
      outline: accentHex,
      ghost: accentHex,
    },
  };
}
