import React, { useEffect, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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
import { QUESTIONS_PER_LEVEL, TOTAL_LEVELS } from '../../data/quiz';

const BG_MAIN = require('../../assets/bg_main.png');

const intros = [
  {
    title: 'Boulder Quiz\nChallenge',
    message:
      "Hey! I'm Alex, your Boulder guide. Ready to test how well you know this incredible city? Answer 5 questions per level — get them all right to unlock the next one!",
    button: 'Tell Me the Rules',
  },
  {
    title: 'Quiz\nRules',
    message:
      "Each question has 4 answers and only ONE is correct. You have 15 seconds per question. Answer all 5 questions in a level correctly to advance — one wrong answer and you'll retry the level.",
    button: 'Okay',
  },
  {
    title: 'Are You\nReady?',
    message: `The quiz has ${TOTAL_LEVELS} levels with ${QUESTIONS_PER_LEVEL} questions each. Perfect a level to unlock the next. Can you master them all?`,
    button: 'Start',
  },
];

const QuizIntroScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [hasProgress, setHasProgress] = useState(false);
  const [progressInfo, setProgressInfo] = useState<{
    level: number;
    indexInLevel: number;
    score: number;
  } | null>(null);

  const topPad = IS_ANDROID ? Math.max(insets.top, ANDROID_EDGE_PADDING) : insets.top;
  const bottomPad = IS_ANDROID
    ? Math.max(insets.bottom, ANDROID_EDGE_PADDING) + 110
    : Math.max(insets.bottom, spacing.xl) + 110;

  const loadProgress = async () => {
    const saved = await SettingsStorage.getQuizProgress();
    if (saved && (saved.indexInLevel > 0 || saved.level > 1)) {
      setHasProgress(true);
      setProgressInfo({
        level: saved.level,
        indexInLevel: saved.indexInLevel,
        score: saved.score,
      });
    } else {
      setHasProgress(false);
      setProgressInfo(null);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadProgress();
      setStep(0);
    }, [])
  );

  const current = intros[step];

  const onNext = () => {
    if (step < intros.length - 1) {
      setStep(s => s + 1);
    } else {
      navigation.navigate('QuizGame', { level: 1 });
    }
  };

  const onContinue = () => {
    if (progressInfo) {
      navigation.navigate('QuizGame', { level: progressInfo.level });
    }
  };

  const onRestart = async () => {
    await SettingsStorage.clearQuizProgress();
    setHasProgress(false);
    setProgressInfo(null);
    setStep(0);
  };

  if (hasProgress && progressInfo) {
    return (
      <ImageBackground source={BG_MAIN} style={styles.bg} resizeMode="cover">
        <View style={[styles.container, { paddingTop: topPad, paddingBottom: bottomPad }]}>
          <View style={styles.topRow}>
            <View style={styles.guideIconWrap}>
              <Text style={styles.guideIcon}>🧭</Text>
            </View>
            <View>
              <Text style={styles.guideKicker}>QUIZ GUIDE</Text>
              <Text style={styles.guideName}>Alex</Text>
            </View>
          </View>

          <View style={styles.resumeContent}>
            <Text style={styles.bigEmoji}>🎯</Text>
            <Text style={styles.title}>Continue Quiz?</Text>

            <View style={styles.progressBox}>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Level</Text>
                <Text style={styles.progressValue}>
                  {progressInfo.level} / {TOTAL_LEVELS}
                </Text>
              </View>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Question</Text>
                <Text style={styles.progressValue}>
                  {progressInfo.indexInLevel + 1} of {QUESTIONS_PER_LEVEL}
                </Text>
              </View>
              <View style={styles.progressRow}>
                <Text style={styles.progressLabel}>Current Score</Text>
                <Text style={styles.progressValue}>🏆 {progressInfo.score}</Text>
              </View>
            </View>

            <View style={styles.messageBox}>
              <Text style={styles.messageIcon}>💬</Text>
              <Text style={styles.messageText}>
                You have an unfinished quiz. Continue where you left off or start over?
              </Text>
            </View>
          </View>

          <Pressable onPress={onContinue} style={styles.button}>
            <LinearGradient
              colors={[colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Continue Quiz</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={onRestart} style={styles.restartBtn}>
            <Text style={styles.restartText}>Start Over</Text>
          </Pressable>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BG_MAIN} style={styles.bg} resizeMode="cover">
      <View style={[styles.container, { paddingTop: topPad, paddingBottom: bottomPad }]}>
        <View style={styles.topRow}>
          <View style={styles.guideIconWrap}>
            <Text style={styles.guideIcon}>🧭</Text>
          </View>
          <View>
            <Text style={styles.guideKicker}>QUIZ GUIDE</Text>
            <Text style={styles.guideName}>Alex</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.imageWrap}>
            <Text style={styles.bigEmoji}>🏆</Text>
          </View>

          <View style={styles.tag}>
            <Text style={styles.tagText}>👋 HELLO, EXPLORER!</Text>
          </View>

          <Text style={styles.title}>{current.title}</Text>

          <View style={styles.messageBox}>
            <Text style={styles.messageIcon}>💬</Text>
            <Text style={styles.messageText}>{current.message}</Text>
          </View>

          <View style={styles.dots}>
            {intros.map((_, i) => (
              <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
            ))}
          </View>
        </ScrollView>

        <Pressable onPress={onNext} style={styles.button}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>{current.button}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, paddingHorizontal: spacing.xl },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  guideIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  guideIcon: { fontSize: 18 },
  guideKicker: {
    color: colors.primary,
    fontSize: fontSizes.xs,
    fontWeight: '800',
    letterSpacing: 1,
  },
  guideName: { color: colors.text, fontSize: fontSizes.md, fontWeight: '700' },
  scrollContent: { flexGrow: 1, paddingBottom: 0 },
  resumeContent: { flex: 1, alignItems: 'center', paddingTop: spacing.lg },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: IS_SMALL_SCREEN ? spacing.sm : spacing.md,
  },
  bigEmoji: { fontSize: IS_SMALL_SCREEN ? 90 : 120, marginBottom: spacing.lg },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.chipBg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: spacing.md,
  },
  tagText: { color: colors.primary, fontSize: fontSizes.xs, fontWeight: '800' },
  title: {
    color: colors.text,
    fontSize: fontSizes.xxl,
    fontWeight: '800',
    lineHeight: fontSizes.xxl * 1.15,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  progressBox: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  progressLabel: { color: colors.textMuted, fontSize: fontSizes.sm, fontWeight: '600' },
  progressValue: { color: colors.primary, fontSize: fontSizes.md, fontWeight: '800' },
  messageBox: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    alignSelf: 'stretch',
  },
  messageIcon: { fontSize: 16, marginRight: spacing.sm, marginTop: 2 },
  messageText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * 1.45,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: spacing.sm },
  dot: {
    width: 8,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginHorizontal: 3,
  },
  dotActive: { width: 24, backgroundColor: colors.primary },
  button: {
    marginTop: spacing.sm,
    borderRadius: 32,
    overflow: 'hidden',
    height: 56,
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
  },
  buttonText: {
    color: colors.text,
    fontSize: fontSizes.md,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  restartBtn: {
    marginTop: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  restartText: {
    color: colors.textMuted,
    fontSize: fontSizes.md,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default QuizIntroScreen;