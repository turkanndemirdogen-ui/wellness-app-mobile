/**
 * SearchField — arama girişi (07 §10/§14 control). Field iskeleti + baş 'search'
 * ikonu + pill kenar + (value doluyken) temizle düğmesi. Label görünür kalır;
 * temizle düğmesi 44 hedefli IconButton'dır (küçük iç hedef yok).
 */

import { Field, type FieldProps } from './field';

export type SearchFieldProps = FieldProps & {
  /** Temizle eylemi — verilirse value doluyken 'close' düğmesi gösterilir. */
  onClear?: () => void;
  /** Temizle düğmesi ekran okuyucu etiketi (Türkçe, çağırandan). */
  clearLabel?: string;
};

export function SearchField({ onClear, clearLabel, ...props }: SearchFieldProps) {
  return <Field {...props} leading="search" pill onClear={onClear} clearLabel={clearLabel} />;
}
