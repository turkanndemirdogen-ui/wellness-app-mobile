/**
 * TextArea — çok satır metin girişi (07 §10). Field iskeletinin multiline
 * sarmalayıcısı; yükseklik `rows` × satır yüksekliğinden gelir (Dynamic Type ile
 * büyür, metin kırpılmaz).
 */

import { Field, type FieldProps } from './field';
import { primitive } from '../tokens/primitive.generated';

export type TextAreaProps = FieldProps & {
  /** Görünür başlangıç satır sayısı (yükseklik tabanı). Varsayılan 4. */
  rows?: number;
};

export function TextArea({ rows = 4, ...props }: TextAreaProps) {
  const minHeight = rows * primitive.typeVariant.uiBody.lineHeight + primitive.space.s24;
  return <Field {...props} multiline minHeight={minHeight} />;
}
