import React from 'react';
import { ImageBackground, StyleSheet, View, ViewStyle } from 'react-native';
import { useAppInsets } from '../hooks/useInsets';

interface Props {
  children: React.ReactNode;
  variant?: 'splash' | 'main';
  withTabBarSpace?: boolean;
  style?: ViewStyle;
  contentPaddingTop?: boolean;
}

const BG_SPLASH = require('../assets/bg_splash.png');
const BG_MAIN = require('../assets/bg_main.png');

const ScreenWrapper: React.FC<Props> = ({
  children,
  variant = 'main',
  withTabBarSpace = false,
  style,
  contentPaddingTop = true,
}) => {
  const insets = useAppInsets();
  const source = variant === 'splash' ? BG_SPLASH : BG_MAIN;

  return (
    <ImageBackground source={source} style={styles.bg} resizeMode="cover">
      <View
        style={[
          styles.content,
          {
            paddingTop: contentPaddingTop ? insets.top : 0,
            paddingBottom: withTabBarSpace ? insets.bottom + 96 : insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
          style,
        ]}
      >
        {children}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, width: '100%', height: '100%' },
  content: { flex: 1 },
});

export default ScreenWrapper;