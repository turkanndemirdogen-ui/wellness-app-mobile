/**
 * Test ortamı için asgari Node tip bildirimleri.
 *
 * Yalnızca font TTF kapsam testinin (turkish-font-characters) ihtiyaç duyduğu
 * yüzey bildirilir. `@types/node` bağımlılığı EKLENMEZ: uygulama kodu Node
 * API'si kullanmaz, tip yüzeyini geniş tutmak jest dışı dosyalarda yanlış
 * çağrıları meşrulaştırırdı.
 */

declare const __dirname: string;

interface FontBuffer {
  readUInt16BE(offset: number): number;
  readUInt32BE(offset: number): number;
  toString(encoding: string, start: number, end: number): string;
}

declare module 'node:fs' {
  export function readFileSync(path: string): FontBuffer;
}

declare module 'node:path' {
  export function join(...parts: string[]): string;
}
