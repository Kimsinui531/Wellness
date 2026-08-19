import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { layoutSpacing, spacing } from '@/constants/spacing';

type BottomSheetProps = {
  visible: boolean;
  children: ReactNode;
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
  showHandle?: boolean;
  presentation?: 'modal' | 'inline';
};

export function BottomSheet({
  visible,
  children,
  onClose,
  style,
  showHandle = true,
  presentation = 'modal',
}: BottomSheetProps) {
  if (!visible) {
    return null;
  }

  if (presentation === 'inline') {
    return (
      <View style={[styles.sheet, style]}>
        {showHandle && <View style={styles.handle} />}
        {children}
      </View>
    );
  }

  return (
    <View style={styles.overlayRoot} pointerEvents="box-none">
      <Pressable style={styles.dim} onPress={onClose} />
      <View style={[styles.sheet, style]}>
        {showHandle && <View style={styles.handle} />}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlayRoot: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
    zIndex: 20,
  },
  dim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    width: '100%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.bottomSheet,
    borderTopRightRadius: radius.bottomSheet,
    paddingHorizontal: layoutSpacing.screenHorizontal,
    paddingTop: spacing.xl,
    paddingBottom: layoutSpacing.bottomActionPadding,
  },
  handle: {
    width: 40,
    height: 4,
    alignSelf: 'center',
    marginBottom: spacing.screen,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
  },
});
