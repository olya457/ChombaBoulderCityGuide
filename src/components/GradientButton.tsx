import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, fontSizes, radius } from '../theme/theme';

interface Props {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'solid';
}

const GradientButton: React.FC<Props> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled,
  variant = 'primary',
}) => {
  if (variant === 'outline') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[styles.base, styles.outline, style, disabled && styles.disabled]}
      >
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </Pressable>
    );
  }

  if (variant === 'solid') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[styles.base, styles.solid, style, disabled && styles.disabled]}
      >
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.pressable, style, disabled && styles.disabled]}
    >
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    borderRadius: radius.pill,
    overflow: 'hidden',
    width: '100%',
  },
  gradient: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  base: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  solid: {
    backgroundColor: colors.primary,
  },
  text: {
    color: colors.text,
    fontSize: fontSizes.md,
    fontWeight: '700',
    textAlign: 'center',
  },
  disabled: { opacity: 0.5 },
});

export default GradientButton;