import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from './StorageKeys';

export interface QuizProgress {
  level: number;
  indexInLevel: number;
  score: number;
  answers: boolean[];
}

export const SettingsStorage = {
  async setOnboardingCompleted(value: boolean): Promise<void> {
    await AsyncStorage.setItem(StorageKeys.ONBOARDING_COMPLETED, JSON.stringify(value));
  },
  async getOnboardingCompleted(): Promise<boolean> {
    const raw = await AsyncStorage.getItem(StorageKeys.ONBOARDING_COMPLETED);
    return raw ? JSON.parse(raw) === true : false;
  },
  async getFavorites(): Promise<string[]> {
    const raw = await AsyncStorage.getItem(StorageKeys.FAVORITES);
    return raw ? (JSON.parse(raw) as string[]) : [];
  },
  async setFavorites(list: string[]): Promise<void> {
    await AsyncStorage.setItem(StorageKeys.FAVORITES, JSON.stringify(list));
  },
  async getBestScore(): Promise<number> {
    const raw = await AsyncStorage.getItem(StorageKeys.QUIZ_BEST_SCORE);
    return raw ? Number(raw) : 0;
  },
  async setBestScore(value: number): Promise<void> {
    await AsyncStorage.setItem(StorageKeys.QUIZ_BEST_SCORE, String(value));
  },
  async getQuizProgress(): Promise<QuizProgress | null> {
    const raw = await AsyncStorage.getItem(StorageKeys.QUIZ_PROGRESS);
    return raw ? (JSON.parse(raw) as QuizProgress) : null;
  },
  async setQuizProgress(progress: QuizProgress): Promise<void> {
    await AsyncStorage.setItem(StorageKeys.QUIZ_PROGRESS, JSON.stringify(progress));
  },
  async clearQuizProgress(): Promise<void> {
    await AsyncStorage.removeItem(StorageKeys.QUIZ_PROGRESS);
  },
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([
      StorageKeys.ONBOARDING_COMPLETED,
      StorageKeys.FAVORITES,
      StorageKeys.QUIZ_BEST_SCORE,
      StorageKeys.QUIZ_PROGRESS,
    ]);
  },
};