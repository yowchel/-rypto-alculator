import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { lightTheme } from '../constants/colors';

interface DisplayProps {
  value: string;
  expression?: string;
  isDarkMode?: boolean;
  onOpenCurrencySelector?: () => void;
}

export default function Display({
  value,
  expression = '',
  isDarkMode = false,
  onOpenCurrencySelector
}: DisplayProps) {
  const theme = isDarkMode ? require('../constants/colors').darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.appTitle, { color: theme.secondaryText }]}>
          The Cryptocalculator
        </Text>
        {onOpenCurrencySelector && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primaryButton }]}
            onPress={onOpenCurrencySelector}
            activeOpacity={0.7}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        )}
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
          style={[styles.value, { color: theme.text }]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  appTitle: {
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.5,
    opacity: 0.6,
  },
  displayContent: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
    marginTop: 20,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '300',
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
