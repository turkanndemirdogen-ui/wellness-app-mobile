# HerbIllustration — Component Contract (Design §31)

Statü (§32): **Experimental** (nihai illüstrasyon seti B-üretim #2 gelene dek). Kaynak: `src/domain-ui/herb-illustration.tsx` + `herb-illustration-assets.ts`.

## Purpose
B3 hero botanik illüstrasyon yuvası (ana-sayfa-spec B3; §16.2 illustration language). Varlık hazırsa görseli, değilse üretim-güvenli yer tutucu motifi gösterir — hero görsel alanı asla boş/emoji değildir.

## Responsibilities / Non-responsibilities
- **Yapar:** `illus_ref` → paketlenmiş görsel eşlemesi (expo-image, sabit yükseklik); eşleşme yoksa pudra paletli tek dal motifi.
- **Yapmaz:** varlık indirme (yalnız paketlenmiş), bitki adı/metni, seçim mantığı.

## Anatomy
Sabit yükseklikli yuva (`HERB_ILLUSTRATION_HEIGHT` = s96) → görsel (contain) VEYA yer tutucu: yumuşak daire zemin + dal (tomurcuk, sap, iki yaprak — organik asimetri).

## Variants
asset (haritada eşleşme) · placeholder (varsayılan bugün — harita boş).

## Sizes
Tek boyut: s96 yükseklik (iskelet eşleşmesi için dışa açık sabit).

## States
Durumsuz; yükleme durumu ekran iskeletinde (Card media slotuna `Skeleton height={HERB_ILLUSTRATION_HEIGHT}`).

## Interaction
Yok (kartın tüm-yüzey basılabilirliği çağırandadır — §25).

## Motion
Görsel varyantta `duration.component` yumuşak belirme (expo-image transition). Yer tutucu statik.

## Haptics
Yok.

## Accessibility
Dekoratif — ağaçtan gizli (§43.1); bitki adı kart başlığında/etiketinde taşınır.

## Responsive behavior
Yuva tam genişlik, içerik ortalanır; yükseklik sabit → yerleşim varlıktan bağımsız (zıplama yok).

## Composition rules
Domain (§49). Card `media` slotunda kullanılır; metin alanını engellemez (spec B3).

## Developer API
`illusRef?: string | null`. Varlık ekleme: `src/assets/illustrations/<ref>.png` + `HERB_ILLUSTRATIONS` haritasına `require` satırı — başka kod değişmez.

## Design tokens
`space.s96/s64/s48/s32/s24/s16/s12/s4` · `radius.full` · `duration.component` · semantic `surface.base/selected`, `action.primary`.

## Performance
Yer tutucu: 5 statik View. Görsel: expo-image (bellek/disk önbelleği).

## Do / Don't
- **Do:** havuz görselleri geldikçe yalnız varlık haritasını doldur.
- **Don't:** yer tutucuyu marka illüstrasyonu sanıp yayma kararı verme (LoRA hattı — illustrasyon-uretim-spec); yuvaya metin koyma.

## Known limitations
Yer tutucu tür-doğru botanik form taşımaz (bilinçli — yanlış tür imasından kaçınır, soyut motif); nihai görseller illustrasyon-uretim-spec hattından. Silüet hali (R1.3) kapsam dışı.
