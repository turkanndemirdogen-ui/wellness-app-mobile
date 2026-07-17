import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppThemeProvider, useTheme } from '@/design-system/theme';
import { SessionProvider } from '@/lib/auth';

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
  return (
    <SessionProvider>
      <AppThemeProvider>
        <RootStack />
      </AppThemeProvider>
    </SessionProvider>
  );
}
