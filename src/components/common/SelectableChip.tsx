import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontSizes, fontWeights } from '@/constants/typography';

type SelectableChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  selectedIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function SelectableChip({
  label,
  selected,
  onPress,
  selectedIcon,
  style,
}: SelectableChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.selected : styles.unselected,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View style={[styles.checkCircle, selected ? styles.checkCircleSelected : styles.checkCircleIdle]}>
        {selected && selectedIcon}
      </View>
      <Text style={[styles.label, selected ? styles.selectedLabel : styles.unselectedLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 92,
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: spacing.md,
    borderWidth: 2,
    borderRadius: radius.card,
    paddingHorizontal: spacing.xxl,
    paddingVertical: 18,
  },
  selected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryDim,
  },
  unselected: {
    borderColor: 'transparent',
    backgroundColor: colors.surface,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
  checkCircle: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  checkCircleSelected: {
    backgroundColor: colors.primary,
  },
  checkCircleIdle: {
    backgroundColor: colors.muted,
  },
  label: {
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
  },
  selectedLabel: {
    color: colors.primary,
  },
  unselectedLabel: {
    color: colors.textHi,
  },
});
