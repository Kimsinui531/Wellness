import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader, BottomSheet, PrimaryButton, ScreenContainer } from '@/components/common';
import {
  CareRecommendationCard,
  type CareRecommendation,
} from '@/components/result/CareRecommendationCard';
import { ResultSummaryCard } from '@/components/result/ResultSummaryCard';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { layoutSpacing, spacing } from '@/constants/spacing';
import { fontSizes, fontWeights, lineHeights } from '@/constants/typography';
import { formatElapsedTime } from '@/hooks/useShowerTimer';

type ResultScreenProps = {
  elapsedSeconds: number;
  recommendedSeconds: number;
  onRestart: () => void;
};

const SKIN_STATES = [
  { emoji: '😕', label: '건조함', value: 'dry' },
  { emoji: '🙂', label: '보통', value: 'normal' },
  { emoji: '😊', label: '촉촉함', value: 'moist' },
] as const;

const CARE_RECOMMENDATIONS: CareRecommendation[] = [
  {
    key: 'pith',
    icon: '🧴',
    title: 'PITH 수분 진정 세럼',
    subtitle: '샤워 후 즉각 진정 케어',
    description: '알란토인 3종 + 판테놀 7% 복합 처방',
    badge: 'PITH Store',
    color: colors.teal,
    sheetTitle: 'PITH 수분 진정 세럼',
    sheetDescription:
      '샤워 직후 민감 진정과 수분 공급을 동시에 돕는 알란토인 3종 + 판테놀 7% 복합 처방입니다.',
    cta: 'PITH Store에서 보기',
  },
  {
    key: 'clinic',
    icon: '🏥',
    title: 'DERNA 피부 상담',
    subtitle: '데이터 기반 맞춤 상담 안내',
    description: '전문가가 제안하는 개인화 루틴',
    badge: '상담 예약',
    color: colors.primary,
    sheetTitle: 'DERNA 피부 상담',
    sheetDescription:
      'AquaLog 데이터를 기반으로 피부 고민과 전문가 상담을 연결합니다. 샤워 습관과 피부 상태 기록을 활용해 개인화된 루틴을 제안받을 수 있습니다.',
    cta: 'DERNA 상담 예약하기',
  },
];

