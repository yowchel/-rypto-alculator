import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Cryptocurrency } from '../types/crypto';
import { lightTheme } from '../constants/colors';
import { convertCurrency, formatCryptoValue } from '../utils/conversion';

interface CurrencyListProps {
  cryptocurrencies: Cryptocurrency[];
  baseCurrency: Cryptocurrency | null;
  baseAmount: number;
  onCurrencyPress: (crypto: Cryptocurrency) => void;
  isDarkMode?: boolean;
}

export default function CurrencyList({
  cryptocurrencies,
  baseCurrency,
  baseAmount,
  onCurrencyPress,
  isDarkMode = false,
}: CurrencyListProps) {
  const theme = isDarkMode ? require('../constants/colors').darkTheme : lightTheme;

  const renderCurrencyItem = ({ item }: { item: Cryptocurrency }) => {
    const isBaseCurrency = baseCurrency?.id === item.id;
    const convertedAmount = baseCurrency
      ? convertCurrency(baseAmount, baseCurrency, item)
      : baseAmount;

    return (
      <TouchableOpacity
        style={[
          styles.currencyRow,
          {
            backgroundColor: isBaseCurrency
              ? 'rgba(107, 103, 133, 0.15)'
              : 'transparent',
          },
        ]}
        onPress={() => onCurrencyPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.leftSection}>
          <Text
            style={[
              styles.currencySymbol,
              { color: theme.text },
            ]}
          >
            {item.symbol.toUpperCase()}
          </Text>
          <Text
            style={[
              styles.currencyName,
              { color: theme.secondaryText },
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </View>
        <Text
          style={[
            styles.currencyValue,
            { color: theme.text },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {formatCryptoValue(convertedAmount)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={cryptocurrencies}
        renderItem={renderCurrencyItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  listContent: {
    paddingVertical: 8,
  },
  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 50,
  },
  leftSection: {
    flex: 1,
    marginRight: 16,
  },
  currencySymbol: {
    fontSize: 17,
    fontWeight: '400',
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 13,
    fontWeight: '400',
  },
  currencyValue: {
    fontSize: 34,
    fontWeight: '300',
    letterSpacing: -0.5,
    textAlign: 'right',
  },
});
