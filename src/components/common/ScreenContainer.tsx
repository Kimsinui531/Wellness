import type { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type ScrollViewProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { layoutSpacing } from '@/constants/spacing';

type ScreenContainerBaseProps = {
  children: ReactNode;
  padded?: boolean;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

type ScreenContainerProps = ScreenContainerBaseProps &
  Omit<ViewProps, 'style'> &
  Omit<ScrollViewProps, 'style' | 'contentContainerStyle'>;

export function ScreenContainer({
  children,
  padded = false,
  scroll = false,
  style,
  contentStyle,
  ...rest
}: ScreenContainerProps) {
  const content = [
    styles.content,
    padded && styles.padded,
    contentStyle,
  ];

  return (
    <SafeAreaView style={[styles.safeArea, style]}>
      {scroll ? (
        <ScrollView
          {...rest}
          contentContainerStyle={content}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View {...rest} style={content}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: layoutSpacing.screenHorizontal,
  },
});
