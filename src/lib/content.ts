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
    .select('herb_id,name_tr,gezegen_birincil,guven_tier,data')
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
