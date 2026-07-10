/**
 * Astro veri tipleri — base'in DB sözleşmesiyle BİREBİR hizalı.
 *
 * Kaynak: rag-base-spec / ARCHITECTURE_DECISIONS + Supabase şeması:
 *   - natal_charts: sun_sign, moon_sign, asc_sign, dominant_element, chart(jsonb)
 *   - engine_rules tetik anahtarı → EngineEvent (match_engine_rules ile aynı)
 *   - astro_context_daily.context: moon phase/sign, active transits, themes
 *
 * Burada YALNIZ şekiller var; gerçek hesap sağlayıcıda. Swiss Ephemeris (K4-3=b,
 * ertelendi) ileride aynı tipleri doldurur — bu katman sağlayıcıdan bağımsızdır.
 */

// 12 burç — engine_rules.sign_modifier ile aynı TR anahtarlar (k1a_ay_koc vb.)
export type ZodiacSign =
  | 'koc' | 'boga' | 'ikizler' | 'yengec' | 'aslan' | 'basak'
  | 'terazi' | 'akrep' | 'yay' | 'oglak' | 'kova' | 'balik';

// Transit/natal gezegenleri — engine_config.natal_targets_v1 + transit gezegenleri
export type Planet = 'gunes' | 'ay' | 'merkur' | 'venus' | 'mars' | 'jupiter' | 'saturn';

// Açı kalitesi — engine_config.quality_map (kavuşum transit gezegene göre)
export type AspectQuality = 'sert' | 'yumusak';

// Baskın element — natal_charts.dominant_element
export type Element = 'ates' | 'toprak' | 'hava' | 'su';

/** Doğum girdisi — birth_data'ya karşılık. Saat-esnek (KZ-1=b): bilinmezse null. */
export interface BirthInput {
  date: string;                 // 'YYYY-MM-DD'
  time?: string | null;         // 'HH:mm' — bilinmiyorsa null → güneş-bazlı natal
  timeKnown: boolean;
  place?: { lat: number; lon: number; tz: string } | null;
}

/** Natal harita — natal_charts satırına karşılık (sık alanlar + ham chart). */
export interface NatalChart {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign | null;   // veri/saat yoksa null
  ascSign: ZodiacSign | null;    // doğum saati yoksa null (yükselen hesaplanamaz)
  dominantElement: Element;
  timeKnown: boolean;
  raw: Record<string, unknown>;  // tam chart (natal_charts.chart jsonb)
}

/**
 * Motor tetik olayı — base'deki `match_engine_rules(p_events)` ile BİREBİR.
 * Bu diziyi doğrudan RPC'ye geçirip eşleşen engine_rules'ı çekebilirsin.
 */
export interface EngineEvent {
  transit_planet: Planet;
  aspect_quality: AspectQuality | null;   // katman-1a (Ay'ın burcu) → null
  natal_target: string | null;            // 'gunes'|'ay'|'asc'|'merkur'|'venus' | null
  sign_modifier: ZodiacSign | null;
  house_modifier: string | null;
}

/** Günlük gökyüzü bağlamı — astro_context_daily.context'e karşılık. */
export interface DailyTransit {
  date: string;                 // 'YYYY-MM-DD'
  moonSign: ZodiacSign;
  moonPhase: 'yeni' | 'ilk_dordun' | 'dolunay' | 'son_dordun';
  events: EngineEvent[];        // güncel transit olayları (motora beslenir)
  themes: string[];             // vurgulanan iç temalar
}
