import { convertCurrency, formatNumber } from '../utils/conversion';
import { Cryptocurrency } from '../types/crypto';

describe('conversion utilities', () => {
  const mockBTC: Cryptocurrency = {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    current_price: 43250.50,
    market_cap: 845000000000,
    market_cap_rank: 1,
    price_change_percentage_24h: 2.5,
  };

  const mockETH: Cryptocurrency = {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    current_price: 2280.75,
    market_cap: 274000000000,
    market_cap_rank: 2,
    price_change_percentage_24h: 1.8,
  };

  const mockUSDT: Cryptocurrency = {
    id: 'tether',
    symbol: 'usdt',
    name: 'Tether',
    current_price: 1.00,
    market_cap: 95000000000,
    market_cap_rank: 3,
    price_change_percentage_24h: 0.01,
  };

  describe('convertCurrency', () => {
    test('should convert BTC to ETH', () => {
      // 1 BTC = $43250.50, 1 ETH = $2280.75
      // 1 BTC should equal 43250.50 / 2280.75 = ~18.96 ETH
      const result = convertCurrency(1, mockBTC, mockETH);
      expect(result).toBeCloseTo(18.96, 1);
    });

    test('should convert ETH to BTC', () => {
      // 10 ETH = $22807.50, in BTC = 22807.50 / 43250.50 = ~0.527 BTC
      const result = convertCurrency(10, mockETH, mockBTC);
      expect(result).toBeCloseTo(0.527, 2);
    });

    test('should convert to USDT (stablecoin)', () => {
      // 0.5 BTC = $21625.25 USDT
      const result = convertCurrency(0.5, mockBTC, mockUSDT);
      expect(result).toBeCloseTo(21625.25, 1);
    });

    test('should convert from USDT', () => {
      // $5000 USDT = 5000 / 43250.50 = ~0.1156 BTC
      const result = convertCurrency(5000, mockUSDT, mockBTC);
      expect(result).toBeCloseTo(0.1156, 3);
    });

    test('should return same amount for same currency', () => {
      const result = convertCurrency(100, mockBTC, mockBTC);
      expect(result).toBe(100);
    });

    test('should return amount when fromCrypto is null', () => {
      const result = convertCurrency(100, null, mockBTC);
      expect(result).toBe(100);
    });

    test('should return amount when toCrypto is null', () => {
      const result = convertCurrency(100, mockBTC, null);
      expect(result).toBe(100);
    });

    test('should handle zero amount', () => {
      const result = convertCurrency(0, mockBTC, mockETH);
      expect(result).toBe(0);
    });

    test('should handle very small amounts', () => {
      const result = convertCurrency(0.00001, mockBTC, mockUSDT);
      expect(result).toBeCloseTo(0.4325, 4);
    });

    test('should handle very large amounts', () => {
      const result = convertCurrency(1000, mockBTC, mockUSDT);
      expect(result).toBeCloseTo(43250500, 0);
    });

    test('should handle missing price gracefully', () => {
      const noPriceCrypto: Cryptocurrency = {
        ...mockBTC,
        current_price: 0,
      };
      const result = convertCurrency(100, mockBTC, noPriceCrypto);
      expect(result).toBe(100);
    });

    test('should handle division by zero price', () => {
      const zeroPriceCrypto: Cryptocurrency = {
        ...mockETH,
        current_price: 0,
      };
      const result = convertCurrency(10, mockBTC, zeroPriceCrypto);
      expect(result).toBe(10); // Should return original amount
    });
  });

  describe('formatNumber', () => {
    test('should format integer with spaces', () => {
      expect(formatNumber(1000)).toBe('1 000.00');
    });

    test('should format large number with spaces', () => {
      expect(formatNumber(1234567)).toBe('1 234 567.00');
    });

    test('should format decimal number', () => {
      const result = formatNumber(123.456);
      expect(result).toContain('123.');
    });

    test('should handle zero', () => {
      expect(formatNumber(0)).toBe('0');
    });

    test('should handle string input', () => {
      expect(formatNumber('1234')).toBe('1 234');
    });

    test('should handle string zero', () => {
      expect(formatNumber('0')).toBe('0');
    });

    test('should handle very large numbers with scientific notation', () => {
      const result = formatNumber(1e15);
      expect(result).toContain('e+');
    });

    test('should handle small decimals', () => {
      const result = formatNumber(0.00123);
      expect(parseFloat(result)).toBeCloseTo(0.00123, 5);
    });

    test('should respect maxDecimals option', () => {
      const result = formatNumber(123.456789, { maxDecimals: 2 });
      expect(result).toBe('123.46');
    });

    test('should handle negative numbers', () => {
      const result = formatNumber(-1234);
      expect(result).toContain('-1 234');
    });

    test('should format cryptocurrency amounts correctly', () => {
      // Bitcoin amount: 0.12345678
      const result = formatNumber(0.12345678, { maxDecimals: 8 });
      expect(parseFloat(result)).toBeCloseTo(0.12345678, 8);
    });

    test('should handle invalid string input', () => {
      expect(formatNumber('invalid')).toBe('invalid');
    });

    test('should handle string with decimal', () => {
      expect(formatNumber('123.45')).toBe('123.45');
    });

    test('should handle very small scientific notation', () => {
      const result = formatNumber(1e-10);
      // Very small numbers get rounded to 0 or shown in minimal precision
      expect(parseFloat(result)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Real-world conversion scenarios', () => {
    test('should calculate portfolio value in USD', () => {
      // Portfolio: 2 BTC + 10 ETH
      const btcValue = convertCurrency(2, mockBTC, mockUSDT);
      const ethValue = convertCurrency(10, mockETH, mockUSDT);
      const totalUSD = btcValue + ethValue;

      expect(totalUSD).toBeCloseTo(109308.5, 0);
    });

    test('should calculate cost basis for DCA strategy', () => {
      // Bought 0.1 BTC at current price
      const cost = convertCurrency(0.1, mockBTC, mockUSDT);
      expect(cost).toBeCloseTo(4325.05, 1);
    });

    test('should handle altcoin to altcoin conversion', () => {
      // How much ETH can I get for 0.5 BTC?
      const result = convertCurrency(0.5, mockBTC, mockETH);
      expect(result).toBeCloseTo(9.48, 1);
    });
  });
});
