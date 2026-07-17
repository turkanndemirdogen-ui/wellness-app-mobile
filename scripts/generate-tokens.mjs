#!/usr/bin/env node
/**
 * generate-tokens.mjs — sıfır bağımlılıklı token üretici.
 *
 * Kaynak:  src/design-system/tokens/tokens.json (W3C Design Tokens formatı)
 * Çıktı:   src/design-system/tokens/primitive.generated.ts
 *
 * Design master §46 "Style Dictionary veya eşdeğeri" der; Faz 1 kuralı gereği
 * (onaysız bağımlılık yok) eşdeğer olarak bu bağımlılıksız script kullanılır.
 * Kural: token dosyaları TEK kaynaktan üretilir (roadmap Faz 1 DoD) — TS çıktısı
 * elle DÜZENLENMEZ, yalnız `npm run tokens` ile yenilenir.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcPath = join(root, 'src', 'design-system', 'tokens', 'tokens.json');
const outPath = join(root, 'src', 'design-system', 'tokens', 'primitive.generated.ts');

function fail(message) {
  console.error(`[tokens] HATA: ${message}`);
  process.exit(1);
}

let raw;
try {
  raw = readFileSync(srcPath, 'utf8');
} catch {
  fail(`kaynak okunamadı: ${srcPath}`);
}

let doc;
try {
  doc = JSON.parse(raw);
} catch (e) {
  fail(`tokens.json geçerli JSON değil: ${e.message}`);
}

/**
 * W3C token ağacını sade değer ağacına indirger:
 * - `$value` taşıyan düğüm → değerin kendisi
 * - diğer düğümler → grup ($ ile başlayan metadata anahtarları atılır)
 * Her yaprağın {$value} taşıması zorunlu; aksi yapı hatası sayılır.
 */
function transform(node, path) {
  if (node !== null && typeof node === 'object' && !Array.isArray(node)) {
    if ('$value' in node) return node.$value;
    const out = {};
    for (const [key, val] of Object.entries(node)) {
      if (key.startsWith('$')) continue;
      out[key] = transform(val, `${path}.${key}`);
    }
    if (Object.keys(out).length === 0) fail(`boş token grubu: ${path}`);
    return out;
  }
  fail(`token olmayan yaprak: ${path} — her yaprak {"$value": …} biçiminde olmalı`);
}

const tree = transform(doc, 'primitive');

const header = `// OTOMATİK ÜRETİLDİ — ELLE DÜZENLEME.
// Kaynak: src/design-system/tokens/tokens.json · Üretim: \`npm run tokens\`
// Bu dosya bilinçli olarak commit edilir: uygulama ön-üretim adımı olmadan
// (\`npm start\` doğrudan) çalışabilsin diye. Değer değişikliği YALNIZ
// tokens.json'da yapılır; sonra script yeniden koşulur.
`;

const body = `export const primitive = ${JSON.stringify(tree, null, 2)} as const;\n`;

writeFileSync(outPath, `${header}\n${body}`, 'utf8');
console.log(`[tokens] üretildi: ${outPath}`);
