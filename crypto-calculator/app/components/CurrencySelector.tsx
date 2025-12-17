import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Cryptocurrency } from '../types/crypto';
import { lightTheme } from '../constants/colors';

interface CurrencySelectorProps {
  cryptocurrencies: Cryptocurrency[];
  selectedCurrencies: Cryptocurrency[];
  onToggleCurrency: (crypto: Cryptocurrency) => void;
  onClearAll: () => void;
  onClose: () => void;
  isDarkMode?: boolean;
}

export default function CurrencySelector({
  cryptocurrencies,
  selectedCurrencies,
  onToggleCurrency,
  onClearAll,
  onClose,
  isDarkMode = false,
}: CurrencySelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const theme = isDarkMode ? require('../constants/colors').darkTheme : lightTheme;

  const filteredCurrencies = cryptocurrencies.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isCurrencySelected = (crypto: Cryptocurrency) => {
    return selectedCurrencies.some((c) => c.id === crypto.id);
  };

  const renderCurrencyItem = ({ item }: { item: Cryptocurrency }) => {
    const isSelected = isCurrencySelected(item);

    return (
      <TouchableOpacity
        style={[
          styles.currencyRow,
          {
            backgroundColor: isSelected
              ? 'rgba(107, 103, 133, 0.2)'
              : 'transparent',
          },
        ]}
        onPress={() => onToggleCurrency(item)}
        activeOpacity={0.7}
      >
        <View style={styles.leftSection}>
          <Text style={[styles.currencySymbol, { color: theme.text }]}>
            {item.symbol.toUpperCase()}
          </Text>
          <Text
            style={[styles.currencyName, { color: theme.secondaryText }]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </View>
        <View
          style={[
            styles.checkbox,
            {
              borderColor: theme.secondaryText,
              backgroundColor: isSelected ? theme.primaryButton : 'transparent',
            },
          ]}
        >
          {isSelected && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Выберите валюты</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.7}
        >
          <Text style={[styles.closeButtonText, { color: theme.text }]}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.secondaryBackground,
              color: theme.text,
            },
          ]}
          placeholder="Поиск..."
          placeholderTextColor={theme.secondaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {selectedCurrencies.length > 0 && (
          <TouchableOpacity
            style={[styles.clearButton, { backgroundColor: '#FF3B30' }]}
            onPress={onClearAll}
            activeOpacity={0.7}
          >
            <Text style={styles.clearButtonText}>Сбросить все</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredCurrencies}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 32,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  searchInput: {
    height: 40,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 8,
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
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
    minHeight: 56,
  },
  leftSection: {
    flex: 1,
    marginRight: 16,
  },
  currencySymbol: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 13,
    fontWeight: '400',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
