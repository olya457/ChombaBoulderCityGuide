import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenWrapper from '../../components/ScreenWrapper';
import PulseLogo from '../../components/PulseLogo';
import { RootStackParamList } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Onboarding'), 5000);
    return () => clearTimeout(t);
  }, [navigation]);

  return (
    <ScreenWrapper variant="splash">
      <View style={styles.center}>
        <PulseLogo />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default SplashScreen;