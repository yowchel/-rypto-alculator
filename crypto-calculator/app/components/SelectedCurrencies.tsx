import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Cryptocurrency } from '../types/crypto';
import { lightTheme } from '../constants/colors';
import { convertCurrency, formatCryptoValue } from '../utils/conversion';

interface SelectedCurrenciesProps {
  selectedCurrencies: Cryptocurrency[];
  baseCurrency: Cryptocurrency | null;
  baseAmount: number;
  onRemoveCurrency: (crypto: Cryptocurrency) => void;
  onOpenSelector: () => void;
  onSetBaseCurrency: (crypto: Cryptocurrency) => void;
  isDarkMode?: boolean;
}

export default function SelectedCurrencies({
  selectedCurrencies,
  baseCurrency,
  baseAmount,
  onRemoveCurrency,
  onOpenSelector,
  onSetBaseCurrency,
  isDarkMode = false,
}: SelectedCurrenciesProps) {
  const theme = isDarkMode ? require('../constants/colors').darkTheme : lightTheme;

  if (selectedCurrencies.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
          Выберите валюты
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {selectedCurrencies.map((currency) => {
          const isBase = baseCurrency?.id === currency.id;
          const convertedAmount = baseCurrency
            ? convertCurrency(baseAmount, baseCurrency, currency)
            : baseAmount;

          return (
            <View key={currency.id} style={styles.chipWrapper}>
              <TouchableOpacity
                style={[
                  styles.currencyChip,
                  {
                    backgroundColor: isBase
                      ? theme.primaryButton
                      : theme.secondaryBackground,
                  },
                ]}
                onPress={() => onSetBaseCurrency(currency)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipSymbol, { color: isBase ? '#FFFFFF' : theme.text }]}>
                  {currency.symbol.toUpperCase()}
                </Text>
                <Text
                  style={[styles.chipValue, { color: isBase ? '#FFFFFF' : theme.text }]}
                  numberOfLines={1}
                >
                  {formatCryptoValue(convertedAmount)}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'transparent',
  },
  separator: {
    height: 0.5,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginTop: 8,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
    paddingVertical: 4,
  },
  emptyContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '400',
  },
  chipWrapper: {
    marginRight: 8,
  },
  currencyChip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 22,
    minWidth: 110,
    alignItems: 'center',
  },
  chipSymbol: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  chipValue: {
    fontSize: 19,
    fontWeight: '500',
  },
});
