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
    "chrome": {
      "background": "#F8F2EC",
      "backgroundAlt": "#FCF8F4",
      "surface": "#FFFDFC",
      "surfaceTint": "#F5ECE7",
      "powder": "#EFD9DD",
      "parchment": "#F6EEE4",
      "stone": "#E7E0D8",
      "border": "#D8CEC5",
      "textPrimary": "#2E2926",
      "textSecondary": "#625954",
      "textMuted": "#827771"
    },
    "botanical": {
      "sage": "#879A7A",
      "moss": "#687655",
      "fern": "#55735D",
      "eucalyptus": "#78968B",
      "olive": "#8D8A58",
      "bark": "#765B49",
      "ochre": "#B68943",
      "terracotta": "#A45F48",
      "calendula": "#D9982F",
      "borage": "#4D78A6",
      "hypericum": "#D2B42C"
    },
    "celestial": {
      "moon": "#A9B8C2",
      "sky": "#7C9DB3",
      "dusk": "#65728D",
      "indigo": "#4B5374",
      "violet": "#827394",
      "plum": "#67505F",
      "gold": "#C5A260",
      "copper": "#A66F52"
    },
    "visualPanels": {
      "dusk": "#3F4A5D",
      "night": "#222B38",
      "ritual": "#31303D",
      "astrology": "#293346",
      "gardenNight": "#26392F"
    },
    "scrim": {
      "transparent": "transparent",
      "soft": "rgba(0,0,0,0.35)"
    },
    "ambient": {
      "morning": "#F8ECD9",
      "day": "#FBF6F3",
      "evening": "#F4E7F0",
      "night": "#E9E4F2"
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
  },
  "layout": {
    "screenPadding": 20,
    "compactScreenPadding": 16,
    "topPadding": 16,
    "sectionGap": 28,
    "denseSectionGap": 20,
    "cardGap": 12,
    "largeCardGap": 16,
    "inlineGap": 8,
    "heroRadius": 24,
    "cardRadius": 16,
    "compactRadius": 12,
    "buttonHeight": 48,
    "touchTarget": 44
  },
  "motionLimits": {
    "maxScale": 1.02,
    "pressScale": 0.98,
    "maxAnimatedElementsPerScreen": 2,
    "ambientMinMs": 8000,
    "ambientMaxMs": 16000,
    "responsiveMinMs": 160,
    "responsiveMaxMs": 300,
    "ceremonialMinMs": 3000,
    "ceremonialMaxMs": 5000
  },
  "proTeaser": {
    "background": "#FFFDFC",
    "accent": "#C5A260",
    "border": "#D8CEC5",
    "lockedPanel": "#31303D",
    "radius": 16,
    "padding": 16,
    "gap": 12
  },
  "typeVariant": {
    "displayHero": {
      "size": 32,
      "lineHeight": 40,
      "weight": "600"
    },
    "screenTitle": {
      "size": 28,
      "lineHeight": 34,
      "weight": "600"
    },
    "sectionTitle": {
      "size": 20,
      "lineHeight": 26,
      "weight": "600"
    },
    "plantName": {
      "size": 24,
      "lineHeight": 30,
      "weight": "600"
    },
    "ceremonial": {
      "size": 24,
      "lineHeight": 32,
      "weight": "500"
    },
    "readingLead": {
      "size": 18,
      "lineHeight": 28,
      "weight": "400"
    },
    "reading": {
      "size": 16,
      "lineHeight": 26,
      "weight": "400"
    },
    "scientificName": {
      "size": 14,
      "lineHeight": 20,
      "weight": "400"
    },
    "quote": {
      "size": 22,
      "lineHeight": 30,
      "weight": "400"
    },
    "uiBody": {
      "size": 15,
      "lineHeight": 22,
      "weight": "400"
    },
    "uiLabel": {
      "size": 13,
      "lineHeight": 18,
      "weight": "500"
    },
    "uiCaption": {
      "size": 12,
      "lineHeight": 18,
      "weight": "400"
    },
    "uiButton": {
      "size": 16,
      "lineHeight": 22,
      "weight": "600"
    }
  }
} as const;
