import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/constants/colors';
import { layoutSpacing } from '@/constants/spacing';
import { fontSizes, fontWeights } from '@/constants/typography';

type ScreenScaffoldProps = {
  title: string;
  children?: ReactNode;
};

export function ScreenScaffold({ title, children }: ScreenScaffoldProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>AquaLog MVP</Text>
        <Text style={styles.title}>{title}</Text>
        {children}
      </View>
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
    justifyContent: 'center',
    paddingHorizontal: layoutSpacing.screenHorizontal,
  },
  eyebrow: {
    color: colors.textLo,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.bold,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: {
    color: colors.textHi,
    fontSize: fontSizes.title,
    fontWeight: fontWeights.bold,
  },
});
