import React from 'react';
import { ImageBackground, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenWrapper from '../../components/ScreenWrapper';
import { blogData } from '../../data/blog';
import { RootStackParamList } from '../../types';
import { colors, fontSizes, radius, spacing } from '../../theme/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'BlogDetail'>;

const BlogDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const post = blogData.find(p => p.id === route.params.postId);
  if (!post) return null;

  const onShare = () => Share.share({ message: post.title });

  return (
    <ScreenWrapper variant="main" contentPaddingTop={false}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ImageBackground source={post.cover} style={styles.cover} imageStyle={styles.coverImg}>
          <View style={styles.topRow}>
            <Pressable style={styles.roundBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.roundIcon}>‹</Text>
              <Text style={styles.backLabel}>Back</Text>
            </Pressable>
            <Pressable style={styles.roundBtn} onPress={onShare}>
              <Text style={styles.roundIcon}>🔗</Text>
            </Pressable>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{post.tag}</Text>
          </View>
        </ImageBackground>

        <View style={styles.body}>
          <Text style={styles.title}>{post.title}</Text>

          <View style={styles.quoteBox}>
            <Text style={styles.quote}>{post.intro}</Text>
          </View>

          {post.body.map((p, i) => (
            <Text key={i} style={styles.paragraph}>{p}</Text>
          ))}

          <Pressable style={styles.shareBtn} onPress={onShare}>
            <Text style={styles.shareIcon}>🔗</Text>
            <Text style={styles.shareText}>Share this article</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingBottom: spacing.xxl },
  cover: { height: 240, justifyContent: 'space-between', padding: spacing.md },
  coverImg: { resizeMode: 'cover' },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xxl + 20,
  },
  roundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  roundIcon: { color: colors.text, fontSize: 16 },
  backLabel: { color: colors.text, fontSize: fontSizes.sm, marginLeft: 6, fontWeight: '600' },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.purple,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  tagText: { color: colors.text, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 0.5 },
  body: { padding: spacing.xl },
  title: { color: colors.text, fontSize: fontSizes.xl, fontWeight: '800', marginBottom: spacing.lg, textAlign: 'center' },
  quoteBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    marginBottom: spacing.lg,
  },
  quote: { color: colors.text, fontSize: fontSizes.md, fontStyle: 'italic', lineHeight: fontSizes.md * 1.5 },
  paragraph: { color: colors.textMuted, fontSize: fontSizes.md, lineHeight: fontSizes.md * 1.6, marginBottom: spacing.md },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.purple,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  shareIcon: { fontSize: 16, marginRight: 8 },
  shareText: { color: colors.purple, fontSize: fontSizes.md, fontWeight: '700' },
});

export default BlogDetailScreen;