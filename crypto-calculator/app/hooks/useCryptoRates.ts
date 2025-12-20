import { useState, useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Cryptocurrency } from '../types/crypto';
import { getTopCryptocurrencies } from '../services/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

export const useCryptoRates = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isUsingMockData, setIsUsingMockData] = useState<boolean>(false);

  const fetchCryptocurrencies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Проверка подключения к интернету (опционально, не блокирует выполнение)
      try {
        const netInfo = await NetInfo.fetch();
        if (!netInfo.isConnected) {
          setIsOffline(true);
        } else {
          setIsOffline(false);
        }
      } catch (netError) {
        if (__DEV__) {
          console.log('NetInfo check failed, продолжаем без проверки:', netError);
        }
        setIsOffline(false);
      }

      const data = await getTopCryptocurrencies(200);
      setCryptocurrencies(data);
      setLastUpdate(Date.now());

      // Проверяем, являются ли данные mock данными (только 8 валют с BTC первой)
      const isMock = data.length === 8 && data[0]?.id === 'bitcoin' && data[0]?.current_price === 43250.50;
      setIsUsingMockData(isMock);

      // Не делаем второй запрос для getExchangeRates, так как мы используем
      // current_price напрямую из данных криптовалют для конвертации
      // Это позволяет избежать rate limiting от CoinGecko API
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки данных';
      setError(errorMessage);
      if (__DEV__) {
        console.log('Используются локальные данные:', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshRates = useCallback(() => {
    fetchCryptocurrencies();
  }, [fetchCryptocurrencies]);

  const shouldRefresh = () => {
    if (!lastUpdate) return true;
    return Date.now() - lastUpdate > CACHE_DURATION;
  };

  useEffect(() => {
    fetchCryptocurrencies();
  }, [fetchCryptocurrencies]);

  return {
    cryptocurrencies,
    loading,
    error,
    lastUpdate,
    isOffline,
    isUsingMockData,
    refreshRates,
    shouldRefresh: shouldRefresh(),
  };
};
