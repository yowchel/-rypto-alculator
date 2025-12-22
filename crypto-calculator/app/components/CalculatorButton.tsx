import React, { useMemo } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { BackspaceIcon } from 'phosphor-react-native';
import { lightTheme, darkTheme } from '../constants/colors';
import { scale } from '../utils/dimensions';

interface CalculatorButtonProps {
  value: string;
  onPress: (value: string) => void;
  type?: 'number' | 'operator' | 'equal' | 'clear';
  size?: 'small' | 'medium' | 'large';
  isDarkMode?: boolean;
}

const CalculatorButton = React.memo(function CalculatorButton({
  value,
  onPress,
  type = 'number',
  size = 'medium',
  isDarkMode = false,
}: CalculatorButtonProps) {
  const theme = useMemo(() => isDarkMode ? darkTheme : lightTheme, [isDarkMode]);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  // Адаптивные размеры кнопок
  const buttonSizes = {
    small: scale(60),
    medium: scale(75),
    large: scale(90),
  };

  const buttonSize = buttonSizes[size];

  const getGradientColors = (): [string, string] => {
    switch (type) {
      case 'operator':
        return isDarkMode
          ? ['#4A5568', '#3D4450']
          : ['#7B8794', '#6B7785'];
      case 'equal':
      case 'clear':
        return isDarkMode
          ? ['#2C2C2E', '#1C1C1E']
          : ['#3A3A3C', '#2C2C2E'];
      default:
        return isDarkMode
          ? ['#363C48', '#2D3340']
          : ['#FFFFFF', '#F5F5F7'];
    }
  };

  const getTextColor = () => {
    if (type === 'operator' || type === 'equal' || type === 'clear') {
      return '#FFFFFF';
    }
    return theme.text;
  };

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
    onPress(value);
  };

  const getAccessibilityLabel = (): string => {
    if (value === '⌫') return 'Delete';
    if (value === 'C') return 'Clear';
    if (value === '=') return 'Equals';
    if (value === '+') return 'Plus';
    if (value === '-') return 'Minus';
    if (value === '*') return 'Multiply';
    if (value === '/') return 'Divide';
    if (value === '.') return 'Decimal point';
    return value;
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.buttonWrapper]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        accessibilityLabel={getAccessibilityLabel()}
        accessibilityRole="button"
        accessibilityHint={type === 'clear' ? 'Clear calculator' : type === 'equal' ? 'Calculate result' : undefined}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.button,
            {
              width: buttonSize,
              height: buttonSize,
              borderRadius: buttonSize / 2,
            },
          ]}
        >
          <View style={styles.innerShadow} />
          {value === '⌫' ? (
            <BackspaceIcon
              color={getTextColor()}
              size={buttonSize / 2.8}
              weight="regular"
              style={{ pointerEvents: 'none' }}
            />
          ) : (
            <Text
              style={[
                styles.buttonText,
                {
                  color: getTextColor(),
                  fontSize: buttonSize / 3,
                  textShadowColor: 'rgba(0, 0, 0, 0.3)',
                  textShadowOffset: { width: 0, height: 1 },
                  textShadowRadius: 2,
                },
              ]}
            >
              {value}
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
});

export default CalculatorButton;

const styles = StyleSheet.create({
  buttonWrapper: {
    margin: scale(5),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: scale(4),
    },
    shadowOpacity: 0.25,
    shadowRadius: scale(6),
    elevation: 8,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  innerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 100,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
