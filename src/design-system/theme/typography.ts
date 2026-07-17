/**
 * Tipografi rolleri (Design §12.2) — token → RN TextStyle eşlemesi.
 *
 * Sayısal rampa tokens.json'dan gelir (TEK KAYNAK, GEÇİCİ değerler orada
 * işaretli). Aileler platform'a bağlı olduğundan JSON'a inemez; iki aile
 * kuralı (§12.1) burada uygulanır: Display (serif — display.* + heading.*)
 * ve UI (sans — body.*, label, caption, overline). Özel display-serif fontu
 * (Faz 6, bağımlılık onayı) geldiğinde yalnız constants/theme.ts Fonts değişir.
 */

import type { TextStyle } from 'react-native';

import { Fonts } from '@/constants/theme';
import { primitive } from '../tokens/primitive.generated';

const t = primitive.typography;

const families = {
  display: Fonts.serif,
  ui: Fonts.sans,
} as const;

type RampEntry = {
  size: number;
  lineHeight: number;
  weight: string;
  letterSpacing?: number;
};

function toStyle(
  entry: RampEntry,
  family: keyof typeof families,
  uppercase = false,
): TextStyle {
  return {
    fontFamily: families[family],
    fontSize: entry.size,
    lineHeight: entry.lineHeight,
    fontWeight: entry.weight as TextStyle['fontWeight'],
    letterSpacing: entry.letterSpacing,
    textTransform: uppercase ? 'uppercase' : undefined,
  };
}

export const textRoles = {
  'display.xl': toStyle(t.display.xl, 'display'),
  'display.l': toStyle(t.display.l, 'display'),
  'heading.xl': toStyle(t.heading.xl, 'display'),
  'heading.l': toStyle(t.heading.l, 'display'),
  'heading.m': toStyle(t.heading.m, 'display'),
  'heading.s': toStyle(t.heading.s, 'display'),
  'body.l': toStyle(t.body.l, 'ui'),
  'body.m': toStyle(t.body.m, 'ui'),
  'body.s': toStyle(t.body.s, 'ui'),
  label: toStyle(t.label, 'ui'),
  caption: toStyle(t.caption, 'ui'),
  // overline nadir kullanılır (§12.2) — büyük harf + geniş letterSpacing.
  overline: toStyle(t.overline, 'ui', true),
} as const;

export type TextRoleName = keyof typeof textRoles;
