# HerbImage

Bitki kartı Storage görseli — `botanicals` bucket'ındaki `card-01.webp`
görsellerini gösterir; görsel yoksa 10 §11 yer tutucusuna düşer.

## Ne yapar

- `imagePath` + `imageVersion` → Storage SDK `getPublicUrl` ile public URL
  üretir; cache anahtarı `?v=<version>` (10 §10: TAM URL saklanmaz, yeni sürüm
  yüklenince istemci cache'i doğal geçer).
- Görsel `expo-image` ile `contentFit="cover"` doldurur — PlantCard `media`
  slotuna (07 §6) doğrudan takılır, boyut/oran slottan gelir.
- Yer tutucu (path yok · Supabase yapılandırılmamış · yükleme hatası):
  nötr zemin + dal motifi (`HerbIllustration`) + bilimsel ad (italik,
  `scientificName` varyantı) + "Görsel doğrulama bekliyor" etiketi.
  Etiket metin taşır — durum yalnız renkle bildirilmez (15 §10).

## Yapmaz

- Koyu zemin/degrade üretmez (15 §3 — koyuluk yalnız VisualPanel yüzeylerinde).
- Bilimsel adı kendisi bulmaz — `Herb` tipinde alan yok, PROP'la gelir (06 §4).
- İndirme önbelleği yönetmez (expo-image + `?v=` anahtarına bırakır).

## Erişilebilirlik

`accessibilityLabel` verilmezse DEKORATİFTİR ve a11y ağacından gizlenir —
adlar kartın kendi label'ında taşınır (07 §6). Verilirse görsel modu label'ı
aynen, yer tutucu modu label + bekliyor durumunu birlikte okur.

## Test

`__tests__/herb-image-contract.test.tsx` — URL kuralı (?v=, null yollar,
yapılandırılmamış Supabase), dekoratiflik, yer tutucu metin sözleşmesi.
