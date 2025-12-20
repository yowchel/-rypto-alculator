import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WarningCircleIcon, WifiSlashIcon } from 'phosphor-react-native';
import { lightTheme, darkTheme } from '../constants/colors';
import { Translations } from '../i18n/translations';

interface StatusBannerProps {
  isOffline: boolean;
  isUsingMockData: boolean;
  isDarkMode?: boolean;
  t: Translations;
}

export default function StatusBanner({
  isOffline,
  isUsingMockData,
  isDarkMode = false,
  t,
}: StatusBannerProps) {
  const theme = useMemo(() => isDarkMode ? darkTheme : lightTheme, [isDarkMode]);

  // Не показываем баннер если всё в порядке
  if (!isOffline && !isUsingMockData) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#3A3A3C' : '#FFE5B4' }]}>
      {isOffline ? (
        <WifiSlashIcon color={isDarkMode ? '#FFFFFF' : '#8B4513'} size={16} weight="regular" />
      ) : (
        <WarningCircleIcon color={isDarkMode ? '#FFFFFF' : '#8B4513'} size={16} weight="regular" />
      )}
      <Text style={[styles.text, { color: isDarkMode ? '#FFFFFF' : '#8B4513' }]}>
        {isOffline ? t.noInternetConnection : t.usingLocalData}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: '500',
  },
});
