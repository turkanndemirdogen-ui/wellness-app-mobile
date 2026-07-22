/**
 * Glyph renk token'ları — 02 §6-7 kanonik HEX'lerin birebir doğrulaması
 * (üretici alias çözmediği için profile.sun/moon kopyaları planet.* ile eş
 * kalmak ZORUNDA; bu test kopya sapmasını yakalar).
 */

import { primitive } from '@/design-system/tokens/primitive.generated';

describe('planet.* token seti (02 §6)', () => {
  it('10 gezegen kanonik HEX ile eş', () => {
    expect(primitive.color.planet).toEqual({
      sun: '#D5A13C',
      moon: '#93A9B8',
      mercury: '#6F777D',
      venus: '#B7747E',
      mars: '#A64F3D',
      jupiter: '#4D6F9D',
      saturn: '#6C6256',
      uranus: '#5B9EB5',
      neptune: '#3F6E9D',
      pluto: '#60435E',
    });
  });
});

describe('zodiac.* token seti (02 §7)', () => {
  it('default/element/profile kanonik HEX ile eş', () => {
    expect(primitive.color.zodiac).toEqual({
      default: { light: '#5F665E', dark: '#D9DED6' },
      element: { fire: '#B86A42', earth: '#738158', air: '#6D8DA7', water: '#4F7486' },
      profile: { sun: '#D5A13C', moon: '#93A9B8', rising: '#A86643' },
    });
  });

  it('profile.sun/moon alias kopyaları planet.* ile sapmasız', () => {
    expect(primitive.color.zodiac.profile.sun).toBe(primitive.color.planet.sun);
    expect(primitive.color.zodiac.profile.moon).toBe(primitive.color.planet.moon);
  });
});
