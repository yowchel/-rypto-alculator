import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { GearIcon, PlusIcon } from 'phosphor-react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { lightTheme, darkTheme } from '../constants/colors';
import { Translations } from '../i18n/translations';
import { isErrorValue } from '../constants/calculator';
import { formatNumber } from '../utils/conversion';
import { scale, moderateScale } from '../utils/dimensions';

interface DisplayProps {
  value: string;
  expression?: string;
  isDarkMode?: boolean;
  onOpenCurrencySelector?: () => void;
  onOpenSettings?: () => void;
  t: Translations;
}

const Display = React.memo(function Display({
  value,
  expression = '',
  isDarkMode = false,
  onOpenCurrencySelector,
  onOpenSettings,
  t,
}: DisplayProps) {
  const theme = useMemo(() => isDarkMode ? darkTheme : lightTheme, [isDarkMode]);
  const [showCopiedFeedback, setShowCopiedFeedback] = useState(false);

  const handleCurrencyPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onOpenCurrencySelector?.();
  };

  const handleSettingsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onOpenSettings?.();
  };

  const handleLongPress = () => {
    if (value && value !== '0' && !isErrorValue(value)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Clipboard.setString(value);
      setShowCopiedFeedback(true);
      setTimeout(() => setShowCopiedFeedback(false), 2000);
    }
  };

  // Форматирование значения дисплея
  const formatDisplayValue = (num: string): string => {
    if (isErrorValue(num)) return num;
    return formatNumber(num, { scientificThreshold: 1e10 });
  };

  // Динамический размер шрифта в зависимости от длины (адаптивный)
  const getFontSize = (val: string): number => {
    const length = val.length;
    if (length <= 8) return moderateScale(64);
    if (length <= 12) return moderateScale(52);
    if (length <= 16) return moderateScale(44);
    return moderateScale(36);
  };

  const displayValue = isErrorValue(value) ? t.error : formatDisplayValue(value);
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
              accessibilityLabel="Settings"
              accessibilityRole="button"
              accessibilityHint="Open settings menu"
            >
              <GearIcon color="#FFFFFF" size={scale(24)} weight="regular" style={styles.icon} />
            </TouchableOpacity>
          )}
          {onOpenCurrencySelector && (
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.primaryButton }]}
              onPress={handleCurrencyPress}
              activeOpacity={0.7}
              accessibilityLabel="Add currency"
              accessibilityRole="button"
              accessibilityHint="Add or remove cryptocurrencies"
            >
              <PlusIcon color="#FFFFFF" size={scale(28)} weight="bold" style={styles.icon} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Pressable
        onLongPress={handleLongPress}
        style={styles.displayContent}
        accessibilityLabel={`Display value: ${displayValue}`}
        accessibilityHint="Long press to copy value"
        accessibilityRole="text"
      >
        {expression && (
          <Text
            style={[styles.expression, { color: theme.secondaryText }]}
            numberOfLines={2}
            accessibilityLabel={`Expression: ${expression}`}
          >
            {expression}
          </Text>
        )}

        <View style={styles.valueContainer}>
          <Text
            style={[styles.value, { color: theme.text, fontSize }]}
            numberOfLines={1}
            accessibilityLabel={displayValue}
          >
            {displayValue}
          </Text>
          {showCopiedFeedback && (
            <View style={[styles.copiedBadge, { backgroundColor: theme.primaryButton }]}>
              <Text style={styles.copiedText}>{t.copied}</Text>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
});

export default Display;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: scale(20),
    paddingTop: scale(10),
    paddingBottom: scale(20),
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: scale(180),
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
    gap: scale(8),
  },
  displayContent: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
    marginTop: scale(20),
  },
  addButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
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
    fontSize: moderateScale(24),
    fontWeight: '600',
  },
  expression: {
    fontSize: moderateScale(28),
    fontWeight: '400',
    marginBottom: scale(10),
  },
  valueContainer: {
    position: 'relative',
    alignItems: 'flex-end',
  },
  value: {
    fontSize: moderateScale(64),
    fontWeight: '300',
    letterSpacing: -1,
  },
  copiedBadge: {
    position: 'absolute',
    top: scale(-30),
    right: 0,
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(12),
  },
  copiedText: {
    color: '#FFFFFF',
    fontSize: moderateScale(13),
    fontWeight: '600',
  },
});
