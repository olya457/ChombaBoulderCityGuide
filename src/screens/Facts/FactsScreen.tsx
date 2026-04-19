import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ScreenWrapper from '../../components/ScreenWrapper';
import { factCategories, factsData } from '../../data/facts';
import { Fact, FactCategory } from '../../types';
import { colors, fontSizes, IS_SMALL_SCREEN, radius, spacing } from '../../theme/theme';

const FactsScreen: React.FC = () => {
  const [active, setActive] = useState<FactCategory>('intelligence');

  const filtered = useMemo(() => {
    return factsData.filter(f => f.category === active);
  }, [active]);

  const renderFact = ({ item }: { item: Fact }) => (
    <View style={styles.card}>
      <View style={styles.cardTopLine} />
      <View style={styles.cardRow}>
        <View style={styles.cardIconWrap}>
          <Text style={styles.cardIconEmoji}>{item.icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardText}>{item.description}</Text>
          <Pressable style={styles.shareBtn} onPress={() => Share.share({ message: item.title })}>
            <Text style={styles.shareEmoji}>🔗</Text>
            <Text style={styles.shareText}>SHARE</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  return (
    <ScreenWrapper variant="main" withTabBarSpace>
      <View style={styles.header}>
        <Text style={styles.kicker}>DISCOVER BOULDER</Text>
        <Text style={styles.title}>Fun Facts</Text>
      </View>

      <View style={styles.catRow}>
        {factCategories.map(c => {
          const isActive = active === c.id;
          return (
            <Pressable key={c.id} style={styles.catBtnWrap} onPress={() => setActive(c.id)}>
              {isActive ? (
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.catBtn}
                >
                  <Text style={styles.catEmoji}>{c.emoji}</Text>
                  <Text style={styles.catText} numberOfLines={1}>{c.title}</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.catBtn, styles.catBtnInactive]}>
                  <Text style={styles.catEmoji}>{c.emoji}</Text>
                  <Text style={[styles.catText, styles.catTextInactive]} numberOfLines={1}>
                    {c.title}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.countLine}>
        <Text style={styles.countNum}>{filtered.length}</Text> facts in{' '}
        {active.charAt(0).toUpperCase() + active.slice(1)}
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderFact}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    marginBottom: spacing.md,
  },
  kicker: {
    color: colors.primary,
    fontSize: fontSizes.xs,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {
    color: colors.text,
    fontSize: fontSizes.xxl,
    fontWeight: '800',
    marginTop: 2,
  },
  catRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  catBtnWrap: { flex: 1, marginHorizontal: 3 },
  catBtn: {
    alignItems: 'center',
    paddingVertical: IS_SMALL_SCREEN ? spacing.sm : spacing.md,
    paddingHorizontal: 4,
    borderRadius: radius.md,
  },
  catBtnInactive: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  catEmoji: { fontSize: IS_SMALL_SCREEN ? 18 : 22, marginBottom: 4 },
  catText: {
    color: colors.text,
    fontSize: IS_SMALL_SCREEN ? 9 : fontSizes.xs,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  catTextInactive: { color: colors.textMuted },
  countLine: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  countNum: { color: colors.primary, fontWeight: '800' },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: IS_SMALL_SCREEN ? spacing.sm : spacing.md,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  cardTopLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.primary,
  },
  cardRow: { flexDirection: 'row' },
  cardIconWrap: {
    width: IS_SMALL_SCREEN ? 36 : 40,
    height: IS_SMALL_SCREEN ? 36 : 40,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardIconEmoji: { fontSize: IS_SMALL_SCREEN ? 18 : 22 },
  cardTitle: {
    color: colors.text,
    fontSize: fontSizes.md,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardText: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    lineHeight: fontSizes.sm * 1.5,
  },
  shareBtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.purple,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: spacing.sm,
  },
  shareEmoji: { fontSize: 10, marginRight: 4 },
  shareText: {
    color: colors.purple,
    fontSize: fontSizes.xs,
    fontWeight: '800',
  },
});

export default FactsScreen;