/**
 * Специальное значение для обозначения ошибки в калькуляторе
 * Используется как маркер вместо строки 'Error' для избежания проблем с локализацией
 */
export const ERROR_VALUE = '__ERROR__';

/**
 * Проверяет, является ли значение ошибкой калькулятора
 */
export const isErrorValue = (value: string): boolean => {
  return value === ERROR_VALUE;
};

/**
 * Интервал автоматического обновления курсов (в миллисекундах)
 * 90 секунд = 1.5 минуты
 */
export const AUTO_REFRESH_INTERVAL = 90000;

/**
 * Смещение для RefreshControl (в пикселях)
 */
export const REFRESH_CONTROL_OFFSET = 60;

/**
 * Задержка анимации смены темы (в миллисекундах)
 */
export const THEME_ANIMATION_DELAY = 150;

/**
 * Длительность анимации смены темы (в миллисекундах)
 */
export const THEME_ANIMATION_DURATION = 300;
