import { DarkTheme, DefaultTheme, ThemeProvider, Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { SessionProvider } from '@/lib/auth';

function TabIcon({ glyph, focused }: { glyph: string; focused: boolean }) {
  return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.55 }}>{glyph}</Text>;
}

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  return (
    <SessionProvider>
      <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text },
          headerShadowVisible: false,
          sceneStyle: { backgroundColor: colors.background },
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.backgroundElement,
          },
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.textSecondary,
        }}>
        {/* Sekme sırası ARCHITECTURE_DECISIONS §3 (Navigasyon C, kilitli) —
            revize 2026-07-10: Keşif 2., Sohbet SON sekme. */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Ana Sayfa',
            tabBarIcon: ({ focused }) => <TabIcon glyph="🌙" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="kesif"
          options={{
            title: 'Keşif',
            tabBarIcon: ({ focused }) => <TabIcon glyph="🔮" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="bahce"
          options={{
            title: 'Bahçe',
            tabBarIcon: ({ focused }) => <TabIcon glyph="🌿" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="sohbet"
          options={{
            title: 'Sohbet',
            tabBarIcon: ({ focused }) => <TabIcon glyph="💬" focused={focused} />,
          }}
        />
      </Tabs>
      </ThemeProvider>
    </SessionProvider>
  );
}
