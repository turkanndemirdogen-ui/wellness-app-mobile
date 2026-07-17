// OTOMATİK ÜRETİLDİ — ELLE DÜZENLEME.
// Kaynak: src/design-system/tokens/tokens.json · Üretim: `npm run tokens`
// Bu dosya bilinçli olarak commit edilir: uygulama ön-üretim adımı olmadan
// (`npm start` doğrudan) çalışabilsin diye. Değer değişikliği YALNIZ
// tokens.json'da yapılır; sonra script yeniden koşulur.

export const primitive = {
  "color": {
    "light": {
      "text": "#3A2E37",
      "background": "#FBF6F3",
      "backgroundElement": "#F1E4E1",
      "backgroundSelected": "#E7D3D0",
      "textSecondary": "#857078",
      "accent": "#A86B77",
      "danger": "#A85B5B"
    },
    "dark": {
      "text": "#F1E4E1",
      "background": "#171016",
      "backgroundElement": "#271E26",
      "backgroundSelected": "#342936",
      "textSecondary": "#B29AA4",
      "accent": "#C98B99",
      "danger": "#C98B8B"
    },
    "ambient": {
      "morning": "#FBF3EA",
      "day": "#FBF6F3",
      "evening": "#F9F1F6",
      "night": "#F2EFF6"
    }
  },
  "space": {
    "s2": 2,
    "s4": 4,
    "s8": 8,
    "s12": 12,
    "s16": 16,
    "s20": 20,
    "s24": 24,
    "s32": 32,
    "s40": 40,
    "s48": 48,
    "s64": 64,
    "s96": 96
  },
  "radius": {
    "xs": 4,
    "sm": 8,
    "md": 12,
    "lg": 16,
    "xl": 24,
    "full": 999
  },
  "typography": {
    "display": {
      "xl": {
        "size": 40,
        "lineHeight": 48,
        "weight": "600"
      },
      "l": {
        "size": 32,
        "lineHeight": 40,
        "weight": "600"
      }
    },
    "heading": {
      "xl": {
        "size": 28,
        "lineHeight": 34,
        "weight": "600"
      },
      "l": {
        "size": 24,
        "lineHeight": 30,
        "weight": "600"
      },
      "m": {
        "size": 20,
        "lineHeight": 26,
        "weight": "600"
      },
      "s": {
        "size": 16,
        "lineHeight": 22,
        "weight": "600"
      }
    },
    "body": {
      "l": {
        "size": 16,
        "lineHeight": 24,
        "weight": "400"
      },
      "m": {
        "size": 15,
        "lineHeight": 22,
        "weight": "400"
      },
      "s": {
        "size": 14,
        "lineHeight": 20,
        "weight": "400"
      }
    },
    "label": {
      "size": 13,
      "lineHeight": 18,
      "weight": "500"
    },
    "caption": {
      "size": 12,
      "lineHeight": 18,
      "weight": "400"
    },
    "overline": {
      "size": 12,
      "lineHeight": 16,
      "weight": "500",
      "letterSpacing": 1
    }
  },
  "size": {
    "icon": {
      "sm": 16,
      "md": 22,
      "lg": 44,
      "xl": 56
    }
  },
  "duration": {
    "instant": 120,
    "feedback": 180,
    "component": 280,
    "navigation": 350,
    "hero": 550,
    "pulse": 900
  },
  "easing": {
    "standard": [
      0.2,
      0,
      0,
      1
    ],
    "decelerate": [
      0,
      0,
      0.2,
      1
    ],
    "accelerate": [
      0.3,
      0,
      1,
      1
    ]
  },
  "opacity": {
    "inactive": 0.55,
    "pressed": 0.7,
    "pulse": 0.45,
    "disabled": 0.4
  },
  "borderWidth": {
    "thin": 1,
    "focus": 2
  },
  "motionDistance": {
    "pressScale": 0.97
  },
  "elevation": {
    "level0": 0,
    "level1": 1,
    "level2": 3,
    "level3": 6,
    "level4": 12
  }
} as const;
