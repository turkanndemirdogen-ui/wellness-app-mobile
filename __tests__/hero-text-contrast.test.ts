/**
 * UYKUDA — KABUL KRİTERİ TESTİ (hero metin okunurluğu).
 *
 * NEDEN DEVRE DIŞI (2026-09-02, ürün sahibi kararı): hero KATMANSIZ hale geldi.
 * Bitki adı ve bilimsel ad artık fotoğrafın ÜSTÜNDE değil, görselin ALTINDAKİ
 * opak krem şeritte duruyor. Metin görsel pikselleriyle hiç karşılaşmadığı için
 * "metin alanındaki en açık piksel" diye bir ölçü kalmadı — bu kapı konusuz.
 * Yerini `hero-strip-contrast` aldı: metin/zemin çiftleri token seviyesinde
 * doğrulanıyor, ölçüme gerek yok çünkü zemin sabit.
 *
 * NEDEN SİLİNMEDİ: yerleşim ileride görsel-üstü metne dönerse bu kapı ve onu
 * besleyen ölçüm hattı (scripts/measure-hero-contrast.py, `npm run
 * check:hero-contrast`) olduğu gibi geri açılır. Açmak için: aşağıdaki
 * `describe.skip` çağrılarını `describe` yap, hero'ya katmanları geri koy ve
 * ölçümü yeniden koş (token parmak izi testi bayat ölçümü zaten yakalar).
 *
 * Ölçüm verisi (`herb-hero-luma.generated.ts`) da yerinde duruyor ama hiçbir
 * bileşen onu okumuyor.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  HERB_HERO_LUMA,
  HERO_MEASURED_WITH,
  HERO_PLACEHOLDER_CLOUD_ALPHA,
  HERO_PLACEHOLDER_CONTRAST,
  HERO_TEXT_AA,
} from '@/domain-ui/herb-hero-luma.generated';
import { primitive } from '@/design-system/tokens/primitive.generated';

type AssetRecord = { herb_id: string; path: string; version: number };

/** Kanonik varlık kaydı — seed hattının da okuduğu tek liste. */
function assetRecords(): AssetRecord[] {
  const raw = readFileSync(join(__dirname, '..', '..', 'content', 'bitki-gorselleri.json'));
  return JSON.parse(String(raw)).gorseller as AssetRecord[];
}

/** Uyuyan blok derlenebilir kalsın diye yerel yer tutucu (çalıştırılmaz). */
const resolveCloudAlpha = (_herbId: string, hasImage: boolean): number =>
  hasImage ? 0 : HERO_PLACEHOLDER_CLOUD_ALPHA;

describe.skip('hero metin kontrastı — kabul kriteri (UYKUDA)', () => {
  it('varlık kaydındaki HER görselin ölçümü var (ölçülmemiş görsel eklenemez)', () => {
    const missing = assetRecords()
      .map((r) => r.herb_id)
      .filter((id) => HERB_HERO_LUMA[id] == null);
    expect(missing).toEqual([]);
  });

  it('canlı görsel sayısı ölçüm sayısıyla aynı', () => {
    expect(Object.keys(HERB_HERO_LUMA)).toHaveLength(assetRecords().length);
  });

  it.each(Object.entries(HERB_HERO_LUMA))(
    '%s — metin alanındaki en açık piksel beyaz yazıyla ≥4.5:1',
    (_id, luma) => {
      expect(luma.contrast).toBeGreaterThanOrEqual(HERO_TEXT_AA);
    },
  );

  it('görseli olmayan bitkide (yer tutucu) de eşik sağlanır', () => {
    expect(HERO_PLACEHOLDER_CONTRAST).toBeGreaterThanOrEqual(HERO_TEXT_AA);
    expect(HERO_PLACEHOLDER_CLOUD_ALPHA).toBeGreaterThan(0);
  });

  it('bulut yalnız gerektiğinde çizilir; gerektiğinde gücü kayıtlı', () => {
    for (const [id, luma] of Object.entries(HERB_HERO_LUMA)) {
      if (luma.needsCloud) {
        expect(luma.cloudAlpha).toBeGreaterThan(0);
        expect(luma.cloudAlpha).toBeLessThanOrEqual(
          primitive.material.heroTextSafety.cloudAlphaMax,
        );
        // Bulutsuz hâl gerçekten eşiğin altındaydı (gereksiz bulut yok).
        expect(luma.contrastPlain).toBeLessThan(HERO_TEXT_AA);
      } else {
        expect(luma.cloudAlpha).toBe(0);
        expect(luma.contrastPlain).toBeGreaterThanOrEqual(HERO_TEXT_AA);
      }
      expect(resolveCloudAlpha(id, true)).toBe(luma.needsCloud ? luma.cloudAlpha : 0);
    }
  });

  it('bilinmeyen bitki / görselsiz hâl EN GÜVENLİ tarafa düşer', () => {
    // Ölçümü olmayan yeni bir bitki sessizce emniyetsiz kalmaz.
    expect(resolveCloudAlpha('henuz-olculmemis-bitki', true)).toBe(
      HERO_PLACEHOLDER_CLOUD_ALPHA,
    );
    expect(resolveCloudAlpha('lavanta', false)).toBe(HERO_PLACEHOLDER_CLOUD_ALPHA);
  });
});

describe.skip('ölçüm tazeliği — katman değerleri değişirse ölçüm bayatlar (UYKUDA)', () => {
  it('ölçümün yapıldığı vinyet/sis/bulut değerleri bugünkü token’larla aynı', () => {
    const live: Record<string, string | number> = {
      ...primitive.material.heroAtmosphere,
      ...primitive.material.heroTextSafety,
    };
    for (const [key, measured] of Object.entries(HERO_MEASURED_WITH)) {
      expect([key, live[key]]).toEqual([key, measured]);
    }
  });

  it('vinyet gerçekten kenarlarda koyulaşıyor — merkez şeffaf (görsel net kalır)', () => {
    const atm = primitive.material.heroAtmosphere;
    const alphaOf = (value: string) => Number(value.replace(/rgba?\(|\)/g, '').split(',')[3]);
    expect(alphaOf(atm.vignetteInner)).toBe(0);
    expect(alphaOf(atm.vignetteMid)).toBeGreaterThan(0);
    expect(alphaOf(atm.vignetteOuter)).toBeGreaterThan(alphaOf(atm.vignetteMid));
    expect(atm.vignetteStop0).toBeLessThan(atm.vignetteStop1);
  });
});
