import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Cryptocurrency } from '../types/crypto';
import { lightTheme, darkTheme } from '../constants/colors';
import { convertCurrency, formatCryptoValue } from '../utils/conversion';
import { Translations } from '../i18n/translations';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHIP_GAP = 10;
const HORIZONTAL_PADDING = 16;
// Вычисляем ширину чипа так, чтобы на экране помещалось ровно 3
const CHIP_WIDTH = (SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - (CHIP_GAP * 2)) / 3;

interface SelectedCurrenciesProps {
  selectedCurrencies: Cryptocurrency[];
  baseCurrency: Cryptocurrency | null;
  baseAmount: number;
  onRemoveCurrency: (crypto: Cryptocurrency) => void;
  onOpenSelector: () => void;
  onSetBaseCurrency: (crypto: Cryptocurrency) => void;
  isDarkMode?: boolean;
  t: Translations;
}

const SelectedCurrencies = React.memo(function SelectedCurrencies({
  selectedCurrencies,
  baseCurrency,
  baseAmount,
  onRemoveCurrency,
  onOpenSelector,
  onSetBaseCurrency,
  isDarkMode = false,
  t,
}: SelectedCurrenciesProps) {
  const theme = useMemo(() => isDarkMode ? darkTheme : lightTheme, [isDarkMode]);

  if (selectedCurrencies.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
          {t.selectCurrencies}
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

          const formattedValue = formatCryptoValue(convertedAmount);
          const priceChange = currency.price_change_percentage_24h || 0;
          const isPositive = priceChange >= 0;

          // Динамический размер шрифта в зависимости от длины
          const getFontSize = (val: string): number => {
            const length = val.length;
            if (length <= 8) return 19;
            if (length <= 12) return 16;
            if (length <= 16) return 14;
            return 12;
          };

          return (
            <TouchableOpacity
              key={currency.id}
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
              accessibilityLabel={`${currency.name}, ${formattedValue}, ${priceChange >= 0 ? 'up' : 'down'} ${Math.abs(priceChange).toFixed(2)} percent`}
              accessibilityRole="button"
              accessibilityHint={isBase ? 'Selected as base currency' : 'Tap to set as base currency'}
              accessibilityState={{ selected: isBase }}
            >
              <Text style={[styles.chipSymbol, { color: isBase ? '#FFFFFF' : theme.text }]}>
                {currency.symbol.toUpperCase()}
              </Text>
              <Text
                style={[
                  styles.chipValue,
                  {
                    color: isBase ? '#FFFFFF' : theme.text,
                    fontSize: getFontSize(formattedValue)
                  }
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
              >
                {formattedValue}
              </Text>
              <Text
                style={[
                  styles.priceChange,
                  {
                    color: isBase
                      ? '#FFFFFF'
                      : isPositive
                      ? '#34C759'
                      : '#FF3B30',
                  }
                ]}
              >
                {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.separator} />
    </View>
  );
});

export default SelectedCurrencies;

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'transparent',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 10,
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
  currencyChip: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 22,
    width: CHIP_WIDTH,
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
  priceChange: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});
