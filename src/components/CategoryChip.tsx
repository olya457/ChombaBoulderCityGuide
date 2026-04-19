import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Category } from '../types';
import { colors, fontSizes, radius } from '../theme/theme';

interface Props {
  category: Category;
  active: boolean;
  onPress: () => void;
}

const CategoryChip: React.FC<Props> = ({ category, active, onPress }) => {
  const isAll = category.id === 'all';

  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      {active && isAll ? (
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconWrap}
        >
          <Text style={styles.emoji}>{category.emoji}</Text>
        </LinearGradient>
      ) : (
        <View style={[styles.iconWrap, active ? styles.iconWrapActive : styles.iconWrapInactive]}>
          <Text style={styles.emoji}>{category.emoji}</Text>
        </View>
      )}
      <Text style={[styles.title, active && styles.titleActive]} numberOfLines={1}>
        {category.title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginRight: 12, width: 64 },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconWrapActive: { backgroundColor: colors.surfaceActive, borderWidth: 1, borderColor: colors.primary },
  iconWrapInactive: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.borderSoft },
  emoji: { fontSize: 22 },
  title: { fontSize: fontSizes.xs, color: colors.textMuted, fontWeight: '700', letterSpacing: 0.5 },
  titleActive: { color: colors.text },
});

export default CategoryChip;