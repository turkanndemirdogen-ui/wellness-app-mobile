/**
 * Auth iskeleti (base faz) — oturum durumu + token oto-yenileme.
 *
 * KAPSAM: yalnız oturum ALTYAPISI. Giriş/kayıt EKRANI YOK (Faz 6). Uygulama
 * anon anahtarla çalışır; per-user özellikler (loglar, natal) ileride oturum
 * gerektirir — bu katman o zemini hazırlar.
 *
 * NOT: service_role ASLA istemcide değil (supabase.ts anon ile kurulu). Burada
 * yalnız kullanıcının kendi oturumu (auth.uid) yönetilir; RLS koruması DB'de.
 */

import {
  createContext, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from './supabase';

type SessionState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

const SessionContext = createContext<SessionState>({
  session: null,
  user: null,
  loading: true,
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  // Supabase yoksa yüklenecek oturum da yok → baştan loading=false (senkron
  // setState'ten kaçınmak için lazy initializer).
  const [loading, setLoading] = useState<boolean>(() => supabase != null);

  useEffect(() => {
    // Supabase yapılandırılmamışsa (anahtar yok) sessizce boş oturumla devam et.
    if (!supabase) return;
    const client = supabase;

    // Mevcut oturumu yükle.
    client.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    // Oturum değişikliklerini dinle (giriş/çıkış/token yenileme).
    const { data: authSub } = client.auth.onAuthStateChange((_event, next) => {
      setSession(next ?? null);
    });

    // Supabase RN önerisi: uygulama önplandayken token oto-yenilemeyi çalıştır,
    // arkaplana geçince durdur (pil/kaynak dostu).
    const appSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') client.auth.startAutoRefresh();
      else client.auth.stopAutoRefresh();
    });
    if (AppState.currentState === 'active') client.auth.startAutoRefresh();

    return () => {
      authSub.subscription.unsubscribe();
      appSub.remove();
      client.auth.stopAutoRefresh();
    };
  }, []);

  const value = useMemo<SessionState>(
    () => ({ session, user: session?.user ?? null, loading }),
    [session, loading],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

/** Oturum durumunu okur. SessionProvider ağacının içinde kullanılır. */
export function useSession(): SessionState {
  return useContext(SessionContext);
}

// --- İnce yardımcılar (UI Faz 6'da bağlanır) ---

/** Anonim oturum (Supabase panelinde 'Anonymous sign-ins' açıksa çalışır). */
export async function signInAnonymously(): Promise<{ error: Error | null }> {
  if (!supabase) return { error: new Error('supabase-not-configured') };
  const { error } = await supabase.auth.signInAnonymously();
  return { error: error ?? null };
}

export async function signOut(): Promise<{ error: Error | null }> {
  if (!supabase) return { error: new Error('supabase-not-configured') };
  const { error } = await supabase.auth.signOut();
  return { error: error ?? null };
}
