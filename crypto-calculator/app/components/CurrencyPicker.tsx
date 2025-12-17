import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Cryptocurrency } from '../types/crypto';
import { lightTheme } from '../constants/colors';

interface CurrencyPickerProps {
  visible: boolean;
  cryptocurrencies: Cryptocurrency[];
  onSelect: (crypto: Cryptocurrency) => void;
  onClose: () => void;
  isDarkMode?: boolean;
}

export default function CurrencyPicker({
  visible,
  cryptocurrencies,
  onSelect,
  onClose,
  isDarkMode = false,
}: CurrencyPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const theme = isDarkMode ? require('../constants/colors').darkTheme : lightTheme;

  const filteredCryptos = cryptocurrencies.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (crypto: Cryptocurrency) => {
    onSelect(crypto);
    setSearchQuery('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Выбрать валюту</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: theme.primaryButton }]}>Закрыть</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.secondaryBackground,
              color: theme.text,
            },
          ]}
          placeholder="Поиск криптовалюты..."
          placeholderTextColor={theme.secondaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />

        <FlatList
          data={filteredCryptos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.item, { borderBottomColor: theme.secondaryBackground }]}
              onPress={() => handleSelect(item)}
            >
              <View style={styles.itemLeft}>
                <Text style={[styles.symbol, { color: theme.text }]}>
                  {item.symbol.toUpperCase()}
                </Text>
                <Text style={[styles.name, { color: theme.secondaryText }]}>{item.name}</Text>
              </View>
              <Text style={[styles.price, { color: theme.text }]}>
                ${item.current_price.toLocaleString()}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
              Криптовалюта не найдена
            </Text>
          }
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  itemLeft: {
    flex: 1,
  },
  symbol: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
  },
  price: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});
