import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { fontSizes, fontWeights } from '@/constants/typography';

type TimerRingProps = {
  elapsedLabel: string;
  recommendedLabel: string;
  progress: number;
  isOver: boolean;
};

const SIZE = 224;
const STROKE_WIDTH = 8;
const RADIUS = SIZE / 2;

export function TimerRing({
  elapsedLabel,
  recommendedLabel,
  progress,
  isOver,
}: TimerRingProps) {
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const rotation = clampedProgress * 360;
  const progressColor = isOver ? colors.alert : colors.primary;

  return (
    <View style={styles.container}>
      <View style={styles.track} />

      <View style={styles.leftHalf}>
        <View
          style={[
            styles.progressHalf,
            styles.leftProgress,
            {
              borderColor: progressColor,
              transform: [{ rotateZ: `${Math.min(rotation, 180)}deg` }],
            },
          ]}
        />
      </View>

      {rotation > 180 && (
        <View style={styles.rightHalf}>
          <View
            style={[
              styles.progressHalf,
              styles.rightProgress,
              {
                borderColor: progressColor,
                transform: [{ rotateZ: `${rotation - 180}deg` }],
              },
            ]}
          />
        </View>
      )}

      <View style={styles.labelWrap}>
        <Text style={[styles.elapsed, isOver && styles.elapsedOver]}>{elapsedLabel}</Text>
        <Text style={styles.recommended}>권장 {recommendedLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  track: {
    position: 'absolute',
    width: SIZE - STROKE_WIDTH,
    height: SIZE - STROKE_WIDTH,
    borderWidth: STROKE_WIDTH,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: RADIUS,
  },
  leftHalf: {
    position: 'absolute',
    left: 0,
    width: RADIUS,
    height: SIZE,
    overflow: 'hidden',
  },
  rightHalf: {
    position: 'absolute',
    right: 0,
    width: RADIUS,
    height: SIZE,
    overflow: 'hidden',
  },
  progressHalf: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderWidth: STROKE_WIDTH,
    borderRadius: RADIUS,
  },
  leftProgress: {
    left: 0,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  rightProgress: {
    right: 0,
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
  },
  labelWrap: {
    alignItems: 'center',
  },
  elapsed: {
    color: colors.surface,
    fontSize: fontSizes.timer,
    fontWeight: fontWeights.bold,
    fontVariant: ['tabular-nums'],
    lineHeight: fontSizes.timer,
  },
  elapsedOver: {
    color: colors.alert,
  },
  recommended: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.38)',
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
  },
});
