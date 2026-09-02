/**
 * Test 6 — Türkçe karakter desteği: TTF KAPSAM DENETİMİ.
 *
 * Kabul kriteri (ürün sahibi, 2026-09-02): "Öksürük Otu Çiçeği" ve "Şeytan
 * Pençesi" hem başlıkta hem gövdede doğru render olmalı; harfler sistem
 * yedeğine düşerse fontun TTF'i genişletilmiş latin içermiyor demektir.
 *
 * Sistem yedeğine düşme YALNIZCA fontun kendi cmap tablosunda kod noktası
 * yoksa olur. Bu test yapısal varsayım yapmaz — yüklenen TTF dosyalarının
 * cmap'ini okuyup gerçek kapsamı ölçer. Font paketi sürümü değişip kapsam
 * daralırsa burada patlar.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { fontFamilies } from '@/design-system/theme/typography';
import { TR_TEST_STRING } from '@/lib/text-tr';

const REQUIRED_CHARS = ['Ç', 'ç', 'Ğ', 'ğ', 'İ', 'ı', 'Ö', 'ö', 'Ş', 'ş', 'Ü', 'ü'];

/** Kabul kriterindeki iki ad — tüm özel harfleri kapsar. */
const ACCEPTANCE_WORDS = ['Öksürük Otu Çiçeği', 'Şeytan Pençesi'];

const ROOT = join(__dirname, '..');

/** Yüklenen her kesim → TTF yolu (app/_layout.tsx useFonts listesiyle aynı küme). */
const LOADED_CUTS: Record<string, string> = {
  Cinzel_400Regular: '@expo-google-fonts/cinzel/400Regular/Cinzel_400Regular.ttf',
  Cinzel_600SemiBold: '@expo-google-fonts/cinzel/600SemiBold/Cinzel_600SemiBold.ttf',
  Jost_400Regular: '@expo-google-fonts/jost/400Regular/Jost_400Regular.ttf',
  Jost_500Medium: '@expo-google-fonts/jost/500Medium/Jost_500Medium.ttf',
  Jost_400Regular_Italic: '@expo-google-fonts/jost/400Regular_Italic/Jost_400Regular_Italic.ttf',
  Caveat_500Medium: '@expo-google-fonts/caveat/500Medium/Caveat_500Medium.ttf',
};

/** TTF cmap tablosundaki kod noktaları (format 4 ve 12). */
function cmapCodepoints(file: string): Set<number> {
  const buf = readFileSync(join(ROOT, 'node_modules', file));
  const numTables = buf.readUInt16BE(4);
  let cmapOffset = -1;
  for (let i = 0; i < numTables; i++) {
    const rec = 12 + i * 16;
    if (buf.toString('latin1', rec, rec + 4) === 'cmap') {
      cmapOffset = buf.readUInt32BE(rec + 8);
      break;
    }
  }
  if (cmapOffset < 0) throw new Error(`cmap tablosu yok: ${file}`);

  const out = new Set<number>();
  const subtableCount = buf.readUInt16BE(cmapOffset + 2);
  for (let i = 0; i < subtableCount; i++) {
    const rec = cmapOffset + 4 + i * 8;
    const sub = cmapOffset + buf.readUInt32BE(rec + 4);
    const format = buf.readUInt16BE(sub);
    if (format === 4) {
      const segX2 = buf.readUInt16BE(sub + 6);
      const seg = segX2 / 2;
      for (let s = 0; s < seg; s++) {
        const end = buf.readUInt16BE(sub + 14 + s * 2);
        const start = buf.readUInt16BE(sub + 16 + segX2 + s * 2);
        if (end === 0xffff) continue;
        for (let cp = start; cp <= end; cp++) out.add(cp);
      }
    } else if (format === 12) {
      const groups = buf.readUInt32BE(sub + 12);
      for (let g = 0; g < groups; g++) {
        const go = sub + 16 + g * 12;
        const start = buf.readUInt32BE(go);
        const end = buf.readUInt32BE(go + 4);
        for (let cp = start; cp <= Math.min(end, start + 0xffff); cp++) out.add(cp);
      }
    }
  }
  return out;
}

describe('Türkçe karakter desteği — TTF kapsamı (15 §5)', () => {
  test('TR_TEST_STRING zorunlu 12 karakteri içerir', () => {
    for (const ch of REQUIRED_CHARS) {
      expect(TR_TEST_STRING).toContain(ch);
    }
  });

  test('kullanılan her aile adı gerçekten yüklenen bir kesim', () => {
    for (const family of Object.values(fontFamilies)) {
      expect(Object.keys(LOADED_CUTS)).toContain(family);
    }
  });

  test.each(Object.keys(LOADED_CUTS))(
    '%s — zorunlu Türkçe harflerin hepsi cmap içinde (sistem yedeğine düşme yok)',
    (cut) => {
      const covered = cmapCodepoints(LOADED_CUTS[cut]);
      const missing = REQUIRED_CHARS.filter((ch) => !covered.has(ch.codePointAt(0) as number));
      expect(missing).toEqual([]);
    },
  );

  test.each(Object.keys(LOADED_CUTS))(
    '%s — kabul kriteri sözcükleri harf harf kapsanıyor',
    (cut) => {
      const covered = cmapCodepoints(LOADED_CUTS[cut]);
      for (const word of ACCEPTANCE_WORDS) {
        const missing = [...word].filter(
          (ch) => ch !== ' ' && !covered.has(ch.codePointAt(0) as number),
        );
        expect(missing).toEqual([]);
      }
    },
  );

  test('display (Cinzel) ve gövde (Jost) ailelerinin ikisi de kapsıyor', () => {
    // Kabul kriteri "hem başlıkta hem gövdede" diyor: iki aileyi ayrıca bağlar.
    for (const family of [fontFamilies.display, fontFamilies.body]) {
      const covered = cmapCodepoints(LOADED_CUTS[family]);
      for (const ch of REQUIRED_CHARS) {
        expect(covered.has(ch.codePointAt(0) as number)).toBe(true);
      }
    }
  });
});
