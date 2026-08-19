import { StyleSheet, Text, View } from 'react-native';

import { IconCircle, PrimaryButton, ScreenContainer, SecondaryButton } from '@/components/common';
import { colors } from '@/constants/colors';
import { layoutSpacing, spacing } from '@/constants/spacing';
import { fontSizes, fontWeights, lineHeights } from '@/constants/typography';

type PermissionDeniedScreenProps = {
  onRetry: () => void;
  onOpenSettings: () => void;
};

export function PermissionDeniedScreen({
  onRetry,
  onOpenSettings,
}: PermissionDeniedScreenProps) {
  return (
    <ScreenContainer contentStyle={styles.container}>
      <View style={styles.content}>
        <IconCircle
          size={80}
          backgroundColor={colors.alertDim}
          style={styles.warningCircle}
          icon={<Text style={styles.warningIcon}>!</Text>}
        />

        <Text style={styles.title}>자동 측정 불가</Text>
        <Text style={styles.description}>
          자동 측정을 위해 마이크 권한이 필요합니다.{'\n'}
          설정에서 권한을 변경하면{'\n'}
          다시 사용할 수 있습니다.
        </Text>

        <View style={styles.actions}>
          <PrimaryButton
            label="⚙ 설정에서 변경하기"
            onPress={onOpenSettings}
            style={styles.settingsButton}
            labelStyle={styles.settingsButtonLabel}
          />
          <SecondaryButton label="다시 시도" onPress={onRetry} style={styles.retryButton} />
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layoutSpacing.screenHorizontalWide,
  },
  warningCircle: {
    marginBottom: spacing.screen,
    borderRadius: 40,
  },
  warningIcon: {
    color: colors.alert,
    fontSize: 32,
    fontWeight: fontWeights.bold,
    lineHeight: 36,
  },
  title: {
    marginBottom: spacing.lg,
    color: colors.textHi,
    fontSize: fontSizes.titleSmall,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
  description: {
    marginBottom: spacing.screenWide,
    color: colors.textMd,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.body * lineHeights.bodyRelaxed,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: spacing.lg,
  },
  settingsButton: {
    paddingVertical: 17,
    backgroundColor: colors.textHi,
  },
  settingsButtonLabel: {
    color: colors.surface,
    fontSize: fontSizes.bodyLarge,
  },
  retryButton: {
    paddingVertical: 17,
  },
});
