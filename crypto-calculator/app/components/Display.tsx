import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { GearIcon, PlusIcon } from 'phosphor-react-native';
import { lightTheme } from '../constants/colors';

interface DisplayProps {
  value: string;
  expression?: string;
  isDarkMode?: boolean;
  onOpenCurrencySelector?: () => void;
  onOpenSettings?: () => void;
}

export default function Display({
  value,
  expression = '',
  isDarkMode = false,
  onOpenCurrencySelector,
  onOpenSettings,
}: DisplayProps) {
  const theme = isDarkMode ? require('../constants/colors').darkTheme : lightTheme;

  const handleCurrencyPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onOpenCurrencySelector?.();
  };

  const handleSettingsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onOpenSettings?.();
  };

  // Форматирование числа
  const formatNumber = (num: string): string => {
    if (num === 'Error' || num === '0') return num;

    const numValue = parseFloat(num);

    // Если число слишком большое (> 10 миллиардов), используем научную нотацию
    if (Math.abs(numValue) >= 1e10) {
      return numValue.toExponential(2);
    }

    // Разделяем на целую и дробную части
    const parts = num.split('.');
    const integerPart = parts[0];
    const decimalPart = parts[1] || '';

    // Форматируем целую часть с разделителями
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
  };

  // Динамический размер шрифта в зависимости от длины
  const getFontSize = (val: string): number => {
    const length = val.length;
    if (length <= 8) return 64;
    if (length <= 12) return 52;
    if (length <= 16) return 44;
    return 36;
  };

  const formattedValue = formatNumber(value);
  const fontSize = getFontSize(value);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.buttonsRow}>
          {onOpenSettings && (
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.primaryButton }]}
              onPress={handleSettingsPress}
              activeOpacity={0.7}
            >
              <GearIcon color="#FFFFFF" size={24} weight="regular" style={styles.icon} />
            </TouchableOpacity>
          )}
          {onOpenCurrencySelector && (
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.primaryButton }]}
              onPress={handleCurrencyPress}
              activeOpacity={0.7}
            >
              <PlusIcon color="#FFFFFF" size={28} weight="bold" style={styles.icon} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.displayContent}>
        {expression && (
          <Text
            style={[styles.expression, { color: theme.secondaryText }]}
            numberOfLines={2}
          >
            {expression}
          </Text>
        )}

        <Text
          style={[styles.value, { color: theme.text, fontSize }]}
          numberOfLines={1}
        >
          {formattedValue}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 180,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  displayContent: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
    marginTop: 20,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    pointerEvents: 'none',
  },
  iconWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  expression: {
    fontSize: 28,
    fontWeight: '400',
    marginBottom: 10,
  },
  value: {
    fontSize: 64,
    fontWeight: '300',
    letterSpacing: -1,
  },
});
