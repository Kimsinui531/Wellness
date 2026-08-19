export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
  screen: 24,
  screenWide: 32,
  section: 40,
} as const;

export const layoutSpacing = {
  screenHorizontalCompact: spacing.xxl,
  screenHorizontal: spacing.screen,
  screenHorizontalWide: spacing.screenWide,
  cardPadding: spacing.xl,
  cardPaddingLarge: spacing.xxl,
  bottomActionPadding: spacing.section,
} as const;
