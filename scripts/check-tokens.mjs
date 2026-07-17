#!/usr/bin/env node
/**
 * check-tokens.mjs — TOKEN KAPISI (sıfır bağımlılık).
 *
 * Roadmap Faz 1 AC #2: "hiçbir bileşende hardcoded renk/spacing yok".
 * src/ altındaki .ts/.tsx dosyalarını tarar; yasak ham tasarım değerlerini
 * satır satır raporlar ve ihlal varsa exit 1 döner.
 *
 * Kurallar:
 *   color     ham hex (#xxx…) / rgb() / hsl()      → semantic/primitive token
 *   fontSize  fontSize: <sayı>                      → tipografi rolü (Text)
 *   radius    borderRadius: <sayı>                  → Radius / primitive.radius
 *   duration  duration: <sayı> · .duration(<sayı>)  → motionDurations
 *   easing    Easing.* doğrudan kullanımı           → motionEasing köprüsü
 *
 * İstisnalar YALNIZ aşağıdaki denetimli ALLOWLIST'ten: her giriş dosya +
 * kural + gerekçe taşır. Yeni istisna eklemek bilinçli bir gözden geçirme
 * adımıdır (PR'da görünür).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'src');

const RULES = [
  {
    id: 'color',
    desc: 'ham renk — semantic/primitive token kullan',
    patterns: [/#[0-9a-fA-F]{3,8}\b/, /\b(?:rgba?|hsla?)\(/],
  },
  {
    id: 'fontSize',
    desc: 'fontSize literal — tipografi rolü kullan (Text role=…)',
    patterns: [/fontSize:\s*\d/],
  },
  {
    id: 'radius',
    desc: 'borderRadius literal — Radius/primitive.radius kullan',
    patterns: [/borderRadius:\s*\d/],
  },
  {
    id: 'duration',
    desc: 'süre literal — motionDurations kullan',
    patterns: [/duration:\s*\d/, /\.duration\(\s*\d/],
  },
  {
    id: 'easing',
    desc: 'Easing doğrudan — motionEasing köprüsünü kullan',
    patterns: [/\bEasing\./],
  },
];

// path (src'e göre, / ayraçlı) → { rules: Set('*' veya kural id), reason }
const ALLOWLIST = new Map([
  [
    'design-system/tokens/primitive.generated.ts',
    { rules: new Set(['*']), reason: 'üretilmiş token çıktısı — tek kaynak tokens.json' },
  ],
  [
    'design-system/theme/motion.ts',
    { rules: new Set(['easing']), reason: 'token → Reanimated easing köprüsü (tek kurulum noktası)' },
  ],
]);

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (/\.(ts|tsx)$/.test(name)) files.push(full);
  }
  return files;
}

const violations = [];

for (const file of walk(srcDir)) {
  const rel = relative(srcDir, file).replaceAll('\\', '/');
  const allowed = ALLOWLIST.get(rel);
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);

  for (const rule of RULES) {
    if (allowed && (allowed.rules.has('*') || allowed.rules.has(rule.id))) continue;
    lines.forEach((line, i) => {
      if (rule.patterns.some((p) => p.test(line))) {
        violations.push({ rel, line: i + 1, rule, text: line.trim() });
      }
    });
  }
}

if (violations.length > 0) {
  console.error(`[token-gate] ${violations.length} ihlal:\n`);
  for (const v of violations) {
    console.error(`  src/${v.rel}:${v.line}  [${v.rule.id}] ${v.rule.desc}`);
    console.error(`    ${v.text}\n`);
  }
  process.exit(1);
}

console.log(
  `[token-gate] temiz — ${walk(srcDir).length} dosya tarandı, ` +
    `${RULES.length} kural, ${ALLOWLIST.size} denetimli istisna.`,
);
