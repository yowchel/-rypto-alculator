import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { lightTheme, darkTheme } from '../constants/colors';

interface LoadingScreenProps {
  isDarkMode?: boolean;
}

export default function LoadingScreen({ isDarkMode = false }: LoadingScreenProps) {
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ActivityIndicator size="large" color={theme.primaryButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
