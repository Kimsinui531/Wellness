import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IconCircle, ScreenContainer } from '@/components/common';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { layoutSpacing, spacing } from '@/constants/spacing';
import { fontSizes, fontWeights } from '@/constants/typography';

const SUCCESS_TIMEOUT_MS = 2200;

type PermissionSuccessScreenProps = {
  onComplete: () => void;
};

export function PermissionSuccessScreen({ onComplete }: PermissionSuccessScreenProps) {
  useEffect(() => {
    const timeoutId = setTimeout(onComplete, SUCCESS_TIMEOUT_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [onComplete]);

  return (
    <ScreenContainer contentStyle={styles.container}>
      <View style={styles.successHalo}>
        <IconCircle
          size={64}
          backgroundColor={colors.teal}
          style={styles.successCircle}
          icon={<Text style={styles.checkIcon}>✓</Text>}
        />
      </View>

      <Text style={styles.title}>준비 완료!</Text>
      <Text style={styles.description}>이제 측정 화면으로 이동합니다</Text>

      <View style={styles.dots}>
        {[0, 1, 2].map((index) => (
          <View key={index} style={[styles.dot, index === 1 && styles.dotMuted]} />
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layoutSpacing.screenHorizontalWide,
    backgroundColor: colors.bg,
  },
  successHalo: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.screen,
    borderRadius: 48,
    backgroundColor: 'rgba(109,200,164,0.14)',
  },
  successCircle: {
    borderRadius: 32,
    shadowColor: colors.teal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  checkIcon: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: fontWeights.bold,
    lineHeight: 32,
  },
  title: {
    marginBottom: spacing.lg,
    color: colors.textHi,
    fontSize: fontSizes.titleLarge,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
  description: {
    color: colors.textMd,
    fontSize: fontSizes.bodyLarge,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.screenWide,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  dotMuted: {
    opacity: 0.7,
  },
});
