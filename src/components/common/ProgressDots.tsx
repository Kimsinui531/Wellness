import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';

type ProgressDotsProps = {
  total?: number;
  current: number;
};

export function ProgressDots({ total = 4, current }: ProgressDotsProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => {
        const active = index <= current;
        const currentDot = index === current;

        return (
          <View
            key={index}
            style={[
              styles.dot,
              currentDot && styles.currentDot,
              { backgroundColor: active ? colors.primary : colors.border },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 4,
    borderRadius: radius.pill,
  },
  currentDot: {
    width: 20,
  },
});
