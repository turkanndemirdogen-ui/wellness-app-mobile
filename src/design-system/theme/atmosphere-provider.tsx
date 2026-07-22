/**
 * AtmosphereProvider — saat-duyarlı PANEL atmosferi (15 §3).
 *
 * KİLİT: ana chrome'u ASLA darklaştırmaz — screen background/nav/form/uzun
 * okuma yüzeyleri her saatte açık krem-pudra kalır (AppThemeProvider'ın
 * canvas pastel tonlaması bu kilidin içindedir ve değişmez). Bu provider
 * yalnız görsel panellerin (hero, astrology chart, garden vignette, ritual
 * cover) atmosfer varyantını üretir: gündüz panel açık kalabilir, akşam/gece
 * panel kendi koyu dünyasına geçer (visualPanels token'ları; scrim zorunlu).
 *
 * Kullanıcı tercihleri (AsyncStorage `settings.atmosphere.v1`):
 * - fixedLight: true → paneller de daima gündüz halinde (koyulaşma tamamen kapalı)
 * Reduced Motion sinyali da buradan okunur: açıkken TÜM ambient hareketler
 * durur (15 §9) — resolveAmbientMotion tek karar noktasıdır.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext, useContext, useEffect, useMemo, useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';

import { useReducedMotion } from '../hooks/use-reduced-motion';
import { primitive } from '../tokens/primitive.generated';

const PREFS_KEY = 'settings.atmosphere.v1';

/** Panel atmosfer evresi — yalnız panel dünyasını etkiler, kromu değil. */
export type AtmospherePhase = 'day' | 'dusk' | 'night';

export type PanelKind = keyof typeof primitive.color.visualPanels;

export function getAtmospherePhase(date: Date): AtmospherePhase {
  const h = date.getHours();
  if (h >= 6 && h < 17) return 'day';
  if (h >= 17 && h < 22) return 'dusk';
  return 'night';
}

/**
 * Panel zemin rengi çözümü: gündüz (veya fixedLight) panel açık chrome yüzeyde
 * kalır; dusk/night'ta panel kendi koyu token'ına geçer. Dönen koyu değerler
 * YALNIZ VisualPanel içinde kullanılabilir.
 */
export function resolvePanelBackground(
  kind: PanelKind,
  phase: AtmospherePhase,
  fixedLight: boolean,
): string {
  if (fixedLight || phase === 'day') return primitive.color.chrome.surfaceTint;
  if (phase === 'dusk' && kind === 'night') return primitive.color.visualPanels.dusk;
  return primitive.color.visualPanels[kind];
}

/**
 * 15 §9: Reduced Motion açıkken ambient animasyon TAMAMEN durur; içerik ve
 * işlev kaybolmaz (statik hal). Tek karar noktası — ambient kuran her bileşen
 * bunu tüketir.
 */
export function resolveAmbientMotion(reducedMotion: boolean): {
  ambientEnabled: boolean;
  maxScale: number;
  pressScale: number;
} {
  return {
    ambientEnabled: !reducedMotion,
    maxScale: reducedMotion ? 1 : primitive.motionLimits.maxScale,
    pressScale: reducedMotion ? 1 : primitive.motionLimits.pressScale,
  };
}

type AtmosphereValue = {
  phase: AtmospherePhase;
  /** true → paneller de daima aydınlık (kullanıcı tercihi). */
  fixedLight: boolean;
  setFixedLight: (value: boolean) => void;
  reducedMotion: boolean;
  ambient: ReturnType<typeof resolveAmbientMotion>;
  panelBackground: (kind: PanelKind) => string;
};

const AtmosphereContext = createContext<AtmosphereValue>({
  phase: 'day',
  fixedLight: false,
  setFixedLight: () => {},
  reducedMotion: false,
  ambient: resolveAmbientMotion(false),
  panelBackground: (kind) => resolvePanelBackground(kind, 'day', false),
});

export function AtmosphereProvider({
  children,
  forcePhase,
}: {
  children: ReactNode;
  /** Yalnız geliştirme/görsel test: panel evresini sabitler. */
  forcePhase?: AtmospherePhase;
}) {
  const reducedMotion = useReducedMotion();
  const [clockPhase, setClockPhase] = useState<AtmospherePhase>(() =>
    getAtmospherePhase(new Date()),
  );
  const [fixedLight, setFixedLightState] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(PREFS_KEY)
      .then((raw) => {
        if (!alive || !raw) return;
        const prefs = JSON.parse(raw) as { fixedLight?: boolean };
        if (typeof prefs.fixedLight === 'boolean') setFixedLightState(prefs.fixedLight);
      })
      .catch(() => {}); // tercih okunamazsa varsayılan kalır
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') setClockPhase(getAtmospherePhase(new Date()));
    });
    return () => {
      alive = false;
      sub.remove();
    };
  }, []);

  const setFixedLight = (value: boolean) => {
    setFixedLightState(value);
    AsyncStorage.setItem(PREFS_KEY, JSON.stringify({ fixedLight: value })).catch(() => {});
  };

  const phase = forcePhase ?? clockPhase;

  const value = useMemo<AtmosphereValue>(
    () => ({
      phase,
      fixedLight,
      setFixedLight,
      reducedMotion,
      ambient: resolveAmbientMotion(reducedMotion),
      panelBackground: (kind) => resolvePanelBackground(kind, phase, fixedLight),
    }),
    [phase, fixedLight, reducedMotion],
  );

  return <AtmosphereContext.Provider value={value}>{children}</AtmosphereContext.Provider>;
}

export function useAtmosphere(): AtmosphereValue {
  return useContext(AtmosphereContext);
}
