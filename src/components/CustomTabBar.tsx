import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useAppInsets } from '../hooks/useInsets';
import { colors, fontSizes, radius, TAB_BAR_BOTTOM_OFFSET } from '../theme/theme';

const TAB_DATA: Record<string, { label: string; emoji: string }> = {
  Explore: { label: 'EXPLORE', emoji: '📍' },
  Saved: { label: 'SAVED', emoji: '🔖' },
  Map: { label: 'MAP', emoji: '🗺️' },
  Blog: { label: 'BLOG', emoji: '📖' },
  Facts: { label: 'FACTS', emoji: '✨' },
  Quiz: { label: 'QUIZ', emoji: '🏆' },
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const insets = useAppInsets();
  const bottom = Math.max(insets.bottom, TAB_BAR_BOTTOM_OFFSET);

  return (
    <View pointerEvents="box-none" style={[styles.container, { bottom }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const data = TAB_DATA[route.name];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable key={route.key} onPress={onPress} hitSlop={6} style={styles.item}>
              <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <Text style={styles.emoji}>{data.emoji}</Text>
              </View>
              <Text style={[styles.label, { color: focused ? colors.primary : colors.textMuted }]}>
                {data.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 12, right: 12, alignItems: 'center' },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.tabBarBg,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 6,
    width: '100%',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: colors.surfaceActive },
  emoji: { fontSize: 20 },
  label: { fontSize: fontSizes.xs, fontWeight: '700', marginTop: 2, letterSpacing: 0.3 },
});

export default CustomTabBar;