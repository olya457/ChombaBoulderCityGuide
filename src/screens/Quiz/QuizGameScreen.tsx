import React, { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  QUESTIONS_PER_LEVEL,
  QUIZ_TIME_PER_QUESTION,
  TOTAL_LEVELS,
  quizQuestions,
} from '../../data/quiz';
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

const BG_MAIN = require('../../assets/bg_main.png');
const AUTO_ADVANCE_DELAY = 1500;

type GameRoute = RouteProp<RootStackParamList, 'QuizGame'>;

const QuizGameScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<GameRoute>();
  const insets = useSafeAreaInsets();

  const paramsLevel = route.params?.level;

  const [level, setLevel] = useState(paramsLevel ?? 1);
  const [indexInLevel, setIndexInLevel] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_PER_QUESTION);
  const [loaded, setLoaded] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const levelStartIndex = (level - 1) * QUESTIONS_PER_LEVEL;
  const globalIndex = levelStartIndex + indexInLevel;
  const q = quizQuestions[globalIndex];
  const isLastInLevel = indexInLevel === QUESTIONS_PER_LEVEL - 1;
  const locked = selected !== null;
  const correct = locked && q && selected === q.correctIndex;

  const topPad = IS_ANDROID ? Math.max(insets.top, ANDROID_EDGE_PADDING) : insets.top;
  const bottomPad = IS_ANDROID
    ? Math.max(insets.bottom, ANDROID_EDGE_PADDING) + 30
    : Math.max(insets.bottom, spacing.xl) + 30;

  useEffect(() => {
    (async () => {
      const saved = await SettingsStorage.getQuizProgress();
      if (paramsLevel && paramsLevel !== saved?.level) {
        setLevel(paramsLevel);
        setIndexInLevel(0);
        setScore(0);
        setAnswers([]);
      } else if (
        saved &&
        saved.indexInLevel >= 0 &&
        saved.level >= 1 &&
        saved.level <= TOTAL_LEVELS
      ) {
        setLevel(saved.level);
        setIndexInLevel(saved.indexInLevel);
        setScore(saved.score);
        setAnswers(saved.answers);
      }
      setLoaded(true);
    })();
  }, [paramsLevel]);

  useEffect(() => {
    if (!loaded || !q) return;
    setTimeLeft(QUIZ_TIME_PER_QUESTION);
    setSelected(null);
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: QUIZ_TIME_PER_QUESTION * 1000,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          setSelected(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    };
  }, [indexInLevel, level, loaded, progress, q]);

  const finishLevel = async (finalScore: number, finalAnswers: boolean[]) => {
    const isPerfect = finalScore === QUESTIONS_PER_LEVEL;
    const hasNextLevel = level < TOTAL_LEVELS;
    await SettingsStorage.clearQuizProgress();

    const bestSaved = await SettingsStorage.getBestScore();
    if (finalScore > bestSaved) await SettingsStorage.setBestScore(finalScore);

    navigation.replace('QuizResult', {
      score: finalScore,
      total: QUESTIONS_PER_LEVEL,
      answers: finalAnswers,
      level,
      isPerfect,
      hasNextLevel,
    });
  };

  const goNextQuestion = async (nextScore: number, nextAnswers: boolean[]) => {
    if (isLastInLevel) {
      await finishLevel(nextScore, nextAnswers);
    } else {
      const nextIdx = indexInLevel + 1;
      await SettingsStorage.setQuizProgress({
        level,
        indexInLevel: nextIdx,
        score: nextScore,
        answers: nextAnswers,
      });
      setIndexInLevel(nextIdx);
    }
  };

  const onSelect = (i: number) => {
    if (locked || !q) return;
    setSelected(i);
    const isCorrect = i === q.correctIndex;
    const nextScore = isCorrect ? score + 1 : score;
    const nextAnswers = [...answers, isCorrect];
    if (isCorrect) setScore(nextScore);
    setAnswers(nextAnswers);

    if (isCorrect) {
      autoAdvanceRef.current = setTimeout(() => {
        goNextQuestion(nextScore, nextAnswers);
      }, AUTO_ADVANCE_DELAY);
    }
  };

  const onNext = () => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    goNextQuestion(score, answers);
  };

  const onQuit = async () => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    if (indexInLevel > 0 || answers.length > 0 || level > 1) {
      await SettingsStorage.setQuizProgress({ level, indexInLevel, score, answers });
    }
    navigation.goBack();
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (!loaded || !q) {
    return (
      <ImageBackground source={BG_MAIN} style={styles.bg} resizeMode="cover">
        <View style={styles.container} />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={BG_MAIN} style={styles.bg} resizeMode="cover">
      <View style={[styles.container, { paddingTop: topPad, paddingBottom: bottomPad }]}>
        <View style={styles.topRow}>
          <Pressable onPress={onQuit} hitSlop={10}>
            <Text style={styles.quit}>‹ Quit</Text>
          </Pressable>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.counter}>
            {indexInLevel + 1}/{QUESTIONS_PER_LEVEL}
          </Text>
        </View>

        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>
            LEVEL {level} / {TOTAL_LEVELS}
          </Text>
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>TIME REMAINING</Text>
          <Text style={styles.timeValue}>{timeLeft}s</Text>
        </View>

        <View style={styles.scoreBadge}>
          <Text style={styles.scoreText}>🏆 Score: {score}</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.qCard}>
            <View style={styles.qHeader}>
              <View style={styles.qNum}>
                <Text style={styles.qNumText}>{indexInLevel + 1}</Text>
              </View>
              <Text style={styles.qLabel}>QUESTION {indexInLevel + 1}</Text>
            </View>
            <Text style={styles.qText}>{q.question}</Text>

            <View style={styles.options}>
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                const isCorrectOpt = locked && i === q.correctIndex;
                const isWrongOpt = locked && isSelected && i !== q.correctIndex;
                return (
                  <Pressable
                    key={i}
                    style={[
                      styles.option,
                      isCorrectOpt && styles.optionCorrect,
                      isWrongOpt && styles.optionWrong,
                    ]}
                    onPress={() => onSelect(i)}
                    disabled={locked}
                  >
                    <Text style={styles.optionLetter}>{String.fromCharCode(65 + i)}</Text>
                    <Text style={styles.optionText}>{opt}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {locked ? (
          <View style={styles.feedbackWrap}>
            <View style={[styles.feedback, correct ? styles.feedbackRight : styles.feedbackWrong]}>
              <Text style={styles.feedbackText}>{correct ? 'Right!' : 'Not quite!'}</Text>
            </View>

            {!correct ? (
              <Pressable onPress={onNext} style={styles.nextBtn}>
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.nextBtnGradient}
                >
                  <Text style={styles.nextBtnText}>
                    {isLastInLevel ? 'Finish Level' : 'Next Question →'}
                  </Text>
                </LinearGradient>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  container: { flex: 1, paddingHorizontal: spacing.xl },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  quit: { color: colors.text, fontSize: fontSizes.md, fontWeight: '600' },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 2,
    marginHorizontal: spacing.md,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.purple },
  counter: { color: colors.text, fontSize: fontSizes.sm, fontWeight: '700' },
  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.chipBg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: spacing.sm,
  },
  levelText: {
    color: colors.primary,
    fontSize: fontSizes.xs,
    fontWeight: '800',
    letterSpacing: 1,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  timeLabel: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  timeValue: { color: colors.text, fontSize: fontSizes.sm, fontWeight: '800' },
  scoreBadge: { alignSelf: 'flex-start', marginBottom: spacing.md },
  scoreText: { color: colors.text, fontSize: fontSizes.sm, fontWeight: '700' },
  scrollContent: { flexGrow: 1, paddingBottom: spacing.sm },
  qCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: IS_SMALL_SCREEN ? spacing.md : spacing.lg,
  },
  qHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  qNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  qNumText: { color: colors.text, fontSize: fontSizes.xs, fontWeight: '800' },
  qLabel: {
    color: colors.primary,
    fontSize: fontSizes.xs,
    fontWeight: '800',
    letterSpacing: 1,
  },
  qText: {
    color: colors.text,
    fontSize: IS_SMALL_SCREEN ? fontSizes.md : fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacing.md,
    lineHeight: (IS_SMALL_SCREEN ? fontSizes.md : fontSizes.lg) * 1.35,
  },
  options: {},
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    padding: IS_SMALL_SCREEN ? spacing.sm : spacing.md,
    marginBottom: spacing.sm,
  },
  optionCorrect: {
    borderColor: colors.success,
    backgroundColor: 'rgba(34,197,94,0.12)',
  },
  optionWrong: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(239,68,68,0.12)',
  },
  optionLetter: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    fontWeight: '800',
    width: 22,
  },
  optionText: { color: colors.text, fontSize: fontSizes.md, flex: 1 },
  feedbackWrap: { marginTop: spacing.sm },
  feedback: {
    paddingVertical: IS_SMALL_SCREEN ? spacing.sm : spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  feedbackRight: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1,
    borderColor: colors.success,
  },
  feedbackWrong: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  feedbackText: {
    color: colors.text,
    fontSize: IS_SMALL_SCREEN ? fontSizes.lg : fontSizes.xl,
    fontWeight: '800',
  },
  nextBtn: { borderRadius: 32, overflow: 'hidden', height: 56 },
  nextBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
  },
  nextBtnText: {
    color: colors.text,
    fontSize: fontSizes.md,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
});

export default QuizGameScreen;