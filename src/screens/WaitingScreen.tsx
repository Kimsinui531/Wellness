import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppHeader, ScreenContainer } from '@/components/common';
import { ListeningIndicator } from '@/components/shower/ListeningIndicator';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { layoutSpacing, spacing } from '@/constants/spacing';
import { fontSizes, fontWeights, lineHeights } from '@/constants/typography';

type WaitingScreenProps = {
  onDetected: () => void;
};

export function WaitingScreen({ onDetected }: WaitingScreenProps) {
  return (
    <ScreenContainer contentStyle={styles.container}>
      <AppHeader
        title="AquaLog"
        logoIcon={<Text style={styles.logoIcon}>💧</Text>}
        right={<StatusPill />}
        style={styles.header}
      />

      <View style={styles.main}>
        <View style={styles.indicatorWrap}>
          <ListeningIndicator onPress={onDetected} />
        </View>

        <Text style={styles.title}>
          샤워를 시작하면{'\n'}자동으로 측정합니다
        </Text>
        <Text style={styles.description}>
          물소리가 감지되면 타이머가 시작됩니다
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          onPress={onDetected}
          style={({ pressed }) => [styles.demoButton, pressed && styles.demoButtonPressed]}
        >
          <Text style={styles.demoButtonText}>데모 시작 →</Text>
        </Pressable>
        <Text style={styles.footerText}>데모 모드 · 터치로 측정을 시작합니다</Text>
      </View>
    </ScreenContainer>
  );
}

function StatusPill() {
  return (
    <View style={styles.statusPill}>
      <View style={styles.statusDot} />
      <Text style={styles.statusText}>마이크 감지 중</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: layoutSpacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  logoIcon: {
    color: colors.surface,
    fontSize: 14,
    lineHeight: 18,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(112,145,230,0.3)',
    borderRadius: radius.pill,
    backgroundColor: colors.primaryDim,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  statusText: {
    color: colors.textMd,
    fontSize: 11,
    fontWeight: fontWeights.semibold,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorWrap: {
    marginBottom: spacing.section,
  },
  title: {
    paddingHorizontal: layoutSpacing.screenHorizontalWide,
    marginBottom: spacing.lg,
    color: colors.textHi,
    fontSize: fontSizes.titleSmall,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.titleSmall * lineHeights.titleRelaxed,
    textAlign: 'center',
  },
  description: {
    color: colors.textLo,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: layoutSpacing.screenHorizontal,
    paddingBottom: spacing.section,
  },
  demoButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radius.button,
    paddingVertical: 17,
    backgroundColor: 'transparent',
  },
  demoButtonPressed: {
    transform: [{ scale: 0.97 }],
  },
  demoButtonText: {
    color: colors.primary,
    fontSize: fontSizes.bodyLarge,
    fontWeight: fontWeights.bold,
  },
  footerText: {
    marginTop: spacing.md,
    color: colors.textLo,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
});
