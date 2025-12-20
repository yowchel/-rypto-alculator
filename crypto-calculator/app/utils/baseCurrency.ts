import { Cryptocurrency } from '../types/crypto';

/**
 * Определяет новую базовую валюту после удаления валюты из списка
 * @param removedCurrency - Валюта которая была удалена
 * @param currentBaseCurrency - Текущая базовая валюта
 * @param remainingCurrencies - Оставшиеся валюты в списке
 * @returns Новая базовая валюта или null если список пустой
 */
export const getNewBaseCurrency = (
  removedCurrency: Cryptocurrency,
  currentBaseCurrency: Cryptocurrency | null,
  remainingCurrencies: Cryptocurrency[]
): Cryptocurrency | null => {
  // Если удалили базовую валюту, выбираем первую из оставшихся
  if (currentBaseCurrency?.id === removedCurrency.id) {
    return remainingCurrencies.length > 0 ? remainingCurrencies[0] : null;
  }

  // Если удалили не базовую валюту, базовая остаётся прежней
  return currentBaseCurrency;
};

/**
 * Определяет базовую валюту при добавлении новой валюты
 * @param currentBaseCurrency - Текущая базовая валюта
 * @param addedCurrency - Валюта которая была добавлена
 * @param isFirstCurrency - Является ли добавленная валюта первой в списке
 * @returns Базовая валюта
 */
export const getBaseCurrencyAfterAdd = (
  currentBaseCurrency: Cryptocurrency | null,
  addedCurrency: Cryptocurrency,
  isFirstCurrency: boolean
): Cryptocurrency | null => {
  // Если это первая валюта, делаем её базовой
  if (isFirstCurrency) {
    return addedCurrency;
  }

  // Иначе базовая остаётся прежней
  return currentBaseCurrency;
};
