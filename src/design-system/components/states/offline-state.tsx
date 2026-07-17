/**
 * OfflineState — çevrimdışı durumu (Design §38): sakin, suçlamayan sunum;
 * retry kolay erişilir.
 *
 * ÖNEMLİ: Bu bileşen bağlantı ALGILAMAZ ve algılıyormuş gibi davranmaz —
 * mevcut bağımlılıklarla güvenilir bağlantı tespiti yok (NetInfo onay
 * listesinde). Ürün kullanımına T11'in hata sınıflandırması + cache katmanı
 * bağlayacak; o zamana dek yalnız izole/galeri önizlemesi. Onaylı çevrimdışı
 * microcopy'si de henüz yok — metin prop'la gelir.
 */

import { StateScaffold, type StateScaffoldProps } from './state-scaffold';

export type OfflineStateProps = Omit<StateScaffoldProps, 'live' | 'badge'>;

export function OfflineState(props: OfflineStateProps) {
  return <StateScaffold live="polite" {...props} />;
}
