import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';

type IconCircleProps = {
  icon: ReactNode;
  size?: number;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
};

export function IconCircle({
  icon,
  size = 56,
  backgroundColor = colors.primary,
  style,
}: IconCircleProps) {
  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size >= 56 ? radius.button : radius.pill,
          backgroundColor,
        },
        style,
      ]}
    >
      {icon}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
