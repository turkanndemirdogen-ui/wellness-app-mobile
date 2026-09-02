/* Jest ortamı — native modül mock'ları (cihaz dışı saf-fonksiyon testleri). */

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Reanimated 4'ün resmî mock'u react-native-worklets native modülünü çekiyor;
// worklet'siz elle mock: motion.ts Easing köprüsü + component katmanının
// kullandığı animasyon API'leri (createAnimatedComponent / Animated.View /
// shared value + timing/repeat). UI-thread davranışı test için JS'te düzleştirilir.
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, ScrollView } = require('react-native');
  const createAnimatedComponent = (Component) => Component;
  const AnimatedView = ({ children, ...props }) => React.createElement(View, props, children);
  const AnimatedScrollView = ({ children, ...props }) =>
    React.createElement(ScrollView, props, children);
  const passthrough = (value) => value;
  // Layout animasyon kurucuları (Reveal → FadeIn.duration(...)): zincirlenebilir
  // no-op; testte yalnız varlıkları önemli, ürettikleri değer render'a girmez.
  const layoutAnimation = () => {
    const chain = {};
    for (const method of ['duration', 'delay', 'springify', 'easing', 'withInitialValues', 'build']) {
      chain[method] = () => chain;
    }
    return chain;
  };
  return {
    __esModule: true,
    default: {
      createAnimatedComponent,
      View: AnimatedView,
      ScrollView: AnimatedScrollView,
    },
    View: AnimatedView,
    ScrollView: AnimatedScrollView,
    createAnimatedComponent,
    useSharedValue: (value) => ({ value }),
    useAnimatedScrollHandler: () => () => {},
    interpolate: (value) => (typeof value === 'number' ? value : 0),
    Extrapolation: { CLAMP: 'clamp', EXTEND: 'extend', IDENTITY: 'identity' },
    useAnimatedStyle: (fn) => (typeof fn === 'function' ? fn() : {}),
    useDerivedValue: (fn) => ({ value: typeof fn === 'function' ? fn() : undefined }),
    withTiming: passthrough,
    withRepeat: passthrough,
    withSpring: passthrough,
    withDelay: (_delay, value) => value,
    cancelAnimation: () => {},
    useReducedMotion: () => false,
    FadeIn: layoutAnimation(),
    FadeOut: layoutAnimation(),
    Easing: { bezier: () => () => 0, linear: () => 0, inOut: (f) => f, out: (f) => f, in: (f) => f },
  };
});

// react-native-safe-area-context: sağlayıcı testte mount edilmez → sabit inset.
jest.mock('react-native-safe-area-context', () => ({
  __esModule: true,
  useSafeAreaInsets: () => ({ top: 24, bottom: 0, left: 0, right: 0 }),
  SafeAreaProvider: ({ children }) => children,
}));

// react-native-svg native modüldür; paket resmî jest mock'u taşımıyor →
// prop'ları koruyan host-component mock'u (glyph snapshot/sözleşme testleri
// path/stroke prop'larını render ağacından okur).
jest.mock('react-native-svg', () => {
  const React = require('react');
  const mk = (name) => {
    const C = ({ children, ...props }) => React.createElement(name, props, children);
    C.displayName = name;
    return C;
  };
  const Svg = mk('Svg');
  return {
    __esModule: true,
    default: Svg,
    Svg,
    Path: mk('Path'),
    Circle: mk('Circle'),
    Line: mk('Line'),
    G: mk('G'),
    Rect: mk('Rect'),
    Ellipse: mk('Ellipse'),
  };
});
