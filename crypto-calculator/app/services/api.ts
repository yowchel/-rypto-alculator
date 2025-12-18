import axios, { AxiosError } from 'axios';
import { Cryptocurrency, ExchangeRate } from '../types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Mock данные для разработки и fallback
const MOCK_CRYPTOCURRENCIES: Cryptocurrency[] = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    current_price: 43250.50,
    market_cap: 845000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.5,
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    current_price: 2280.75,
    market_cap: 274000000000,
    market_cap_rank: 2,
    price_change_percentage_24h: 1.8,
  },
  {
    id: 'tether',
    symbol: 'usdt',
    name: 'Tether',
    current_price: 1.00,
    market_cap: 95000000000,
    market_cap_rank: 3,
    price_change_percentage_24h: 0.01,
  },
  {
    id: 'binancecoin',
    symbol: 'bnb',
    name: 'BNB',
    current_price: 315.20,
    market_cap: 48500000000,
    market_cap_rank: 4,
    price_change_percentage_24h: 3.2,
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    current_price: 98.45,
    market_cap: 42000000000,
    market_cap_rank: 5,
    price_change_percentage_24h: 5.6,
  },
  {
    id: 'ripple',
    symbol: 'xrp',
    name: 'XRP',
    current_price: 0.62,
    market_cap: 33000000000,
    market_cap_rank: 6,
    price_change_percentage_24h: 1.2,
  },
  {
    id: 'cardano',
    symbol: 'ada',
    name: 'Cardano',
    current_price: 0.58,
    market_cap: 20500000000,
    market_cap_rank: 7,
    price_change_percentage_24h: 2.1,
  },
  {
    id: 'dogecoin',
    symbol: 'doge',
    name: 'Dogecoin',
    current_price: 0.092,
    market_cap: 13000000000,
    market_cap_rank: 8,
    price_change_percentage_24h: 4.5,
  },
];

export const getTopCryptocurrencies = async (limit: number = 100): Promise<Cryptocurrency[]> => {
  try {
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: false,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      const status = axiosError.response.status;

      // Rate limit error
      if (status === 429) {
        console.warn('⚠️ API Rate limit exceeded. Используются локальные данные.');
        return MOCK_CRYPTOCURRENCIES;
      }

      // Server errors (500-599)
      if (status >= 500) {
        console.error('❌ Ошибка сервера CoinGecko:', status);
        return MOCK_CRYPTOCURRENCIES;
      }

      // Client errors (400-499, except 429)
      console.error('❌ Ошибка запроса:', status, axiosError.response.data);
      return MOCK_CRYPTOCURRENCIES;
    } else if (axiosError.request) {
      // Network error - no response received
      console.error('🌐 Ошибка сети: нет ответа от сервера');
      return MOCK_CRYPTOCURRENCIES;
    } else if (axiosError.code === 'ECONNABORTED') {
      // Timeout error
      console.error('⏱️ Превышено время ожидания ответа от API');
      return MOCK_CRYPTOCURRENCIES;
    }

    console.error('❌ Неизвестная ошибка при загрузке криптовалют:', error);
    return MOCK_CRYPTOCURRENCIES;
  }
};

export const getExchangeRates = async (
  cryptoIds: string[],
  vsCurrencies: string[] = ['usd', 'eur', 'btc']
): Promise<ExchangeRate> => {
  try {
    const response = await api.get('/simple/price', {
      params: {
        ids: cryptoIds.join(','),
        vs_currencies: vsCurrencies.join(','),
        include_24hr_change: true,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      console.error('API Error (rates):', axiosError.response.status);
    } else if (axiosError.request) {
      console.error('Network Error (rates) - no response received');
    }

    console.log('Возвращаем пустой объект курсов из-за ошибки API');
    // Возвращаем пустой объект вместо выброса ошибки
    return {};
  }
};

export const searchCryptocurrencies = async (query: string): Promise<Cryptocurrency[]> => {
  try {
    const allCryptos = await getTopCryptocurrencies(250);
    const filtered = allCryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(query.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(query.toLowerCase())
    );
    return filtered;
  } catch (error) {
    console.error('Error searching cryptocurrencies:', error);
    throw error;
  }
};
