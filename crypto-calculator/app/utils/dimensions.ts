import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Базовые размеры (iPhone 14 Pro)
const baseWidth = 393;
const baseHeight = 852;

// Функция для масштабирования по ширине
export const scaleWidth = (size: number): number => {
  return (width / baseWidth) * size;
};

// Функция для масштабирования по высоте
export const scaleHeight = (size: number): number => {
  return (height / baseHeight) * size;
};

// Функция для масштабирования с учётом меньшего из измерений (для сохранения пропорций)
export const scale = (size: number): number => {
  const scale = Math.min(width / baseWidth, height / baseHeight);
  return size * scale;
};

// Модератор для шрифтов
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

// Экспортируем размеры экрана
export const screenWidth = width;
export const screenHeight = height;

// Проверка на большой экран
export const isLargeScreen = width >= 428; // iPhone Pro Max и больше
export const isSmallScreen = width <= 375; // iPhone SE и меньше
