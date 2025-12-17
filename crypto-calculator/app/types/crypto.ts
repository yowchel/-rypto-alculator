export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  image?: string;
}

export interface ExchangeRate {
  [key: string]: {
    [currency: string]: number;
  };
}

export interface CryptoRatesState {
  rates: ExchangeRate;
  cryptocurrencies: Cryptocurrency[];
  loading: boolean;
  error: string | null;
  lastUpdate: number | null;
}
