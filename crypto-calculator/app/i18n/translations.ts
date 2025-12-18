export type Language = 'ru' | 'en';

export interface Translations {
  // Calculator buttons
  clear: string;
  delete: string;

  // Currency selector
  selectCurrency: string;
  searchCurrency: string;
  search: string;
  close: string;
  clearAll: string;

  // Errors
  error: string;
  noInternetConnection: string;
  usingLocalData: string;
}

export const translations: Record<Language, Translations> = {
  ru: {
    // Calculator buttons
    clear: 'C',
    delete: '⌫',

    // Currency selector
    selectCurrency: 'Выберите криптовалюту',
    searchCurrency: 'Поиск...',
    search: 'Поиск',
    close: 'Закрыть',
    clearAll: 'Сбросить все',

    // Errors
    error: 'Ошибка',
    noInternetConnection: 'Нет подключения к интернету',
    usingLocalData: 'Используются локальные данные',
  },
  en: {
    // Calculator buttons
    clear: 'C',
    delete: '⌫',

    // Currency selector
    selectCurrency: 'Select Cryptocurrency',
    searchCurrency: 'Search...',
    search: 'Search',
    close: 'Close',
    clearAll: 'Clear All',

    // Errors
    error: 'Error',
    noInternetConnection: 'No internet connection',
    usingLocalData: 'Using local data',
  },
};
