import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontSizes, fontWeights } from '@/constants/typography';
import { formatElapsedTime } from '@/hooks/useShowerTimer';

type ResultSummaryCardProps = {
  elapsedSeconds: number;
  recommendedSeconds: number;
};

export function ResultSummaryCard({
  elapsedSeconds,
  recommendedSeconds,
}: ResultSummaryCardProps) {
  const isOver = elapsedSeconds > recommendedSeconds;
  const diffSeconds = Math.abs(elapsedSeconds - recommendedSeconds);

  return (
    <View style={[styles.card, isOver ? styles.cardOver : styles.cardGood]}>
      <Text style={[styles.eyebrow, isOver ? styles.eyebrowOver : styles.eyebrowGood]}>
        {isOver ? '권장 시간보다 길었어요' : '오늘도 피부를 지켜냈어요'}
      </Text>
      <View style={styles.row}>
        <View>
          <Text style={styles.elapsed}>{formatElapsedTime(elapsedSeconds)}</Text>
          <Text style={styles.recommended}>
            권장 시간 {formatElapsedTime(recommendedSeconds)}
          </Text>
        </View>
        <View style={[styles.badge, isOver ? styles.badgeOver : styles.badgeGood]}>
          <Text style={[styles.badgeText, isOver ? styles.badgeTextOver : styles.badgeTextGood]}>
            {isOver ? `+${formatElapsedTime(diffSeconds)} 초과` : `${formatElapsedTime(diffSeconds)} 여유`}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.xxl,
    borderWidth: 1,
    borderRadius: radius.largeCard,
  },
  cardGood: {
    borderColor: 'rgba(112,145,230,0.15)',
    backgroundColor: 'rgba(112,145,230,0.1)',
  },
  cardOver: {
    borderColor: 'rgba(255,143,163,0.2)',
    backgroundColor: 'rgba(255,143,163,0.12)',
  },
  eyebrow: {
    marginBottom: spacing.xs,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  eyebrowGood: {
    color: colors.primary,
  },
  eyebrowOver: {
    color: colors.alert,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  elapsed: {
    color: colors.textHi,
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    lineHeight: fontSizes.display,
  },
  recommended: {
    marginTop: 6,
    color: colors.textLo,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
  },
  badge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  badgeGood: {
    backgroundColor: colors.primaryDim,
  },
  badgeOver: {
    backgroundColor: colors.alertDim,
  },
  badgeText: {
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
  },
  badgeTextGood: {
    color: colors.primary,
  },
  badgeTextOver: {
    color: colors.alert,
  },
});
