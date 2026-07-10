import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase istemcisi (base faz).
 *
 * Anahtarlar `.env` dosyasından `EXPO_PUBLIC_` önekiyle okunur (Türkan doldurur).
 * Anahtarlar henüz yoksa istemci `null` olur ve uygulama yine de ayakta kalır —
 * shell'i test etmek için Supabase bağlantısı şart değildir.
 *
 * NOT (KVKK): burada yalnız `anon` (public) anahtar kullanılır. `service_role`
 * anahtarı ASLA istemciye konmaz — o yalnız sunucu/pipeline tarafında yaşar.
 */
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        // Mobilde URL tabanlı oturum algılama yok (yalnız web OAuth için gerekir).
        detectSessionInUrl: false,
      },
    })
  : null;

if (!isSupabaseConfigured && __DEV__) {
  console.warn(
    '[supabase] EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY ' +
      'tanımlı değil. .env dosyasını doldurana kadar Supabase istemcisi devre dışı.',
  );
}
