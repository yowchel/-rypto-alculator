import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Cryptocurrency, ExchangeRate } from '../types/crypto';
import { getTopCryptocurrencies } from '../services/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

export const useCryptoRates = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [rates] = useState<ExchangeRate>({}); // Оставляем для обратной совместимости
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  const fetchCryptocurrencies = async () => {
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
        console.log('NetInfo check failed, продолжаем без проверки:', netError);
        setIsOffline(false);
      }

      const data = await getTopCryptocurrencies(100);
      setCryptocurrencies(data);
      setLastUpdate(Date.now());

      // Не делаем второй запрос для getExchangeRates, так как мы используем
      // current_price напрямую из данных криптовалют для конвертации
      // Это позволяет избежать rate limiting от CoinGecko API
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки данных';
      setError(errorMessage);
      console.log('Используются локальные данные:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshRates = () => {
    fetchCryptocurrencies();
  };

  const shouldRefresh = () => {
    if (!lastUpdate) return true;
    return Date.now() - lastUpdate > CACHE_DURATION;
  };

  useEffect(() => {
    fetchCryptocurrencies();
  }, []);

  return {
    cryptocurrencies,
    rates,
    loading,
    error,
    lastUpdate,
    isOffline,
    refreshRates,
    shouldRefresh: shouldRefresh(),
  };
};
