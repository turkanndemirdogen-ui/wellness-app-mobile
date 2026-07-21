/* Jest ortamı — native modül mock'ları (cihaz dışı saf-fonksiyon testleri). */

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

// Reanimated 4'ün resmî mock'u react-native-worklets native modülünü çekiyor;
// testler yalnız motion.ts'in Easing köprüsüne dokunur → minimal stub yeterli.
jest.mock('react-native-reanimated', () => ({
  Easing: { bezier: () => () => 0 },
}));
