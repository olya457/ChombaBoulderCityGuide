import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const IS_SMALL_SCREEN = height < 720;
export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

export const TAB_BAR_BOTTOM_OFFSET = IS_IOS ? 20 : 30;
export const ANDROID_EDGE_PADDING = 20;

export const colors = {
  bg: '#0A0A12',
  surface: 'rgba(255,255,255,0.04)',
  surfaceAlt: 'rgba(255,255,255,0.08)',
  surfaceActive: 'rgba(236,72,106,0.18)',
  border: 'rgba(255,255,255,0.12)',
  borderSoft: 'rgba(255,255,255,0.08)',
  primary: '#EC486A',
  primaryAlt: '#FF4F7A',
  purple: '#A855F7',
  purpleAlt: '#8B5CF6',
  text: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.6)',
  textDim: 'rgba(255,255,255,0.4)',
  success: '#22C55E',
  danger: '#EF4444',
  chipBg: 'rgba(236,72,106,0.15)',
  tabBarBg: 'rgba(15,15,24,0.92)',
  gradientStart: '#EC486A',
  gradientEnd: '#A855F7',
};

export const fontSizes = {
  xs: IS_SMALL_SCREEN ? 10 : 11,
  sm: IS_SMALL_SCREEN ? 11 : 13,
  md: IS_SMALL_SCREEN ? 13 : 15,
  lg: IS_SMALL_SCREEN ? 16 : 18,
  xl: IS_SMALL_SCREEN ? 20 : 24,
  xxl: IS_SMALL_SCREEN ? 26 : 32,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  xxl: 28,
  pill: 999,
};

export const categoryColors: Record<string, string> = {
  mountains: '#EF4444',
  promenade: '#EC4899',
  taste: '#F59E0B',
  science: '#8B5CF6',
  peace: '#10B981',
};