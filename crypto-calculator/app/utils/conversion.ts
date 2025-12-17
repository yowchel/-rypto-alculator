import { Cryptocurrency } from '../types/crypto';

/**
 * Конвертирует значение из одной криптовалюты в другую
 * @param amount - Сумма в базовой валюте
 * @param fromCrypto - Базовая криптовалюта
 * @param toCrypto - Целевая криптовалюта
 * @returns Конвертированная сумма
 */
export const convertCurrency = (
  amount: number,
  fromCrypto: Cryptocurrency | null,
  toCrypto: Cryptocurrency | null
): number => {
  if (!fromCrypto || !toCrypto) {
    return amount;
  }

  // Если валюты одинаковые, возвращаем исходную сумму
  if (fromCrypto.id === toCrypto.id) {
    return amount;
  }

  // Конвертируем через USD как посредника
  // amount * (цена базовой валюты в USD) / (цена целевой валюты в USD)
  const amountInUSD = amount * fromCrypto.current_price;
  const convertedAmount = amountInUSD / toCrypto.current_price;

  return convertedAmount;
};

/**
 * Форматирует число для отображения (убирает незначащие нули)
 * @param value - Число для форматирования
 * @param maxDecimals - Максимальное количество знаков после запятой
 * @returns Отформатированная строка
 */
export const formatCryptoValue = (value: number, maxDecimals: number = 8): string => {
  if (value === 0) return '0';

  // Для больших чисел показываем меньше десятичных знаков
  if (Math.abs(value) >= 1) {
    return value.toFixed(Math.min(2, maxDecimals));
  }

  // Для малых чисел показываем больше знаков
  const decimals = Math.min(maxDecimals, 8);
  return parseFloat(value.toFixed(decimals)).toString();
};
