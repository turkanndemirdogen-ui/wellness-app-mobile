import { supabase } from './supabase';

/**
 * İçerik okuma katmanı (Keşif ekranı). Supabase'den herkese açık içerik
 * tablolarını (herbs, quizzes) anon key ile okur. RLS gereği yalnız
 * public içerik gelir; agent_only kaynaklar bu yollardan zaten erişilemez.
 */

export type Herb = {
  herb_id: string;
  name_tr: string | null;
  gezegen_birincil: string | null;
  /** Günün kartı havuzu filtresi (ana-sayfa-spec B3: havuz daima app_safe). */
  app_safe: boolean | null;
  guven_tier: string | null;
  data: {
    tek_satir?: string | null;
    guvenlik?: { uyari_chip?: string | null } | null;
    beden_bolgeleri?: string[] | null;
    [k: string]: unknown;
  };
};

export type Quiz = {
  quiz_id: string;
  ay: number | null;
  title: string | null;
  data: {
    acilis_metni?: string | null;
    arketipler?: Record<string, unknown> | null;
    sorular?: unknown[] | null;
    [k: string]: unknown;
  };
};

class NotConfiguredError extends Error {
  constructor() {
    super('supabase-not-configured');
    this.name = 'NotConfiguredError';
  }
}

export async function fetchHerbs(): Promise<Herb[]> {
  if (!supabase) throw new NotConfiguredError();
  const { data, error } = await supabase
    .from('herbs')
    .select('herb_id,name_tr,gezegen_birincil,app_safe,guven_tier,data')
    .order('name_tr', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Herb[];
}

export async function fetchQuizzes(): Promise<Quiz[]> {
  if (!supabase) throw new NotConfiguredError();
  const { data, error } = await supabase
    .from('quizzes')
    .select('quiz_id,ay,title,data')
    .order('ay', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Quiz[];
}

/**
 * Günün sözü havuzu (ana-sayfa-spec B5 veri kontratı: [id, text_tr,
 * theme_tags[], kaynak_tipi] — kaynak_tipi yalnız iç denetim, İSTENMEZ).
 *
 * NOT: `quotes` tablosu henüz canlı DB'de yok (launch-blocker #3, söz havuzu
 * content/soz-havuzu.json'da bekliyor). Tablo gelene dek bu çağrı hata döner;
 * çağıran yüzey bloğu sessizce gizler (spec: havuz boşsa blok gizlenir).
 */
export type Quote = {
  soz_id: string;
  text_tr: string | null;
};

export async function fetchQuotes(): Promise<Quote[]> {
  if (!supabase) throw new NotConfiguredError();
  const { data, error } = await supabase
    .from('quotes')
    .select('soz_id,text_tr')
    .order('soz_id', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Quote[];
}

/** Gezegen anahtarı → sembol (ekranda bitki rafını gösterir). */
export const PLANET_GLYPH: Record<string, string> = {
  ay: '🌙',
  gunes: '☀️',
  merkur: '☿',
  venus: '♀',
  mars: '♂',
  jupiter: '♃',
  saturn: '♄',
};
