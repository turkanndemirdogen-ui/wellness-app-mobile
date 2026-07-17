/**
 * query — asenkron veri yaşam döngüsü (Design §33: idle/fetching/success/
 * error/retry) + hata sınıflandırması + önbellek düşüşü (§38).
 *
 * Akış: canlı fetch → başarı: önbelleğe yaz. Hata: sınıflandır; önbellekte
 * veri varsa BAYAT (stale=true) olarak sun — kullanıcı verisiz kalmaz; yoksa
 * hata durumu. Yeniden deneme `refresh()`.
 *
 * SINIFLANDIRMA DÜRÜSTLÜĞÜ: 'network' türü, fetch'in ağ katmanında düştüğünü
 * söyler — cihazın çevrimdışı OLDUĞUNU kanıtlamaz (güvenilir bağlantı tespiti
 * NetInfo gerektirir; bağımlılık onay listesinde). OfflineState bu yüzden
 * buradan OTOMATİK tetiklenmez.
 *
 * İzole ve test edilebilir: classifyError saf fonksiyon; hook yalnız fetcher
 * prop'una bağlıdır (fetcher REFERANS-SABİT olmalı — useCallback ile geçir).
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import { readCache, writeCache } from './cache';

export type ErrorKind = 'not-configured' | 'network' | 'server' | 'unknown';

export type ClassifiedError = {
  kind: ErrorKind;
  /** Ham mesaj — KULLANICIYA GÖSTERİLMEZ (§37); yalnız dev-detail/telemetri. */
  message: string;
};

const NETWORK_SIGNS = [
  'network request failed',
  'failed to fetch',
  'fetch failed',
  'network error',
  'timeout',
  'abort',
];

export function classifyError(e: unknown): ClassifiedError {
  const message = e instanceof Error ? e.message : String(e);
  const name = e instanceof Error ? e.name : '';

  if (name === 'NotConfiguredError' || message === 'supabase-not-configured') {
    return { kind: 'not-configured', message };
  }
  const lower = message.toLowerCase();
  if (NETWORK_SIGNS.some((sign) => lower.includes(sign))) {
    return { kind: 'network', message };
  }
  // Supabase/PostgREST hataları kod alanı taşır → sunucu tarafı.
  if (typeof e === 'object' && e !== null && 'code' in e) {
    return { kind: 'server', message };
  }
  return { kind: 'unknown', message };
}

export type AsyncPhase = 'idle' | 'fetching' | 'success' | 'error';

export type AsyncResource<T> = {
  phase: AsyncPhase;
  data: T | null;
  error: ClassifiedError | null;
  /** true → data önbellekten; son canlı deneme başarısız (bayat sunum, §38). */
  stale: boolean;
  /** Yeniden dene — bekleyen görsel durumu çağıran yönetir (buton/refresh). */
  refresh: () => Promise<void>;
};

type Snapshot<T> = Pick<AsyncResource<T>, 'phase' | 'data' | 'error' | 'stale'>;

export function useAsyncResource<T>(options: {
  fetcher: () => Promise<T>;
  /** Verilirse başarı önbelleğe yazılır; hata önbellekten düşer. */
  cacheKey?: string;
  enabled?: boolean;
}): AsyncResource<T> {
  const { fetcher, cacheKey, enabled = true } = options;

  const [snap, setSnap] = useState<Snapshot<T>>(() => ({
    phase: enabled ? 'fetching' : 'idle',
    data: null,
    error: null,
    stale: false,
  }));

  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const run = useCallback(async () => {
    // Not: burada senkron setState YOK (ilk durum lazy initializer'dan gelir);
    // devam eden görsel bekleme göstergesini çağıran yüzey yönetir.
    try {
      const data = await fetcher();
      if (cacheKey) void writeCache(cacheKey, data);
      if (alive.current) setSnap({ phase: 'success', data, error: null, stale: false });
    } catch (e) {
      const error = classifyError(e);
      const cached = cacheKey ? await readCache<T>(cacheKey) : null;
      if (!alive.current) return;
      if (cached) {
        // Önbellek düşüşü: veri görünür kalır, bayatlık işaretlenir (§38).
        setSnap({ phase: 'success', data: cached.data, error, stale: true });
      } else {
        setSnap((prev) => ({
          phase: 'error',
          data: prev.data,
          error,
          stale: prev.data != null,
        }));
      }
    }
  }, [fetcher, cacheKey]);

  useEffect(() => {
    // Async sarmalayıcı → efektin SENKRON yolunda setState yok
    // (react-hooks/set-state-in-effect); tüm setSnap'ler await sonrası.
    if (enabled) void (async () => { await run(); })();
  }, [enabled, run]);

  const refresh = useCallback(() => run(), [run]);

  return { ...snap, refresh };
}
