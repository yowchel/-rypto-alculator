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

  // Проверяем наличие цен
  if (!fromCrypto.current_price || !toCrypto.current_price) {
    return amount;
  }

  // Проверяем деление на ноль
  if (toCrypto.current_price === 0) {
    return amount;
  }

  // Конвертируем через USD как посредника
  // amount * (цена базовой валюты в USD) / (цена целевой валюты в USD)
  const amountInUSD = amount * fromCrypto.current_price;
  const convertedAmount = amountInUSD / toCrypto.current_price;

  return convertedAmount;
};

/**
 * Форматирует число для отображения с разделителями тысяч
 * @param value - Число для форматирования (может быть number или string)
 * @param options - Опции форматирования
 * @returns Отформатированная строка
 */
export const formatNumber = (
  value: number | string,
  options: { maxDecimals?: number; scientificThreshold?: number } = {}
): string => {
  const { maxDecimals = 8, scientificThreshold = 1e10 } = options;

  // Если это строка, проверяем на специальные значения
  if (typeof value === 'string') {
    if (value === '0') return '0';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;

    // Используем научную нотацию для очень больших чисел
    if (Math.abs(numValue) >= scientificThreshold) {
      return numValue.toExponential(2);
    }

    // Сохраняем разделители для строк (уже введённых пользователем)
    const parts = value.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const decimalPart = parts[1] || '';
    return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  }

  // Для чисел
  if (value === 0) return '0';

  // Используем научную нотацию для очень больших чисел
  if (Math.abs(value) >= scientificThreshold) {
    return value.toExponential(2);
  }

  // Для больших чисел (>= 1) показываем меньше десятичных знаков
  if (Math.abs(value) >= 1) {
    const formatted = value.toFixed(Math.min(2, maxDecimals));
    const parts = formatted.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts[1] ? `${integerPart}.${parts[1]}` : integerPart;
  }

  // Для малых чисел показываем больше знаков
  const decimals = Math.min(maxDecimals, 8);
  return parseFloat(value.toFixed(decimals)).toString();
};

/**
 * @deprecated Используйте formatNumber вместо этого
 * Форматирует криптовалютное значение для отображения
 */
export const formatCryptoValue = (value: number, maxDecimals: number = 8): string => {
  return formatNumber(value, { maxDecimals, scientificThreshold: 1e9 });
};
