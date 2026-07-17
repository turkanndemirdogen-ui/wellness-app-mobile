import { Tabs } from 'expo-router';

import { BorderWidth, MinTouchTarget } from '@/constants/theme';
import { TabIcon, TabLabel } from '@/design-system/components';
import { useMotionScale } from '@/design-system/hooks';
import { textRoles, useTheme } from '@/design-system/theme';

/**
 * Level 0 kök sekmeler (Design §6, LOCKED: 4 sekme, beşinci yok).
 * Her sekme kendi stack durumunu korur (Design §9); Level 1-3 detay ekranları
 * bu grubun altına sekme-başına route olarak eklenecek (Design §8).
 *
 * Kabuk erişilebilirliği (roadmap DoD): her sekmenin açık erişilebilir adı,
 * seçili durumu ve ≥48pt dokunma hedefi var; aktif durum renk-tek-kanal değil
 * (ikon opaklığı + etiket ağırlığı — TabIcon/TabLabel). Güvenli alan yönetimi
 * navigasyon kütüphanesine bırakılır (sabit yükseklik YOK).
 */
export default function TabsLayout() {
  const { colors } = useTheme();
  const motionScale = useMotionScale();

  return (
    <Tabs
      screenOptions={{
        // Sekme geçişi cross-fade (§17 "ne değişti"; §19: reduced-motion'da
        // animasyonsuz kesme — uzamsal kaydırma zaten kullanılmıyor).
        animation: motionScale === 0 ? 'none' : 'fade',
        headerStyle: { backgroundColor: colors.navigation.background },
        // Ekran başlığı Display ailesinde (§12.1) — heading.m rolü token'dan.
        headerTitleStyle: { ...textRoles['heading.m'], color: colors.text.primary },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: colors.surface.canvas },
        tabBarStyle: {
          backgroundColor: colors.navigation.background,
          borderTopColor: colors.navigation.border,
          borderTopWidth: BorderWidth.thin,
        },
        tabBarItemStyle: { minHeight: MinTouchTarget },
        tabBarActiveTintColor: colors.navigation.active,
        tabBarInactiveTintColor: colors.navigation.inactive,
      }}>
      {/* Sekme sırası ARCHITECTURE_DECISIONS §3 (Navigasyon C, kilitli) —
          revize 2026-07-10: Keşif 2., Sohbet SON sekme. Adlar kanonik (Design
          §6) — yeni metin değil. */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarAccessibilityLabel: 'Ana Sayfa',
          tabBarButtonTestID: 'tab-ana-sayfa',
          tabBarIcon: ({ focused }) => <TabIcon name="moon" focused={focused} />,
          tabBarLabel: ({ focused, color }) => (
            <TabLabel label="Ana Sayfa" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="kesif"
        options={{
          title: 'Keşif',
          tabBarAccessibilityLabel: 'Keşif',
          tabBarButtonTestID: 'tab-kesif',
          tabBarIcon: ({ focused }) => <TabIcon name="crystalBall" focused={focused} />,
          tabBarLabel: ({ focused, color }) => (
            <TabLabel label="Keşif" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="bahce"
        options={{
          title: 'Bahçe',
          tabBarAccessibilityLabel: 'Bahçe',
          tabBarButtonTestID: 'tab-bahce',
          tabBarIcon: ({ focused }) => <TabIcon name="herb" focused={focused} />,
          tabBarLabel: ({ focused, color }) => (
            <TabLabel label="Bahçe" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="sohbet"
        options={{
          title: 'Sohbet',
          tabBarAccessibilityLabel: 'Sohbet',
          tabBarButtonTestID: 'tab-sohbet',
          tabBarIcon: ({ focused }) => <TabIcon name="chat" focused={focused} />,
          tabBarLabel: ({ focused, color }) => (
            <TabLabel label="Sohbet" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
