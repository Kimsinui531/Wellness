import { StyleSheet } from 'react-native';

import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontSizes, fontWeights } from '@/constants/typography';

export const buttonStyles = StyleSheet.create({
  base: {
    width: '100%',
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.button,
    paddingHorizontal: spacing.xl,
    paddingVertical: 17,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  primaryDisabled: {
    backgroundColor: colors.border,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  label: {
    fontSize: fontSizes.bodyLarge,
    fontWeight: fontWeights.bold,
  },
  primaryLabel: {
    color: colors.surface,
  },
  primaryDisabledLabel: {
    color: colors.textLo,
  },
  secondaryLabel: {
    color: colors.textHi,
  },
});
