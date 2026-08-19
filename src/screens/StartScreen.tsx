import { StyleSheet, Text, View } from 'react-native';

import { IconCircle, PrimaryButton, ScreenContainer } from '@/components/common';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { layoutSpacing, spacing } from '@/constants/spacing';
import { fontSizes, fontWeights, lineHeights } from '@/constants/typography';

type StartScreenProps = {
  onStart: () => void;
};

const FEATURES = [
  {
    icon: '🎧',
    text: '물소리 자동 감지로 터치 부담 없이',
  },
  {
    icon: '⏱',
    text: '샤워 시간 실시간 측정 및 기록',
  },
  {
    icon: '🧴',
    text: '피부 상태 기반 맞춤 케어 추천',
  },
] as const;

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <ScreenContainer contentStyle={styles.container}>
      <View pointerEvents="none" style={styles.primaryGlow} />
      <View pointerEvents="none" style={styles.peachGlow} />

      <View style={styles.main}>
        <View style={styles.brandBlock}>
          <IconCircle
            size={56}
            backgroundColor={colors.primary}
            style={styles.logo}
            icon={<Text style={styles.logoIcon}>💧</Text>}
          />
          <Text style={styles.appName}>AquaLog</Text>
          <View style={styles.brandRule} />
          <Text style={styles.description}>
            자동 샤워 케어로{'\n'}피부 건강을 지켜보세요
          </Text>
        </View>

        <View style={styles.featureList}>
          {FEATURES.map((feature) => (
            <View key={feature.text} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.ctaArea}>
        <PrimaryButton
          label="시작하기"
          onPress={onStart}
          style={styles.ctaButton}
          labelStyle={styles.ctaLabel}
          rightIcon={<Text style={styles.ctaIcon}>›</Text>}
        />
        <Text style={styles.caption}>무료로 시작 · 광고 없음</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.bg,
  },
  primaryGlow: {
    position: 'absolute',
    top: -18,
    right: -24,
    width: 288,
    height: 288,
    borderRadius: 144,
    backgroundColor: 'rgba(112,145,230,0.08)',
  },
  peachGlow: {
    position: 'absolute',
    bottom: 160,
    left: -48,
    width: 224,
    height: 224,
    borderRadius: 112,
    backgroundColor: 'rgba(255,208,182,0.13)',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: layoutSpacing.screenHorizontalWide,
  },
  brandBlock: {
    marginBottom: 28,
  },
  logo: {
    marginBottom: spacing.xxl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 24,
    lineHeight: 28,
  },
  appName: {
    color: colors.textHi,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.display,
  },
  brandRule: {
    width: 28,
    height: 2.5,
    marginTop: 8,
    marginBottom: spacing.xl,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  description: {
    color: colors.textMd,
    fontSize: fontSizes.bodyLarge,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.bodyLarge * lineHeights.bodyRelaxed,
  },
  featureList: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 2,
  },
  featureIcon: {
    width: 24,
    textAlign: 'center',
    fontSize: fontSizes.bodyLarge,
  },
  featureText: {
    flex: 1,
    color: colors.textMd,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium,
  },
  ctaArea: {
    paddingHorizontal: layoutSpacing.screenHorizontal,
    paddingBottom: spacing.screen,
  },
  ctaButton: {
    paddingVertical: 18,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  ctaLabel: {
    fontSize: 17,
  },
  ctaIcon: {
    color: colors.surface,
    fontSize: 26,
    fontWeight: fontWeights.bold,
    lineHeight: 26,
  },
  caption: {
    marginTop: spacing.lg,
    color: colors.textLo,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
});
