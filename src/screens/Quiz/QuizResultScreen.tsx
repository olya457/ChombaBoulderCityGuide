import React, { useEffect } from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ANDROID_EDGE_PADDING,
  colors,
  fontSizes,
  IS_ANDROID,
  IS_SMALL_SCREEN,
  radius,
  spacing,
} from '../../theme/theme';
import { RootStackParamList } from '../../types';
import { SettingsStorage } from '../../storage/SettingsStorage';

type Props = NativeStackScreenProps<RootStackParamList, 'QuizResult'>;

const BG_MAIN = require('../../assets/bg_main.png');

const QuizResultScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { score, total, answers, level, isPerfect, hasNextLevel } = route.params;

  const topPad = IS_ANDROID ? Math.max(insets.top, ANDROID_EDGE_PADDING) : insets.top;
  const bottomPad = IS_ANDROID
    ? Math.max(insets.bottom, ANDROID_EDGE_PADDING) + 30
    : Math.max(insets.bottom, spacing.xl) + 30;

  useEffect(() => {
    SettingsStorage.clearQuizProgress();
  }, []);

  const allDone = isPerfect && !hasNextLevel;

  let title = 'Keep Exploring';
  let messageText = 'Some answers were wrong. Try this level again to advance!';

  if (isPerfect && hasNextLevel) {
    title = 'Level Complete!';
    messageText = `Perfect score on Level ${level}! Ready for the next challenge?`;
  } else if (allDone) {
    title = 'All Levels Complete!';
    messageText = "You've mastered every level. You truly know Boulder!";
  }

  const onTryAgain = async () => {
    await SettingsStorage.clearQuizProgress();
    navigation.replace('QuizGame', { level });
  };

  const onNextLevel = async () => {
    await SettingsStorage.clearQuizProgress();
    navigation.replace('QuizGame', { level: level + 1 });
  };

  const onHome = async () => {
    await SettingsStorage.clearQuizProgress();
    navigation.navigate('Main', { screen: 'Explore' });
  };

  return (
    <ImageBackground source={BG_MAIN} style={styles.bg} resizeMode="cover">
      <View style={[styles.container, { paddingTop: topPad, paddingBottom: bottomPad }]}>
        <View style={styles.content}>
          <View style={styles.imageWrap}>
            <Text style={styles.bigEmoji}>{isPerfect ? '🏆' : '🎯'}</Text>
          </View>

          <Text style={styles.title}>{title}</Text>

          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>LEVEL {level}</Text>
          </View>

          <View style={styles.scoreBox}>
            <Text style={styles.scoreNum}>{score}</Text>
            <Text style={styles.scoreTotal}>/ {total}</Text>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.messageIcon}>💬</Text>
            <Text style={styles.messageText}>{messageText}</Text>
          </View>

          <View style={styles.answersRow}>
            {answers.map((ok, i) => (
              <View key={i} style={[styles.answerDot, ok ? styles.answerOk : styles.answerFail]}>
                <Text style={styles.answerDotText}>{ok ? '✓' : '✕'}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          {isPerfect && hasNextLevel ? (
            <Pressable onPress={onNextLevel} style={styles.primaryBtn}>
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryBtnGradient}
              >
                <Text style={styles.primaryBtnText}>Next Level →</Text>
              </LinearGradient>
            </Pressable>
          ) : !isPerfect ? (
            <Pressable onPress={onTryAgain} style={styles.primaryBtn}>
              <LinearGradient
                colors={[colors.gradientStart, colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryBtnGradient}
              >
                <Text style={styles.primaryBtnText}>Try Again</Text>
              </LinearGradient>
            </Pressable>
          ) : null}

          <Pressable style={styles.homeBtn} onPress={onHome}>
            <Text style={styles.homeText}>Home</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, paddingHorizontal: spacing.xl },
  content: { flex: 1, alignItems: 'center', paddingTop: spacing.lg },
  imageWrap: { marginTop: spacing.lg },
  bigEmoji: { fontSize: IS_SMALL_SCREEN ? 90 : 120 },
  title: {
    color: colors.text,
    fontSize: fontSizes.xxl,
    fontWeight: '800',
    marginTop: spacing.md,
    textAlign: 'center',
  },
  levelBadge: {
    backgroundColor: colors.purple,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
  },
  levelBadgeText: {
    color: colors.text,
    fontSize: fontSizes.xs,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  scoreBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: colors.chipBg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginTop: spacing.md,
  },
  scoreNum: { color: colors.primary, fontSize: fontSizes.xl, fontWeight: '800' },
  scoreTotal: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginLeft: 4,
  },
  messageBox: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    alignSelf: 'stretch',
  },
  messageIcon: { fontSize: 16, marginRight: spacing.sm, marginTop: 2 },
  messageText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * 1.45,
  },
  answersRow: { flexDirection: 'row', marginTop: spacing.lg },
  answerDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  answerOk: {
    backgroundColor: 'rgba(34,197,94,0.2)',
    borderWidth: 1,
    borderColor: colors.success,
  },
  answerFail: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  answerDotText: { color: colors.text, fontWeight: '800' },
  actions: { flexDirection: 'row', alignSelf: 'stretch' },
  primaryBtn: { flex: 1, marginRight: 8, borderRadius: 32, overflow: 'hidden', height: 56 },
  primaryBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
  },
  primaryBtnText: {
    color: colors.text,
    fontSize: fontSizes.md,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  homeBtn: {
    flex: 1,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    height: 56,
  },
  homeText: {
    color: colors.text,
    fontSize: fontSizes.md,
    fontWeight: '700',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});

export default QuizResultScreen;