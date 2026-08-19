import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  BottomSheet,
  IconCircle,
  PrimaryButton,
  ProgressDots,
  ScreenContainer,
} from '@/components/common';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { layoutSpacing, spacing } from '@/constants/spacing';
import { fontSizes, fontWeights, lineHeights } from '@/constants/typography';
import { useMicrophonePermission } from '@/hooks/useMicrophonePermission';

type MicPermissionScreenProps = {
  onBack: () => void;
  onAllow: () => void;
  onDeny: () => void;
};

const PERMISSION_NOTES = [
  {
    icon: '🎧',
    text: '물소리 감지를 통한 자동 측정에만 사용합니다',
  },
  {
    icon: '🔒',
    text: '음성은 저장하거나 서버로 전송하지 않습니다',
  },
  {
    icon: '📊',
    text: '소리 크기(dB)만 분석하며 내용은 처리하지 않습니다',
  },
] as const;

export function MicPermissionScreen({ onBack, onAllow, onDeny }: MicPermissionScreenProps) {
  const { requestPermission } = useMicrophonePermission();
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);

  const handleAllow = async () => {
    try {
      setIsRequestingPermission(true);
      const permission = await requestPermission();

      if (permission.granted) {
        onAllow();
        return;
      }

      onDeny();
    } catch {
      onDeny();
    } finally {
      setIsRequestingPermission(false);
    }
  };

  return (
    <ScreenContainer contentStyle={styles.container}>
      <AppHeader
        onBack={onBack}
        backIcon={<Text style={styles.backIcon}>‹</Text>}
        center={<ProgressDots current={1} />}
        style={styles.header}
      />

      <View style={styles.main}>
        <View style={styles.micArt}>
          <View style={styles.outerRing} />
          <View style={styles.middleRing} />
          <IconCircle
            size={56}
            backgroundColor="rgba(112,145,230,0.2)"
            style={styles.micCircle}
            icon={<Text style={styles.micIcon}>🎙</Text>}
          />
        </View>

        <Text style={styles.title}>
          마이크 접근을{'\n'}허용해 주세요
        </Text>
        <Text style={styles.description}>
          물소리 감지를 통해 샤워 시작을{'\n'}자동으로 인식합니다
        </Text>
      </View>

      <BottomSheet visible presentation="inline" style={styles.sheet}>
        <Text style={styles.sheetTitle}>왜 마이크 권한이 필요한가요?</Text>

        <View style={styles.noteList}>
          {PERMISSION_NOTES.map((note) => (
            <View key={note.text} style={styles.noteRow}>
              <Text style={styles.noteIcon}>{note.icon}</Text>
              <Text style={styles.noteText}>{note.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            label={isRequestingPermission ? '권한 확인 중' : '권한 허용하기'}
            onPress={handleAllow}
            disabled={isRequestingPermission}
            style={styles.allowButton}
          />
          <Pressable
            accessibilityRole="button"
            onPress={onDeny}
            style={({ pressed }) => [styles.denyButton, pressed && styles.denyButtonPressed]}
          >
            <Text style={styles.denyText}>나중에</Text>
          </Pressable>
        </View>
      </BottomSheet>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: layoutSpacing.screenHorizontalCompact,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  backIcon: {
    color: colors.textHi,
    fontSize: 32,
    fontWeight: fontWeights.regular,
    lineHeight: 36,
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: layoutSpacing.screenHorizontalWide,
    paddingBottom: spacing.screenWide,
  },
  micArt: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  outerRing: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 56,
    backgroundColor: colors.primaryDim,
    opacity: 0.3,
  },
  middleRing: {
    position: 'absolute',
    top: 12,
    right: 12,
    bottom: 12,
    left: 12,
    borderRadius: 44,
    backgroundColor: colors.primaryDim,
  },
  micCircle: {
    borderRadius: 28,
  },
  micIcon: {
    color: colors.primary,
    fontSize: 28,
    lineHeight: 32,
  },
  title: {
    marginBottom: spacing.lg,
    color: colors.textHi,
    fontSize: fontSizes.titleSmall,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.titleSmall * lineHeights.title,
    textAlign: 'center',
  },
  description: {
    color: colors.textMd,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.body * lineHeights.body,
    textAlign: 'center',
  },
  sheet: {
    paddingTop: layoutSpacing.screenHorizontal,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 32,
    elevation: 8,
  },
  sheetTitle: {
    marginBottom: spacing.xxl,
    color: colors.textHi,
    fontSize: 18,
    fontWeight: fontWeights.bold,
  },
  noteList: {
    gap: spacing.xl,
    marginBottom: 28,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  noteIcon: {
    width: 28,
    marginTop: 2,
    fontSize: 19,
    textAlign: 'center',
  },
  noteText: {
    flex: 1,
    color: colors.textMd,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.body * lineHeights.body,
  },
  actions: {
    gap: spacing.lg,
  },
  allowButton: {
    paddingVertical: 17,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 8,
  },
  denyButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  denyButtonPressed: {
    opacity: 0.6,
  },
  denyText: {
    color: colors.textLo,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
  },
});
