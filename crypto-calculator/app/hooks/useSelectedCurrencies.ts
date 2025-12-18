import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Cryptocurrency } from '../types/crypto';

const SELECTED_CURRENCIES_KEY = '@crypto_calculator_selected_currencies';
const BASE_CURRENCY_KEY = '@crypto_calculator_base_currency';

export const useSelectedCurrencies = () => {
  const [selectedCurrencies, setSelectedCurrencies] = useState<Cryptocurrency[]>([]);
  const [baseCurrency, setBaseCurrency] = useState<Cryptocurrency | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем сохранённые валюты при первом запуске
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const [savedCurrencies, savedBaseCurrency] = await Promise.all([
        AsyncStorage.getItem(SELECTED_CURRENCIES_KEY),
        AsyncStorage.getItem(BASE_CURRENCY_KEY),
      ]);

      if (savedCurrencies) {
        const currencies = JSON.parse(savedCurrencies);
        setSelectedCurrencies(currencies);
      }

      if (savedBaseCurrency) {
        const baseCurr = JSON.parse(savedBaseCurrency);
        setBaseCurrency(baseCurr);
      }
    } catch (error) {
      console.error('Ошибка загрузки валют:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSelectedCurrencies = async (currencies: Cryptocurrency[]) => {
    try {
      setSelectedCurrencies(currencies);
      await AsyncStorage.setItem(SELECTED_CURRENCIES_KEY, JSON.stringify(currencies));
    } catch (error) {
      console.error('Ошибка сохранения валют:', error);
    }
  };

  const updateBaseCurrency = async (currency: Cryptocurrency | null) => {
    try {
      setBaseCurrency(currency);
      if (currency) {
        await AsyncStorage.setItem(BASE_CURRENCY_KEY, JSON.stringify(currency));
      } else {
        await AsyncStorage.removeItem(BASE_CURRENCY_KEY);
      }
    } catch (error) {
      console.error('Ошибка сохранения базовой валюты:', error);
    }
  };

  return {
    selectedCurrencies,
    setSelectedCurrencies: updateSelectedCurrencies,
    baseCurrency,
    setBaseCurrency: updateBaseCurrency,
    isLoading,
  };
};
