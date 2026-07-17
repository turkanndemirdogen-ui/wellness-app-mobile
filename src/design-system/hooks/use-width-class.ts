/**
 * Genişlik sınıfı runtime token'ı (Design §41) + yatay ekran marjı (§13.3).
 *
 * Sınıflar: compact 320-374 · standard 375-429 (ana referans) · large 430+.
 * Faz 1 kapsamı bu üç sınıftır; tablet (600+) şimdilik 'large' sayılır ve
 * iki-panel/max-width davranışı sonraki görevlerin işidir (§41 tablet satırı).
 *
 * Marjlar §13.3: compact 20 · standard 24 · large 24-32 (bu aralıktan 32
 * seçildi — GEÇİCİ; ortalanmış max-width düzeni gelince gözden geçirilir).
 *
 * Saf mantık (widthClassFor / horizontalMarginFor) RN dinleyicisinden ayrı —
 * hook yalnız useWindowDimensions'ı bağlar.
 */

import { useWindowDimensions } from 'react-native';

import { primitive } from '../tokens/primitive.generated';

export type WidthClass = 'compact' | 'standard' | 'large';

export function widthClassFor(width: number): WidthClass {
  if (width < 375) return 'compact';
  if (width < 430) return 'standard';
  return 'large';
}

export function horizontalMarginFor(widthClass: WidthClass): number {
  switch (widthClass) {
    case 'compact':
      return primitive.space.s20;
    case 'standard':
      return primitive.space.s24;
    case 'large':
      return primitive.space.s32;
  }
}

export function useWidthClass(): {
  widthClass: WidthClass;
  /** §13.3 ekran kenarı yatay marjı (pt). */
  horizontalMargin: number;
} {
  const { width } = useWindowDimensions();
  const widthClass = widthClassFor(width);
  return { widthClass, horizontalMargin: horizontalMarginFor(widthClass) };
}
