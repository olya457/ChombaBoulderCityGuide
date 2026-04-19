import React, { useState } from 'react';
import { FlatList, Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ScreenWrapper from '../../components/ScreenWrapper';
import { blogData } from '../../data/blog';
import { BlogPost, RootStackParamList } from '../../types';
import { colors, fontSizes, radius, spacing } from '../../theme/theme';

const BlogScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [featuredIndex, setFeaturedIndex] = useState(0);

  const featured = blogData[featuredIndex];
  const others = blogData.filter((_, i) => i !== featuredIndex);

  const shuffleFeatured = () => {
    if (blogData.length <= 1) return;
    let next = featuredIndex;
    while (next === featuredIndex) {
      next = Math.floor(Math.random() * blogData.length);
    }
    setFeaturedIndex(next);
  };

  const open = (post: BlogPost) => navigation.navigate('BlogDetail', { postId: post.id });

  return (
    <ScreenWrapper variant="main" withTabBarSpace>
      <View style={styles.header}>
        <Text style={styles.kicker}>TRAVEL STORIES</Text>
        <Text style={styles.title}>Boulder Blog</Text>
      </View>

      <FlatList
        data={others}
        keyExtractor={i => i.id}
        ListHeaderComponent={
          <Pressable style={styles.featured} onPress={() => open(featured)}>
            <ImageBackground source={featured.cover} style={styles.featuredBg} imageStyle={styles.featuredBgImage}>
              <View style={styles.featuredTopRow}>
                <View style={styles.featuredTag}>
                  <Text style={styles.featuredTagText}>★ FEATURED</Text>
                </View>
                <Pressable
                  style={styles.shuffleBtn}
                  onPress={shuffleFeatured}
                  hitSlop={10}
                >
                  <Text style={styles.shuffleIcon}>🔀</Text>
                </Pressable>
              </View>
              <View style={styles.featuredBottom}>
                <Text style={styles.featuredTitle}>{featured.title}</Text>
                <View style={styles.featuredMeta}>
                  <Text style={styles.metaIcon}>⏱</Text>
                  <Text style={styles.metaText}>{featured.readTime}</Text>
                  <View style={styles.metaDot} />
                  <Text style={styles.metaText}>{featured.date}</Text>
                </View>
              </View>
            </ImageBackground>
          </Pressable>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => open(item)}>
            <Image source={item.cover} style={styles.rowImage} />
            <View style={styles.rowBody}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <View style={styles.rowMeta}>
                <Text style={styles.metaIcon}>⏱</Text>
                <Text style={styles.metaText}>{item.readTime}</Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, marginBottom: spacing.md },
  kicker: { color: colors.primary, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: colors.text, fontSize: fontSizes.xxl, fontWeight: '800', marginTop: 2 },
  featured: {
    marginHorizontal: spacing.xl,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  featuredBg: { height: 200, justifyContent: 'space-between', padding: spacing.md },
  featuredBgImage: { borderRadius: radius.lg },
  featuredTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredTag: {
    backgroundColor: colors.purple,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  featuredTagText: { color: colors.text, fontSize: fontSizes.xs, fontWeight: '800' },
  shuffleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shuffleIcon: { fontSize: 18 },
  featuredBottom: { backgroundColor: 'rgba(0,0,0,0.45)', padding: spacing.sm, borderRadius: radius.sm },
  featuredTitle: { color: colors.text, fontSize: fontSizes.lg, fontWeight: '800' },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  metaIcon: { color: colors.textMuted, fontSize: 12, marginRight: 4 },
  metaText: { color: colors.textMuted, fontSize: fontSizes.xs },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.textDim, marginHorizontal: 6 },
  list: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  rowImage: { width: 56, height: 56, borderRadius: radius.sm, marginRight: spacing.md },
  rowBody: { flex: 1 },
  rowTitle: { color: colors.text, fontSize: fontSizes.md, fontWeight: '700' },
  rowMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  arrow: { color: colors.textDim, fontSize: 20, marginLeft: 6 },
});

export default BlogScreen;