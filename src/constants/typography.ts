import { Platform } from 'react-native';

const fallbackFontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: undefined,
});

export const fontFamilies = {
  base: fallbackFontFamily,
  timer: fallbackFontFamily,
} as const;

export const fontWeights = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const fontSizes = {
  badge: 10,
  caption: 12,
  body: 14,
  bodyLarge: 16,
  titleSmall: 22,
  title: 24,
  titleLarge: 26,
  display: 40,
  timer: 72,
} as const;

export const lineHeights = {
  tight: 1,
  title: 1.35,
  titleRelaxed: 1.4,
  body: 1.5,
  bodyRelaxed: 1.55,
} as const;

export const typography = {
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
} as const;
