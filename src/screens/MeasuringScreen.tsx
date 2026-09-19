import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomSheet, PrimaryButton } from '@/components/common';
import { TimerRing } from '@/components/shower/TimerRing';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { layoutSpacing, spacing } from '@/constants/spacing';
import { fontSizes, fontWeights, lineHeights } from '@/constants/typography';
import { formatElapsedTime, useShowerTimer } from '@/hooks/useShowerTimer';

const RECOMMENDED_SECONDS = 300;

type MeasuringScreenProps = {
  onFinish: (elapsedSeconds: number) => void;
};

const PULSE_RINGS = [
  { size: 320, delay: 0, minScale: 0.85, maxScale: 1.2, minOpacity: 0.12, maxOpacity: 0.28 },
  { size: 220, delay: 700, minScale: 0.88, maxScale: 1.16, minOpacity: 0.18, maxOpacity: 0.32 },
  { size: 140, delay: 1400, minScale: 0.92, maxScale: 1.12, minOpacity: 0.22, maxOpacity: 0.38 },
] as const;

export function MeasuringScreen({ onFinish }: MeasuringScreenProps) {
  const { elapsedSeconds, setElapsedSeconds } = useShowerTimer();
  const [showTimeAlert, setShowTimeAlert] = useState(false);
  const alertShownRef = useRef(false);
  const isOver = elapsedSeconds >= RECOMMENDED_SECONDS;
  const progress = elapsedSeconds / RECOMMENDED_SECONDS;

  useEffect(() => {
    if (elapsedSeconds >= RECOMMENDED_SECONDS && !alertShownRef.current) {
      alertShownRef.current = true;
      setShowTimeAlert(true);
    }
  }, [elapsedSeconds]);

  const finish = () => {
    setShowTimeAlert(false);
    onFinish(elapsedSeconds);
  };

  const jumpNearLimit = () => {
    alertShownRef.current = false;
    setShowTimeAlert(false);
    setElapsedSeconds(295);
  };

  return (
    <View style={[styles.container, isOver && styles.containerOver]}>
      <PulseBackground isOver={isOver} />

      <View style={styles.content}>
        <Pressable accessibilityRole="button" onLongPress={jumpNearLimit} delayLongPress={700}>
          <TimerRing
            elapsedLabel={formatElapsedTime(elapsedSeconds)}
            recommendedLabel={formatElapsedTime(RECOMMENDED_SECONDS)}
            progress={progress}
            isOver={isOver}
          />
        </Pressable>

        {isOver ? (
          <View style={styles.overBadge}>
            <Text style={styles.overBadgeText}>권장 시간 초과 중</Text>
          </View>
        ) : (
          <View style={styles.measuringStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>측정 중</Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          onPress={finish}
          style={({ pressed }) => [styles.stopButton, pressed && styles.stopButtonPressed]}
        >
          <Text style={styles.stopButtonText}>샤워 종료</Text>
        </Pressable>
      </View>

      <BottomSheet visible={showTimeAlert} onClose={undefined} style={styles.alertSheet}>
        <View style={styles.alertContent}>
          <Text style={styles.alertIcon}>⏰</Text>
          <Text style={styles.alertTitle}>권장 시간이 지났습니다</Text>
          <Text style={styles.alertDescription}>
            샤워를 마무리해 주세요.{'\n'}
            긴 샤워는 피부 장벽을 약하게 만들 수 있습니다.
          </Text>
          <View style={styles.alertActions}>
            <PrimaryButton label="샤워 종료하기" onPress={finish} style={styles.alertPrimaryButton} />
            <Pressable
              accessibilityRole="button"
              onPress={() => setShowTimeAlert(false)}
              style={styles.continueButton}
            >
              <Text style={styles.continueButtonText}>계속 측정</Text>
            </Pressable>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

function PulseBackground({ isOver }: { isOver: boolean }) {
  const values = useRef(PULSE_RINGS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = values.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(PULSE_RINGS[index].delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      ),
    );

    animations.forEach((animation) => {
      animation.start();
    });

    return () => {
      animations.forEach((animation) => {
        animation.stop();
      });
      values.forEach((value) => {
        value.stopAnimation();
      });
    };
  }, [values]);

  return (
    <View pointerEvents="none" style={styles.backgroundLayer}>
      {PULSE_RINGS.map((ring, index) => {
        const value = values[index];
        const scale = value.interpolate({
          inputRange: [0, 1],
          outputRange: [ring.minScale, ring.maxScale],
        });
        const opacity = value.interpolate({
          inputRange: [0, 1],
          outputRange: [ring.minOpacity, ring.maxOpacity],
        });

        return (
          <Animated.View
            key={ring.size}
            style={[
              styles.pulseRing,
              {
                width: ring.size,
                height: ring.size,
                borderRadius: ring.size / 2,
                backgroundColor: isOver ? colors.alert : colors.primary,
                opacity,
                transform: [{ scale }],
              },
            ]}
          />
        );
      })}
      <View style={[styles.radialGlow, isOver && styles.radialGlowOver]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: colors.deepBg,
  },
  containerOver: {
    backgroundColor: '#1F1221',
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
  },
  radialGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(112,145,230,0.05)',
  },
  radialGlowOver: {
    backgroundColor: 'rgba(255,143,163,0.05)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  measuringStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.screen,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(112,145,230,0.7)',
  },
  statusText: {
    color: 'rgba(255,255,255,0.38)',
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
  },
  overBadge: {
    marginTop: spacing.screen,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,143,163,0.18)',
  },
  overBadgeText: {
    color: colors.alert,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
  },
  footer: {
    zIndex: 1,
    paddingHorizontal: layoutSpacing.screenHorizontal,
    paddingBottom: spacing.section,
  },
  stopButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.button,
    paddingVertical: 17,
    backgroundColor: 'transparent',
  },
  stopButtonPressed: {
    transform: [{ scale: 0.97 }],
  },
  stopButtonText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: fontSizes.bodyLarge,
    fontWeight: fontWeights.bold,
  },
  alertSheet: {
    paddingTop: layoutSpacing.screenHorizontal,
  },
  alertContent: {
    alignItems: 'center',
  },
  alertIcon: {
    marginBottom: spacing.xl,
    fontSize: 48,
    lineHeight: 54,
  },
  alertTitle: {
    marginBottom: spacing.xs,
    color: colors.textHi,
    fontSize: 20,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
  },
  alertDescription: {
    marginBottom: 28,
    color: colors.textMd,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.medium,
    lineHeight: fontSizes.body * lineHeights.bodyRelaxed,
    textAlign: 'center',
  },
  alertActions: {
    width: '100%',
    gap: spacing.lg,
  },
  alertPrimaryButton: {
    paddingVertical: 17,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 8,
  },
  continueButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  continueButtonText: {
    color: colors.textLo,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.semibold,
  },
});
