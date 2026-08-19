import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/colors';
import { radius } from '@/constants/radius';
import { spacing } from '@/constants/spacing';
import { fontSizes, fontWeights } from '@/constants/typography';

export type CareRecommendation = {
  key: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  color: string;
  sheetTitle: string;
  sheetDescription: string;
  cta: string;
};

type CareRecommendationCardProps = {
  item: CareRecommendation;
  onPress: () => void;
};

export function CareRecommendationCard({ item, onPress }: CareRecommendationCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.iconBox, { backgroundColor: `${item.color}18` }]}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={[styles.badge, { backgroundColor: item.color }]}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    padding: spacing.xl,
    borderRadius: radius.card,
    backgroundColor: colors.surface,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 2,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  iconBox: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  icon: {
    fontSize: 20,
    lineHeight: 24,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: 2,
  },
  title: {
    color: colors.textHi,
    fontSize: fontSizes.body,
    fontWeight: fontWeights.bold,
  },
  badge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgeText: {
    color: colors.surface,
    fontSize: fontSizes.badge,
    fontWeight: fontWeights.bold,
  },
  subtitle: {
    color: colors.textMd,
    fontSize: fontSizes.caption,
    fontWeight: fontWeights.semibold,
  },
  description: {
    marginTop: 2,
    color: colors.textLo,
    fontSize: 11,
    fontWeight: fontWeights.medium,
  },
  chevron: {
    color: colors.textLo,
    fontSize: 24,
    lineHeight: 28,
  },
});
