import React, { useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { onboardingData } from '../../data/onboarding';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const BG_MAIN = require('../../assets/bg_main.png');

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const slide = onboardingData[index];
  const isLast = index === onboardingData.length - 1;

  const topPad = IS_ANDROID ? Math.max(insets.top, ANDROID_EDGE_PADDING) : insets.top;
  const bottomPad = IS_ANDROID
    ? Math.max(insets.bottom, ANDROID_EDGE_PADDING) + 30
    : Math.max(insets.bottom, spacing.xl) + 30;

  const finish = async () => {
    await SettingsStorage.setOnboardingCompleted(true);
    navigation.replace('Main', { screen: 'Explore' });
  };

  const onNext = () => {
    if (isLast) finish();
    else setIndex(i => i + 1);
  };

  const onSkip = () => finish();

  return (
    <ImageBackground source={BG_MAIN} style={styles.bg} resizeMode="cover">
      <View style={[styles.container, { paddingTop: topPad, paddingBottom: bottomPad }]}>
        <View style={[styles.topRow, IS_ANDROID && styles.topRowAndroid]}>
          <View style={styles.guideRow}>
            <View style={styles.guideIconWrap}>
              <Text style={styles.guideIcon}>🧭</Text>
            </View>
            <View>
              <Text style={styles.guideKicker}>YOUR GUIDE</Text>
              <Text style={styles.guideName}>Alex</Text>
            </View>
          </View>
          <Pressable hitSlop={10} onPress={onSkip}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.imageWrap}>
            <Image source={slide.image} style={styles.image} resizeMode="contain" />
          </View>

          <View style={styles.tag}>
            <Text style={styles.tagText}>{slide.tag}</Text>
          </View>

          <Text style={styles.title}>{slide.title}</Text>

          <View style={styles.messageBox}>
            <Text style={styles.messageIcon}>💬</Text>
            <Text style={styles.messageText}>{slide.message}</Text>
          </View>

          <View style={styles.dots}>
            {onboardingData.map((_, i) => (
              <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
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
            <Text style={styles.buttonText}>{isLast ? "Let's Go!" : "Let's Begin"}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  topRowAndroid: {
    marginTop: 20,
  },
  guideRow: { flexDirection: 'row', alignItems: 'center' },
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
  guideKicker: { color: colors.primary, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 1 },
  guideName: { color: colors.text, fontSize: fontSizes.md, fontWeight: '700' },
  skip: { color: colors.textMuted, fontSize: fontSizes.md, fontWeight: '500' },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: IS_SMALL_SCREEN ? spacing.sm : spacing.md,
  },
  image: {
    width: IS_SMALL_SCREEN ? 180 : 240,
    height: IS_SMALL_SCREEN ? 180 : 240,
  },
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
  tagText: { color: colors.primary, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 0.5 },
  title: {
    color: colors.text,
    fontSize: fontSizes.xxl,
    fontWeight: '800',
    lineHeight: fontSizes.xxl * 1.15,
    marginBottom: spacing.lg,
  },
  messageBox: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  messageIcon: { fontSize: 16, marginRight: spacing.sm, marginTop: 2 },
  messageText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * 1.45,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
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
});

export default OnboardingScreen;