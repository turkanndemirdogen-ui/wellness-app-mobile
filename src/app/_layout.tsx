import { Caveat_500Medium } from '@expo-google-fonts/caveat';
import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import { Lora_400Regular, Lora_400Regular_Italic } from '@expo-google-fonts/lora';
import { PlayfairDisplay_500Medium } from '@expo-google-fonts/playfair-display';
import { useFonts } from 'expo-font';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AppThemeProvider, AtmosphereProvider, useTheme } from '@/design-system/theme';
import { SessionProvider } from '@/lib/auth';

// Font yüklenmeden UI görünmez (layout shift yok — 15 §5 / 03 §21.2).
SplashScreen.preventAutoHideAsync().catch(() => {});

/**
 * Kök navigasyon: Stack (Design §8 seviye modeli).
 * Level 0 = (tabs) grubu; onboarding gibi full-screen modal akışlar (Design
 * §10) ileride bu Stack'e KARDEŞ ekran olarak eklenir (Faz 3) — sekmelerin
 * ÜZERİNE overlay üstüne overlay bindirilmez.
 */
function RootStack() {
  const { colors } = useTheme();

  // Light-first (LOCKED): sistem dark modundan bağımsız, her zaman pudra tema.
  // Navigasyon kütüphanesinin teması semantic token'lardan türetilir.
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.action.primary,
      background: colors.surface.canvas,
      card: colors.navigation.background,
      text: colors.text.primary,
      border: colors.navigation.border,
    },
  };

  return (
    <ThemeProvider value={navTheme}>
      {/* Canvas her zaman açık → durum çubuğu simgeleri her zaman koyu. */}
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.surface.canvas },
        }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  // 15 §5 rol fontları — rol başına 1-2 kesim (splash bütçesi).
  const [fontsLoaded, fontError] = useFonts({
    Fraunces_600SemiBold,
    Lora_400Regular,
    Lora_400Regular_Italic,
    Caveat_500Medium,
    PlayfairDisplay_500Medium,
  });

  useEffect(() => {
    // Hata halinde de aç: sistem fontu fallback'iyle devam (UI kilitlenmez).
    if (fontsLoaded || fontError) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SessionProvider>
      <AppThemeProvider>
        {/* AtmosphereProvider kromu DEĞİŞTİRMEZ — yalnız panel/hero varyantı (15 §3). */}
        <AtmosphereProvider>
          <RootStack />
        </AtmosphereProvider>
      </AppThemeProvider>
    </SessionProvider>
  );
}
