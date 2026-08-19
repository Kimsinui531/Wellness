import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, type GestureResponderEvent } from 'react-native';

import { IconCircle } from '@/components/common';
import { colors } from '@/constants/colors';

type ListeningIndicatorProps = {
  onPress?: (event: GestureResponderEvent) => void;
};

const RINGS = [
  { size: 192, delay: 0 },
  { size: 144, delay: 500 },
  { size: 96, delay: 1000 },
] as const;

export function ListeningIndicator({ onPress }: ListeningIndicatorProps) {
  const ringProgress = useRef(RINGS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = ringProgress.map((progress, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(RINGS[index].delay),
          Animated.timing(progress, {
            toValue: 1,
            duration: 1750,
            useNativeDriver: true,
          }),
          Animated.timing(progress, {
            toValue: 0,
            duration: 1750,
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
      ringProgress.forEach((progress) => {
        progress.stopAnimation();
      });
    };
  }, [ringProgress]);

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.container}>
      {RINGS.map((ring, index) => {
        const progress = ringProgress[index];
        const scale = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.88, 1.08],
        });
        const opacity = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0.6, 1],
        });

        return (
          <Animated.View
            key={ring.size}
            style={[
              styles.ring,
              {
                width: ring.size,
                height: ring.size,
                borderRadius: ring.size / 2,
                opacity,
                transform: [{ scale }],
              },
            ]}
          />
        );
      })}

      <IconCircle
        size={56}
        backgroundColor={colors.primary}
        style={styles.micCircle}
        icon={<Text style={styles.micIcon}>🎙</Text>}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 192,
    height: 192,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    backgroundColor: colors.primaryDim,
  },
  micCircle: {
    borderRadius: 28,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  micIcon: {
    color: colors.surface,
    fontSize: 22,
    lineHeight: 26,
  },
});
