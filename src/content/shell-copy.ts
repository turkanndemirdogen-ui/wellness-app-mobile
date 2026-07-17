/**
 * KABUK METİNLERİ — PROVISIONAL, Türkan onayı bekliyor (Faz 1 kapanış şartı).
 *
 * Uygulamada HÂLİHAZIRDA görünen geçici metinlerin tek gözden-geçirme dosyası.
 * Bu görevde YENİ metin ÜRETİLMEDİ — mevcut ekran metinleri buraya taşındı.
 * Editorial ses kuralları (davetkâr, buyurmayan) nihai yazımda uygulanacak;
 * onay sonrası tek değişim noktası burasıdır.
 *
 * Sekme adları (Ana Sayfa · Keşif · Bahçe · Sohbet) KANONİKTİR (Design §6,
 * kilitli) — onaya tabi değildir ve navigasyonda kalır; buradaki başlıklar
 * yalnız boş-durum ekran başlıklarıdır.
 */

export const shellCopy = {
  anaSayfa: {
    subtitle: 'Günün transitine özel bitki kartın ve o güne özel sözün burada belirecek.',
    skyCardLabel: 'bugünün göğü · mock',
    mockNote: 'Veri mock (Swiss Ephemeris · Faz 5). Gerçek hesap gelince aynı arayüzden akacak.',
  },
  bahce: {
    title: 'Bahçe',
    subtitle:
      'Enchanted garden — herbaryum koleksiyonun, modüllerin ve profilin burada bir araya gelecek.',
  },
  sohbet: {
    title: 'Sohbet',
    subtitle:
      'Kendi loglarından ve örüntülerinden öz-keşfe alan açan psikolojik-bilimsel sohbet burada olacak.',
  },
  kesif: {
    loading: 'İçerik yükleniyor…',
    errorTitle: 'İçerik henüz gelmedi',
    errorBody:
      "Supabase'e şema + seed SQL yüklendikten sonra buraya çekilir.\nAşağı çekerek yenile.",
    emptyTitle: 'Tablolar boş',
    emptyBody: "Seed SQL'i panelde çalıştır, sonra aşağı çekerek yenile.",
    retry: 'Yenile',
  },
  common: {
    soonBadge: 'yakında ✨',
  },
} as const;
