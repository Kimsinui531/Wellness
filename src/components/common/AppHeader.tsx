import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontSizes, fontWeights } from '@/constants/typography';

type AppHeaderProps = {
  title?: string;
  showLogo?: boolean;
  logoIcon?: ReactNode;
  backIcon?: ReactNode;
  onBack?: () => void;
  right?: ReactNode;
  center?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function AppHeader({
  title = 'AquaLog',
  showLogo = true,
  logoIcon,
  backIcon,
  onBack,
  right,
  center,
  style,
}: AppHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            accessibilityRole="button"
            onPress={onBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            {backIcon ?? <Text style={styles.backText}>‹</Text>}
          </Pressable>
        ) : (
          showLogo && (
            <View style={styles.brand}>
              <View style={styles.logo}>{logoIcon ?? <Text style={styles.logoText}>A</Text>}</View>
              <Text style={styles.title}>{title}</Text>
            </View>
          )
        )}
      </View>

      {center && <View style={styles.center}>{center}</View>}

      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  side: {
    minWidth: 40,
    flex: 1,
    alignItems: 'flex-start',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logo: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.smallLogo,
    backgroundColor: colors.primary,
  },
  logoText: {
    color: colors.surface,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
  },
  title: {
    color: colors.textHi,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  backText: {
    color: colors.textHi,
    fontSize: 32,
    fontWeight: fontWeights.regular,
    lineHeight: 36,
  },
  pressed: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    minWidth: 40,
    flex: 1,
    alignItems: 'flex-end',
  },
});
