import { ImageSourcePropType } from 'react-native';

export type CategoryId = 'mountains' | 'promenade' | 'taste' | 'science' | 'peace';

export interface Category {
  id: CategoryId | 'all';
  title: string;
  emoji: string;
}

export interface Location {
  id: string;
  title: string;
  subtitle: string;
  category: CategoryId;
  address: string;
  gpsText: string;
  gpsDecimal: string;
  latitude: number;
  longitude: number;
  description: string;
  image: ImageSourcePropType;
}

export type FactCategory = 'intelligence' | 'health' | 'uniqueness';

export interface Fact {
  id: string;
  category: FactCategory;
  icon: string;
  title: string;
  description: string;
}

export interface BlogPost {
  id: string;
  title: string;
  tag: string;
  intro: string;
  body: string[];
  readTime: string;
  date: string;
  cover: ImageSourcePropType;
  featured?: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface OnboardingSlide {
  id: string;
  tag: string;
  title: string;
  message: string;
  image: ImageSourcePropType;
}

export type MainTabParamList = {
  Explore: undefined;
  Saved: undefined;
  Map: undefined;
  Blog: undefined;
  Facts: undefined;
  Quiz: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: { screen?: keyof MainTabParamList } | undefined;
  LocationDetail: { locationId: string };
  BlogDetail: { postId: string };
  QuizGame: { level?: number } | undefined;
  QuizResult: {
    score: number;
    total: number;
    answers: boolean[];
    level: number;
    isPerfect: boolean;
    hasNextLevel: boolean;
  };
};