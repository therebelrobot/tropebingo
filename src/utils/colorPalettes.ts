/**
 * Predefined color palettes for different genre types
 */

export interface ColorPalette {
  name: string;
  description: string;
  preview: string[]; // Array of 4-5 colors for preview
  light: {
    primary: string;
    primaryHover: string;
    surface: string;
    accent: string;
  };
  dark: {
    primary: string;
    primaryHover: string;
    surface: string;
    accent: string;
  };
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    name: 'Horror (Blood Red)',
    description: 'Classic horror with deep reds',
    preview: ['#dc2626', '#b91c1c', '#fef2f2', '#991b1b'],
    light: {
      primary: '#dc2626',
      primaryHover: '#b91c1c',
      surface: '#fef2f2',
      accent: '#991b1b',
    },
    dark: {
      primary: '#b91c1c',
      primaryHover: '#991b1b',
      surface: '#1e293b',
      accent: '#dc2626',
    },
  },
  {
    name: 'Romance (Pink)',
    description: 'Warm and inviting pink tones',
    preview: ['#ec4899', '#db2777', '#fdf2f8', '#be185d'],
    light: {
      primary: '#ec4899',
      primaryHover: '#db2777',
      surface: '#fdf2f8',
      accent: '#be185d',
    },
    dark: {
      primary: '#db2777',
      primaryHover: '#be185d',
      surface: '#1e293b',
      accent: '#ec4899',
    },
  },
  {
    name: 'Comedy (Yellow)',
    description: 'Bright and cheerful yellows',
    preview: ['#eab308', '#ca8a04', '#fefce8', '#a16207'],
    light: {
      primary: '#eab308',
      primaryHover: '#ca8a04',
      surface: '#fefce8',
      accent: '#a16207',
    },
    dark: {
      primary: '#ca8a04',
      primaryHover: '#a16207',
      surface: '#1e293b',
      accent: '#eab308',
    },
  },
  {
    name: 'Sci-Fi (Cyan)',
    description: 'Futuristic cyan and teal',
    preview: ['#06b6d4', '#0891b2', '#ecfeff', '#0e7490'],
    light: {
      primary: '#06b6d4',
      primaryHover: '#0891b2',
      surface: '#ecfeff',
      accent: '#0e7490',
    },
    dark: {
      primary: '#0891b2',
      primaryHover: '#0e7490',
      surface: '#1e293b',
      accent: '#06b6d4',
    },
  },
  {
    name: 'Action (Orange)',
    description: 'Bold and energetic orange',
    preview: ['#f97316', '#ea580c', '#fff7ed', '#c2410c'],
    light: {
      primary: '#f97316',
      primaryHover: '#ea580c',
      surface: '#fff7ed',
      accent: '#c2410c',
    },
    dark: {
      primary: '#ea580c',
      primaryHover: '#c2410c',
      surface: '#1e293b',
      accent: '#f97316',
    },
  },
  {
    name: 'Mystery (Purple)',
    description: 'Deep and mysterious purples',
    preview: ['#9333ea', '#7e22ce', '#faf5ff', '#6b21a8'],
    light: {
      primary: '#9333ea',
      primaryHover: '#7e22ce',
      surface: '#faf5ff',
      accent: '#6b21a8',
    },
    dark: {
      primary: '#7e22ce',
      primaryHover: '#6b21a8',
      surface: '#1e293b',
      accent: '#9333ea',
    },
  },
  {
    name: 'Drama (Indigo)',
    description: 'Sophisticated indigo tones',
    preview: ['#6366f1', '#4f46e5', '#eef2ff', '#4338ca'],
    light: {
      primary: '#6366f1',
      primaryHover: '#4f46e5',
      surface: '#eef2ff',
      accent: '#4338ca',
    },
    dark: {
      primary: '#4f46e5',
      primaryHover: '#4338ca',
      surface: '#1e293b',
      accent: '#6366f1',
    },
  },
  {
    name: 'Adventure (Green)',
    description: 'Natural and adventurous greens',
    preview: ['#10b981', '#059669', '#f0fdf4', '#047857'],
    light: {
      primary: '#10b981',
      primaryHover: '#059669',
      surface: '#f0fdf4',
      accent: '#047857',
    },
    dark: {
      primary: '#059669',
      primaryHover: '#047857',
      surface: '#1e293b',
      accent: '#10b981',
    },
  },
  {
    name: 'Classic (Blue)',
    description: 'Timeless blue palette',
    preview: ['#3b82f6', '#2563eb', '#eff6ff', '#1d4ed8'],
    light: {
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      surface: '#eff6ff',
      accent: '#1d4ed8',
    },
    dark: {
      primary: '#2563eb',
      primaryHover: '#1d4ed8',
      surface: '#1e293b',
      accent: '#3b82f6',
    },
  },
  {
    name: 'Noir (Grayscale)',
    description: 'Classic black and white',
    preview: ['#374151', '#1f2937', '#f9fafb', '#111827'],
    light: {
      primary: '#374151',
      primaryHover: '#1f2937',
      surface: '#f9fafb',
      accent: '#111827',
    },
    dark: {
      primary: '#1f2937',
      primaryHover: '#111827',
      surface: '#1e293b',
      accent: '#374151',
    },
  },
];

/**
 * Generate a random color palette
 */
export function generateRandomPalette(): ColorPalette {
  const hue = Math.floor(Math.random() * 360);

  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const saturation = 70;

  return {
    name: 'Random Palette',
    description: 'Computer-generated color scheme',
    preview: [
      hslToHex(hue, saturation, 55),
      hslToHex(hue, saturation, 45),
      hslToHex(hue, 20, 95),
      hslToHex(hue, saturation, 35),
    ],
    light: {
      primary: hslToHex(hue, saturation, 55),
      primaryHover: hslToHex(hue, saturation, 45),
      surface: hslToHex(hue, 20, 95),
      accent: hslToHex(hue, saturation, 35),
    },
    dark: {
      primary: hslToHex(hue, saturation, 45),
      primaryHover: hslToHex(hue, saturation, 35),
      surface: '#1e293b',
      accent: hslToHex(hue, saturation, 55),
    },
  };
}