export function ResultScreen({
  elapsedSeconds,
  recommendedSeconds,
  onRestart,
}: ResultScreenProps) {
  const [skinState, setSkinState] = useState<string | null>(null);
  const [selectedCare, setSelectedCare] = useState<CareRecommendation | null>(null);
  const isOver = elapsedSeconds > recommendedSeconds;

  return (
    <ScreenContainer contentStyle={styles.container}>
      <AppHeader
        title="오늘의 기록"
        logoIcon={<Text style={styles.logoIcon}>💧</Text>}
        right={
          <Pressable
            accessibilityRole="button"
            onPress={onRestart}
            style={({ pressed }) => [styles.restartButton, pressed && styles.pressed]}
          >
            <Text style={styles.restartText}>처음으로</Text>
          </Pressable>
        }
        style={styles.header}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <ResultSummaryCard
            elapsedSeconds={elapsedSeconds}
            recommendedSeconds={recommendedSeconds}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>시간 비교 (분)</Text>
          <View style={styles.chartCard}>
            <ComparisonBar
              label="실제"
              value={elapsedSeconds / 60}
              maxValue={Math.max(elapsedSeconds, recommendedSeconds) / 60}
              color={isOver ? colors.alert : colors.primary}
            />
            <ComparisonBar
              label="권장"
              value={recommendedSeconds / 60}
              maxValue={Math.max(elapsedSeconds, recommendedSeconds) / 60}
              color={colors.teal}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>오늘 피부 상태는 어떠셨나요?</Text>
            <Text style={styles.cardDescription}>샤워 후 피부 느낌을 기록해 주세요</Text>
            <View style={styles.skinGrid}>
              {SKIN_STATES.map((state) => {
                const selected = skinState === state.value;

                return (
                  <Pressable
                    key={state.value}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setSkinState(state.value)}
                    style={({ pressed }) => [
                      styles.skinButton,
                      selected && styles.skinButtonSelected,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Text style={styles.skinEmoji}>{state.emoji}</Text>
                    <Text style={[styles.skinLabel, selected && styles.skinLabelSelected]}>
                      {state.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {skinState ? (
              <View style={styles.savedState}>
                <View style={styles.savedCheck}>
                  <Text style={styles.savedCheckText}>✓</Text>
                </View>
                <Text style={styles.savedText}>기록 완료</Text>
              </View>
            ) : (
              <Text style={styles.skipText}>나중에 기록하기</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>맞춤 케어 추천</Text>
          <View style={styles.recommendationList}>
            {CARE_RECOMMENDATIONS.map((item) => (
              <CareRecommendationCard
                key={item.key}
                item={item}
                onPress={() => setSelectedCare(item)}
              />
            ))}
          </View>
        </View>

        <Text style={styles.disclaimer}>
          해당 정보는 의료 진단이 아닌 케어 추천입니다.{'\n'}
          피부 관련 의학적 문제는 전문가와 상담하세요.
        </Text>
      </ScrollView>

      <BottomSheet
        visible={selectedCare !== null}
        onClose={() => setSelectedCare(null)}
        style={styles.sheet}
      >
        {selectedCare && (
          <View>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetSpacer} />
              <Pressable
                accessibilityRole="button"
                onPress={() => setSelectedCare(null)}
                style={styles.closeButton}
              >
                <Text style={styles.closeText}>×</Text>
              </Pressable>
            </View>

            <View style={styles.sheetIntro}>
              <View style={[styles.sheetIcon, { backgroundColor: `${selectedCare.color}18` }]}>
                <Text style={styles.sheetIconText}>{selectedCare.icon}</Text>
              </View>
              <View style={styles.sheetTitleWrap}>
                <View style={[styles.sheetBadge, { backgroundColor: selectedCare.color }]}>
                  <Text style={styles.sheetBadgeText}>{selectedCare.badge}</Text>
                </View>
                <Text style={styles.sheetTitle}>{selectedCare.sheetTitle}</Text>
              </View>
            </View>

            <Text style={styles.sheetDescription}>{selectedCare.sheetDescription}</Text>
            <PrimaryButton
              label={`↗ ${selectedCare.cta}`}
              onPress={() => undefined}
              style={{ backgroundColor: selectedCare.color }}
            />
            <Text style={styles.sheetDisclaimer}>
              해당 정보는 의료 진단이 아닌 케어 추천입니다.
            </Text>
          </View>
        )}
      </BottomSheet>
    </ScreenContainer>
  );
}

function ComparisonBar({
  label,
  value,
  maxValue,
  color,
}: {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}) {
  const height = Math.max(16, (value / Math.max(maxValue, 1)) * 104);

  return (
    <View style={styles.barColumn}>
      <Text style={styles.barValue}>{value.toFixed(1)}분</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { height, backgroundColor: color }]} />
      </View>
      <Text style={styles.barLabel}>{label}</Text>
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
  restartButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.smallLogo,
  },
  pressed: {
    opacity: 0.7,
  },
  restartText: {
    color: colors.textLo,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.section,
  },
  section: {
    paddingHorizontal: layoutSpacing.screenHorizontalCompact,
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    marginBottom: spacing.lg,
    color: colors.textLo,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  chartCard: {
    height: 180,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: spacing.section,
    padding: spacing.xl,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 2,
  },
  barColumn: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  barTrack: {
    width: 52,
    height: 120,
    justifyContent: 'flex-end',
  },
  barFill: {
    width: 52,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  barValue: {
    color: colors.textMd,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
  },
  barLabel: {
    color: colors.textLo,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.medium,
  },
  card: {
    padding: spacing.xxl,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 2,
  },
  cardTitle: {
    marginBottom: 2,
    color: colors.textHi,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
  },
  cardDescription: {
    marginBottom: spacing.xl,
    color: colors.textLo,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.medium,
  },
  skinGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  skinButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: radius.card,
    backgroundColor: colors.bg,
  },
  skinButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryDim,
  },
  skinEmoji: {
    marginBottom: spacing.xs,
    fontSize: 26,
    lineHeight: 30,
  },
  skinLabel: {
    color: colors.textMd,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
  },
  skinLabelSelected: {
    color: colors.primary,
  },
  savedState: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  savedCheck: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.teal,
  },
  savedCheckText: {
    color: colors.surface,
    fontSize: 10,
    fontWeight: fontWeights.bold,
  },
  savedText: {
    color: colors.teal,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
  },
  skipText: {
    color: colors.textLo,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
    textAlign: 'center',
  },
  recommendationList: {
    gap: spacing.lg,
  },
  disclaimer: {
    paddingHorizontal: layoutSpacing.screenHorizontalWide,
    color: colors.textLo,
    fontSize: 11,
    fontWeight: fontWeights.medium,
    lineHeight: 11 * lineHeights.bodyRelaxed,
    textAlign: 'center',
  },
  sheet: {
    paddingTop: spacing.xxl,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxl,
  },
  sheetSpacer: {
    width: 32,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.bg,
  },
  closeText: {
    color: colors.textMd,
    fontSize: 18,
    lineHeight: 22,
  },
  sheetIntro: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xl,
    marginBottom: spacing.xxl,
  },
  sheetIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.card,
  },
  sheetIconText: {
    fontSize: 24,
    lineHeight: 28,
  },
  sheetTitleWrap: {
    flex: 1,
  },
  sheetBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginBottom: spacing.xs,
  },
  sheetBadgeText: {
    color: colors.surface,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
  },
  sheetTitle: {
    color: colors.textHi,
    fontSize: 18,
    fontWeight: fontWeights.bold,
  },
  sheetDescription: {
    marginBottom: 28,
    color: colors.textMd,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.body * lineHeights.bodyRelaxed,
  },
  sheetDisclaimer: {
    marginTop: spacing.lg,
    color: colors.textLo,
    fontSize: 11,
    fontWeight: fontWeights.medium,
    textAlign: 'center',
  },
});
