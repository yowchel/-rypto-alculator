import { useState, useEffect } from 'react';
import { Cryptocurrency, ExchangeRate } from '../types/crypto';
import { getTopCryptocurrencies } from '../services/api';

const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

export const useCryptoRates = () => {
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>([]);
  const [rates] = useState<ExchangeRate>({}); // Оставляем для обратной совместимости
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);

  const fetchCryptocurrencies = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getTopCryptocurrencies(100);
      setCryptocurrencies(data);
      setLastUpdate(Date.now());

      // Не делаем второй запрос для getExchangeRates, так как мы используем
      // current_price напрямую из данных криптовалют для конвертации
      // Это позволяет избежать rate limiting от CoinGecko API
    } catch (err) {
      // Не устанавливаем ошибку, так как API уже возвращает fallback данные
      console.log('Используются локальные данные');
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
    refreshRates,
    shouldRefresh: shouldRefresh(),
  };
};
