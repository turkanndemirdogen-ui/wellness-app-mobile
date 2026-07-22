/* Jest ortamı — native modül mock'ları (cihaz dışı saf-fonksiyon testleri). */

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Reanimated 4'ün resmî mock'u react-native-worklets native modülünü çekiyor;
// testler yalnız motion.ts'in Easing köprüsüne dokunur → minimal stub yeterli.
jest.mock('react-native-reanimated', () => ({
  Easing: { bezier: () => () => 0 },
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
