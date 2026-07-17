/**
 * Spacer — sabit boşluk primitive'i (Design §28).
 *
 * Gap'in yetmediği yerde (ör. ScrollView sonu) space ölçeğinden sabit boşluk.
 * Keyfî piksel almaz — yalnız token adı (§13.1).
 */

import { View } from 'react-native';

import { primitive } from '../tokens/primitive.generated';
import type { SpaceKey } from './stack';

export type SpacerProps = {
  size: SpaceKey;
  horizontal?: boolean;
};

export function Spacer({ size, horizontal = false }: SpacerProps) {
  const value = primitive.space[size];
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={horizontal ? { width: value } : { height: value }}
    />
  );
}
