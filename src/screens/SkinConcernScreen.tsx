import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  AppHeader,
  PrimaryButton,
  ProgressDots,
  ScreenContainer,
  SelectableChip,
} from '@/components/common';
import { colors } from '@/constants/colors';
import { layoutSpacing, spacing } from '@/constants/spacing';
import { fontSizes, fontWeights, lineHeights } from '@/constants/typography';

type SkinConcernScreenProps = {
  selectedConcerns: string[];
  onToggleConcern: (concern: string) => void;
  onBack: () => void;
  onNext: () => void;
};

const SKIN_CONCERNS = ['건조함', '당김', '민감함', '여드름', '트러블', '칙칙함', '모공', '주름'];

export function SkinConcernScreen({
  selectedConcerns,
  onToggleConcern,
  onBack,
  onNext,
}: SkinConcernScreenProps) {
  const hasSelectedConcerns = selectedConcerns.length > 0;

  return (
    <ScreenContainer contentStyle={styles.container}>
      <AppHeader
        onBack={onBack}
        backIcon={<Text style={styles.backIcon}>‹</Text>}
        center={<ProgressDots current={0} />}
        style={styles.header}
      />

      <View style={styles.heading}>
        <Text style={styles.step}>Step 1 / 4</Text>
        <Text style={styles.title}>
          현재 가장 큰{'\n'}피부 고민은 무엇인가요?
        </Text>
        <Text style={styles.description}>복수 선택 가능합니다</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.chipGrid}
        showsVerticalScrollIndicator={false}
      >
        {SKIN_CONCERNS.map((concern) => (
          <SelectableChip
            key={concern}
            label={concern}
            selected={selectedConcerns.includes(concern)}
            selectedIcon={<Text style={styles.checkIcon}>✓</Text>}
            onPress={() => onToggleConcern(concern)}
            style={styles.chip}
          />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label={hasSelectedConcerns ? `다음 (${selectedConcerns.length}개 선택)` : '다음'}
          disabled={!hasSelectedConcerns}
          onPress={onNext}
          style={styles.nextButton}
          labelStyle={styles.nextButtonLabel}
        />
      </View>
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
  heading: {
    paddingHorizontal: layoutSpacing.screenHorizontal,
    paddingTop: spacing.xs,
    paddingBottom: layoutSpacing.screenHorizontal,
  },
  step: {
    marginBottom: spacing.xs,
    color: colors.textLo,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.textHi,
    fontSize: fontSizes.title,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.title * lineHeights.title,
  },
  description: {
    marginTop: spacing.xs,
    color: colors.textLo,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium,
  },
  scroll: {
    flex: 1,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    paddingHorizontal: layoutSpacing.screenHorizontal,
    paddingBottom: layoutSpacing.screenHorizontal,
  },
  chip: {
    width: '47.5%',
  },
  checkIcon: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: fontWeights.bold,
    lineHeight: 14,
  },
  footer: {
    paddingHorizontal: layoutSpacing.screenHorizontal,
    paddingTop: spacing.xl,
    paddingBottom: spacing.section,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  nextButton: {
    paddingVertical: 18,
  },
  nextButtonLabel: {
    fontSize: 17,
  },
});
