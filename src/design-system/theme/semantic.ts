/**
 * SEMANTIC katman — primitive → semantic eşlemesi (Design master §44-45).
 *
 * LIGHT-FIRST (LOCKED): v1.0'da tam dark mode YOK. Semantic renkler yalnız
 * light primitivlerden türetilir; primitive.color.dark runtime'da kullanılmaz.
 *
 * ADAPTIVE AMBIENT (Design §11.5): günün saatine göre YALNIZ surface.canvas
 * tonu değişir (primitive.color.ambient). Kart, metin, navigasyon gibi çekirdek
 * semantic renkler ve okunabilirlik ASLA değişmez.
 *
 * Bileşenler primitive'e DOĞRUDAN bağlanamaz (§11.4) — bu dosya tek eşleme
 * noktasıdır; grup adları §45'in semantic setinden (surface/text/border/action/
 * navigation) Faz 1'de kullanılan alt küme.
 */

import { primitive } from '../tokens/primitive.generated';

export type TimeOfDay = keyof typeof primitive.color.ambient;

const p = primitive.color.light;

export function buildSemanticColors(timeOfDay: TimeOfDay) {
  return {
    surface: {
      /** Ekran zemini — TEK ambient'e duyarlı renk. */
      canvas: primitive.color.ambient[timeOfDay],
      /** Ambient'ten bağımsız sabit taban (kart üstü rozet/çip zeminleri). */
      base: p.background,
      card: p.backgroundElement,
      selected: p.backgroundSelected,
    },
    /**
     * Ambient grubu (§45 semantic seti; §11.5): ekran üstünün yumuşak ışık
     * yıkaması. `wash` günün saat diliminin tonudur, `base` eridiği nötr
     * zemin — gün diliminde wash === base (yıkama görünmez, degrade nötr).
     * YENİ RENK DEĞİL: her iki değer de mevcut primitivlerdir.
     */
    ambient: {
      wash: primitive.color.ambient[timeOfDay],
      base: p.background,
    },
    text: {
      primary: p.text,
      secondary: p.textSecondary,
    },
    border: {
      subtle: p.backgroundSelected,
      strong: p.text,
    },
    action: {
      /** Primary buton zemini / vurgu eylem rengi. */
      primary: p.accent,
      /** Accent zemin üstü metin — saf beyaz değil, pudra krem (§11.3). */
      onPrimary: p.background,
      /** Secondary (çerçeveli) buton çerçevesi + metni. */
      outline: p.accent,
      /** Tertiary (tonal) buton zemini. */
      tonal: p.backgroundSelected,
      onTonal: p.text,
      /** Ghost (yalnız metin) buton metni. */
      ghost: p.accent,
      /** Yıkıcı eylem zemini (GEÇİCİ değer — tokens.json'da işaretli). */
      destructive: p.danger,
      onDestructive: p.background,
    },
    navigation: {
      /** Tab bar / header zemini sabittir — ambient yalnız canvas'ı tonlar. */
      background: p.background,
      border: p.backgroundElement,
      active: p.text,
      inactive: p.textSecondary,
    },
  } as const;
}

export type SemanticColors = ReturnType<typeof buildSemanticColors>;
