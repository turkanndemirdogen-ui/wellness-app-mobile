/**
 * Tema sağlayıcı — light-first adaptive ambient (Design §11.5, LOCKED: dark yok).
 *
 * timeOfDay runtime token'ı (§45) burada üretilir: cihaz saatine göre
 * morning/day/evening/night. Dilimler GEÇİCİ (master saat aralığı vermiyor):
 * 05-11 morning · 11-17 day · 17-22 evening · 22-05 night.
 *
 * Ambient YALNIZ surface.canvas'ı tonlar (semantic.ts). Değer, uygulama
 * önplana döndüğünde tazelenir — sürekli zamanlayıcı yok (pil dostu).
 */

import {
  createContext, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';

import { buildSemanticColors, type SemanticColors, type TimeOfDay } from './semantic';
import { primitive } from '../tokens/primitive.generated';

export function getTimeOfDay(date: Date): TimeOfDay {
  const h = date.getHours();
  if (h >= 5 && h < 11) return 'morning';
  if (h >= 11 && h < 17) return 'day';
  if (h >= 17 && h < 22) return 'evening';
  return 'night';
}

type ThemeValue = {
  colors: SemanticColors;
  timeOfDay: TimeOfDay;
  opacity: typeof primitive.opacity;
};

const ThemeContext = createContext<ThemeValue>({
  colors: buildSemanticColors('day'),
  timeOfDay: 'day',
  opacity: primitive.opacity,
});

export function AppThemeProvider({
  children,
  forceTimeOfDay,
}: {
  children: ReactNode;
  /** Yalnız geliştirme/görsel test için: ambient dilimini sabitler. */
  forceTimeOfDay?: TimeOfDay;
}) {
  const [clockTimeOfDay, setClockTimeOfDay] = useState<TimeOfDay>(() =>
    getTimeOfDay(new Date()),
  );

  useEffect(() => {
    // Önplana dönüşte dilimi tazele; arka planda sayaç tutma.
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') setClockTimeOfDay(getTimeOfDay(new Date()));
    });
    return () => sub.remove();
  }, []);

  const timeOfDay = forceTimeOfDay ?? clockTimeOfDay;

  const value = useMemo<ThemeValue>(
    () => ({
      colors: buildSemanticColors(timeOfDay),
      timeOfDay,
      opacity: primitive.opacity,
    }),
    [timeOfDay],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Semantic tema değerlerini okur. AppThemeProvider ağacı içinde kullanılır. */
export function useTheme(): ThemeValue {
  return useContext(ThemeContext);
}
