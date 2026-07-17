/**
 * EmptyState — boş durum (Design §35): bağlam + sonraki adım + gelecek
 * potansiyeli; kullanıcı suçlanmaz. İllüstrasyon/ikon asli bilgi taşımaz
 * (dekoratif). Metin prop'la gelir — microcopy üretilmez.
 */

import { StateScaffold, type StateScaffoldProps } from './state-scaffold';

export type EmptyStateProps = Omit<StateScaffoldProps, 'live'>;

export function EmptyState(props: EmptyStateProps) {
  return <StateScaffold {...props} />;
}
