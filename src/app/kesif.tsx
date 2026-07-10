import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';

import {
  fetchHerbs,
  fetchQuizzes,
  PLANET_GLYPH,
  type Herb,
  type Quiz,
} from '@/lib/content';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Colors, Spacing } from '@/constants/theme';

type LoadState =
  | { phase: 'loading' }
  | { phase: 'error'; message: string }
  | { phase: 'ready'; herbs: Herb[]; quizzes: Quiz[] };

export default function KesifScreen() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  // Yapılandırma yoksa (anahtar yok) hata durumu başlangıç state'inde verilir —
  // efekt içinde senkron setState'ten kaçınmak için lazy initializer.
  const [state, setState] = useState<LoadState>(() =>
    isSupabaseConfigured
      ? { phase: 'loading' }
      : { phase: 'error', message: '.env dosyasında Supabase anahtarları yok.' },
  );
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    // Tüm setState'ler await'ten SONRA → efekt içinde senkron setState yok.
    // (Yapılandırma yoksa load hiç çağrılmaz: aşağıdaki guard + hata ekranında
    //  RefreshControl bulunmaz.)
    try {
      const [herbs, quizzes] = await Promise.all([fetchHerbs(), fetchQuizzes()]);
      setState({ phase: 'ready', herbs, quizzes });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'bilinmeyen hata';
      setState({ phase: 'error', message });
    }
  }, []);

  useEffect(() => {
    // load()'ı async sarmalayıcıda çağır → efektin SENKRON yolunda setState yok
    // (react-hooks/set-state-in-effect). setState'ler load içinde, await sonrası.
    if (isSupabaseConfigured) void (async () => { await load(); })();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  if (state.phase === 'loading') {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <ActivityIndicator color={c.text} />
        <Text style={[styles.muted, { color: c.textSecondary }]}>İçerik yükleniyor…</Text>
      </View>
    );
  }

  if (state.phase === 'error') {
    return (
      <View style={[styles.center, { backgroundColor: c.background }]}>
        <Text style={styles.emoji}>🌱</Text>
        <Text style={[styles.h2, { color: c.text }]}>İçerik henüz gelmedi</Text>
        <Text style={[styles.muted, { color: c.textSecondary }]}>
          Supabase&apos;e şema + seed SQL yüklendikten sonra buraya çekilir.{'\n'}
          Aşağı çekerek yenile.
        </Text>
        <Text style={[styles.errCode, { color: c.textSecondary, backgroundColor: c.backgroundElement }]}>
          {state.message}
        </Text>
      </View>
    );
  }

  const { herbs, quizzes } = state;
  const empty = herbs.length === 0 && quizzes.length === 0;

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.text} />
      }>
      {empty ? (
        <View style={styles.center}>
          <Text style={styles.emoji}>🌱</Text>
          <Text style={[styles.h2, { color: c.text }]}>Tablolar boş</Text>
          <Text style={[styles.muted, { color: c.textSecondary }]}>
            Seed SQL&apos;i panelde çalıştır, sonra aşağı çekerek yenile.
          </Text>
        </View>
      ) : (
        <>
          {/* Bitki kartları */}
          <SectionHeader title="Bitki Kartları" count={herbs.length} color={c} />
          <View style={styles.list}>
            {herbs.map((h) => (
              <View
                key={h.herb_id}
                style={[styles.card, { backgroundColor: c.backgroundElement }]}>
                <View style={styles.cardHead}>
                  <Text style={styles.glyph}>
                    {PLANET_GLYPH[h.gezegen_birincil ?? ''] ?? '🌿'}
                  </Text>
                  <Text style={[styles.cardTitle, { color: c.text }]}>{h.name_tr}</Text>
                  {h.guven_tier ? (
                    <Text style={[styles.warnChip, { color: c.text, borderColor: c.text }]}>
                      ⚠ dikkat
                    </Text>
                  ) : null}
                </View>
                {h.data?.tek_satir ? (
                  <Text style={[styles.cardBody, { color: c.textSecondary }]}>
                    {h.data.tek_satir}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>

          {/* Ay quizleri */}
          <SectionHeader title="Ay Quizleri" count={quizzes.length} color={c} />
          <View style={styles.list}>
            {quizzes.map((q) => {
              const arketipSayisi = q.data?.arketipler
                ? Object.keys(q.data.arketipler).length
                : null;
              const soruSayisi = Array.isArray(q.data?.sorular) ? q.data.sorular!.length : null;
              return (
                <View
                  key={q.quiz_id}
                  style={[styles.card, { backgroundColor: c.backgroundElement }]}>
                  <View style={styles.cardHead}>
                    <Text style={[styles.ayBadge, { color: c.textSecondary, backgroundColor: c.background }]}>
                      Ay {q.ay}
                    </Text>
                    <Text style={[styles.cardTitle, { color: c.text }]}>{q.title}</Text>
                  </View>
                  <Text style={[styles.cardBody, { color: c.textSecondary }]}>
                    {[
                      arketipSayisi ? `${arketipSayisi} arketip` : null,
                      soruSayisi ? `${soruSayisi} soru` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </Text>
                </View>
              );
            })}
          </View>

          <Text style={[styles.footer, { color: c.textSecondary }]}>
            İçerik Supabase&apos;den anon anahtarla çekildi · yalnız herkese açık içerik
          </Text>
        </>
      )}
    </ScrollView>
  );
}

function SectionHeader({
  title,
  count,
  color,
}: {
  title: string;
  count: number;
  color: { text: string; textSecondary: string; backgroundElement: string };
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.h2, { color: color.text }]}>{title}</Text>
      <Text style={[styles.countPill, { color: color.textSecondary, backgroundColor: color.backgroundElement }]}>
        {count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: Spacing.three, gap: Spacing.two, paddingBottom: Spacing.six },
  center: {
    flex: 1,
    minHeight: 400,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.two,
  },
  emoji: { fontSize: 44 },
  h2: { fontSize: 20, fontWeight: '600' },
  muted: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  errCode: {
    marginTop: Spacing.two,
    fontSize: 12,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: 8,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
  },
  countPill: {
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
  },
  list: { gap: Spacing.two },
  card: { borderRadius: 16, padding: Spacing.three, gap: Spacing.one },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  glyph: { fontSize: 20 },
  cardTitle: { fontSize: 16, fontWeight: '600', flexShrink: 1 },
  cardBody: { fontSize: 14, lineHeight: 20 },
  warnChip: {
    fontSize: 11,
    fontWeight: '600',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 'auto',
    overflow: 'hidden',
  },
  ayBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  footer: { fontSize: 12, textAlign: 'center', marginTop: Spacing.three, lineHeight: 18 },
});
