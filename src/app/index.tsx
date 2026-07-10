import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, useColorScheme } from 'react-native';

import { astro, type DailyTransit } from '@/lib/astro';
import { Colors, Spacing, Typography } from '@/constants/theme';

// Görüntüleme etiketleri (iç TR anahtar → başlık). UI Faz 6; burada minimal.
const SIGN_TR: Record<string, string> = {
  koc: 'Koç', boga: 'Boğa', ikizler: 'İkizler', yengec: 'Yengeç',
  aslan: 'Aslan', basak: 'Başak', terazi: 'Terazi', akrep: 'Akrep',
  yay: 'Yay', oglak: 'Oğlak', kova: 'Kova', balik: 'Balık',
};
const PHASE_TR: Record<DailyTransit['moonPhase'], string> = {
  yeni: 'Yeni Ay', ilk_dordun: 'İlk Dördün', dolunay: 'Dolunay', son_dordun: 'Son Dördün',
};

export default function AnaSayfaScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const [transit, setTransit] = useState<DailyTransit | null>(null);

  useEffect(() => {
    let alive = true;
    // Astro katmanını uçtan uca çağır: natal → günün transiti (şimdilik MOCK).
    (async () => {
      const natal = await astro.getNatalChart({ date: '2000-01-01', timeKnown: false });
      const today = new Date().toISOString().slice(0, 10);
      const t = await astro.getDailyTransit(natal, today);
      if (alive) setTransit(t);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Text style={styles.emoji}>🌙</Text>
      <Text style={[styles.title, Typography.heading, { color: c.text }]}>Ana Sayfa</Text>
      <Text style={[styles.subtitle, { color: c.textSecondary }]}>
        Günün transitine özel bitki kartın ve o güne özel sözün burada belirecek.
      </Text>

      {/* Astro wiring kanıtı — mock veri, gerçek arayüzden akıyor. */}
      <View style={[styles.card, { backgroundColor: c.backgroundElement }]}>
        <Text style={[styles.cardLabel, { color: c.textSecondary }]}>bugünün göğü · mock</Text>
        {transit ? (
          <>
            <Text style={[styles.cardMain, { color: c.text }]}>
              🌙 Ay {SIGN_TR[transit.moonSign] ?? transit.moonSign} · {PHASE_TR[transit.moonPhase]}
            </Text>
            <Text style={[styles.cardSub, { color: c.textSecondary }]}>
              {transit.events.length} transit olayı → motora ({'match_engine_rules'}) hazır
            </Text>
          </>
        ) : (
          <ActivityIndicator color={c.accent} />
        )}
      </View>

      <Text style={[styles.note, { color: c.textSecondary }]}>
        Veri mock (Swiss Ephemeris · Faz 5). Gerçek hesap gelince aynı arayüzden akacak.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  emoji: { fontSize: 56 },
  title: { fontSize: 24, fontWeight: '600', textAlign: 'center' },
  subtitle: { fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 320 },
  card: {
    marginTop: Spacing.two,
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.one,
    alignItems: 'center',
  },
  cardLabel: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  cardMain: { fontSize: 17, fontWeight: '600', textAlign: 'center' },
  cardSub: { fontSize: 13, textAlign: 'center' },
  note: { fontSize: 12, lineHeight: 18, textAlign: 'center', maxWidth: 320 },
});
