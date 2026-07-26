/**
 * TextField — tek satır metin girişi (07 §10). Field iskeletinin ince
 * sarmalayıcısı; label her zaman görünür, error = ikon+metin, min yükseklik 48.
 */

import { Field, type FieldProps } from './field';

export type TextFieldProps = FieldProps;

export function TextField(props: TextFieldProps) {
  return <Field {...props} />;
}
