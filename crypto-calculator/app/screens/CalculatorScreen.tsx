import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Modal, Animated, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Display from '../components/Display';
import CalculatorButton from '../components/CalculatorButton';
import SelectedCurrencies from '../components/SelectedCurrencies';
import CurrencySelector from '../components/CurrencySelector';
import SettingsModal from '../components/SettingsModal';
import StatusBanner from '../components/StatusBanner';
import LoadingScreen from '../components/LoadingScreen';
import { lightTheme, darkTheme } from '../constants/colors';
import {
  handleNumberInput,
  handleOperation,
  handleEquals,
  handleClear,
  handleBackspace,
} from '../services/calculator';
import { evaluateExpression } from '../utils/expressionParser';
import { useCryptoRates } from '../hooks/useCryptoRates';
import {
  ERROR_VALUE,
  AUTO_REFRESH_INTERVAL,
  THEME_ANIMATION_DELAY,
} from '../constants/calculator';
import { getNewBaseCurrency, getBaseCurrencyAfterAdd } from '../utils/baseCurrency';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { useSelectedCurrencies } from '../hooks/useSelectedCurrencies';
import { Cryptocurrency } from '../types/crypto';

export default function CalculatorScreen() {
  const [displayValue, setDisplayValue] = useState('0');
  const [expression, setExpression] = useState('');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const [selectorVisible, setSelectorVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  // Анимация для плавной смены темы
  const themeOpacity = useRef(new Animated.Value(1)).current;

  // Подключаем локализацию
  const { language, setLanguage, t } = useLanguage();

  // Подключаем тему
  const { isDarkMode, toggleTheme } = useTheme();

  // Подключаем сохранение выбранных валют
  const {
    selectedCurrencies,
    setSelectedCurrencies,
    baseCurrency,
    setBaseCurrency
  } = useSelectedCurrencies();

  // Подключаем API для получения курсов криптовалют
  const { cryptocurrencies, loading, refreshRates, isOffline, isUsingMockData } = useCryptoRates();

  const theme = isDarkMode ? darkTheme : lightTheme;

  // Показываем загрузочный экран только при первой загрузке
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Функция переключения темы
  const handleToggleTheme = () => {
    // Плавная fade-анимация при смене темы
    Animated.sequence([
      Animated.timing(themeOpacity, {
        toValue: 0,
        duration: THEME_ANIMATION_DELAY,
        useNativeDriver: true,
      }),
      Animated.timing(themeOpacity, {
        toValue: 1,
        duration: THEME_ANIMATION_DELAY,
        useNativeDriver: true,
      }),
    ]).start();

    // Меняем тему в середине анимации
    setTimeout(() => {
      toggleTheme();
    }, THEME_ANIMATION_DELAY);
  };

  // Функция обновления курсов с haptic feedback
  const handleRefresh = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    refreshRates();
  }, [refreshRates]);

  // Автоматическое обновление курсов
  useEffect(() => {
    const interval = setInterval(() => {
      refreshRates();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [refreshRates]);

  useEffect(() => {
    if (cryptocurrencies.length > 0) {
      if (__DEV__) {
        console.log('Загружено криптовалют:', cryptocurrencies.length);
      }

      // Скрываем загрузочный экран после первой загрузки
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }

      // Устанавливаем USDT и BTC как базовые валюты по умолчанию
      if (selectedCurrencies.length === 0) {
        const usdt = cryptocurrencies.find(c => c.symbol.toLowerCase() === 'usdt');
        const btc = cryptocurrencies.find(c => c.symbol.toLowerCase() === 'btc');
        const eth = cryptocurrencies.find(c => c.symbol.toLowerCase() === 'eth');

        const defaultCurrencies = [usdt, btc, eth].filter(Boolean) as Cryptocurrency[];
        setSelectedCurrencies(defaultCurrencies);

        if (usdt && !baseCurrency) {
          setBaseCurrency(usdt);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cryptocurrencies, isInitialLoad]);

  const handleToggleCurrency = useCallback((crypto: Cryptocurrency) => {
    const isSelected = selectedCurrencies.some(c => c.id === crypto.id);

    if (isSelected) {
      // Удаляем валюту из выбранных
      const newCurrencies = selectedCurrencies.filter(c => c.id !== crypto.id);
      setSelectedCurrencies(newCurrencies);
      setBaseCurrency(getNewBaseCurrency(crypto, baseCurrency, newCurrencies));
    } else {
      // Добавляем валюту в выбранные
      const newCurrencies = [...selectedCurrencies, crypto];
      setSelectedCurrencies(newCurrencies);
      setBaseCurrency(getBaseCurrencyAfterAdd(baseCurrency, crypto, selectedCurrencies.length === 0));
    }
  }, [selectedCurrencies, baseCurrency]);

  const handleRemoveCurrency = useCallback((crypto: Cryptocurrency) => {
    const newCurrencies = selectedCurrencies.filter(c => c.id !== crypto.id);
    setSelectedCurrencies(newCurrencies);
    setBaseCurrency(getNewBaseCurrency(crypto, baseCurrency, newCurrencies));
  }, [selectedCurrencies, baseCurrency]);

  const handleClearAll = useCallback(() => {
    setSelectedCurrencies([]);
    setBaseCurrency(null);
  }, []);

  const handleButtonPress = useCallback((value: string) => {
    if (value === 'C') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setDisplayValue(handleClear());
      setExpression('');
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(false);
      return;
    }

    if (value === '⌫') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const newValue = handleBackspace(displayValue);
      setDisplayValue(newValue);
      if (expression && !waitingForOperand) {
        const parts = expression.split(' ');
        if (parts.length > 0) {
          parts[parts.length - 1] = newValue;
          setExpression(parts.join(' '));
        }
      } else if (!expression) {
        setExpression(newValue === '0' ? '' : newValue);
      }
      return;
    }

    // Обработка скобок
    if (value === '(' || value === ')') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setExpression(expression ? expression + ' ' + value : value);
      if (value === '(') {
        setWaitingForOperand(true);
      }
      return;
    }

    if (value >= '0' && value <= '9' || value === '.') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      if (waitingForOperand) {
        setDisplayValue(value);
        setExpression(expression + ' ' + value);
        setWaitingForOperand(false);
      } else {
        const newValue = handleNumberInput(displayValue, value);
        setDisplayValue(newValue);
        if (expression && !waitingForOperand) {
          const parts = expression.split(' ');
          parts[parts.length - 1] = newValue;
          setExpression(parts.join(' '));
        } else if (!expression) {
          setExpression(newValue);
        }
      }
      return;
    }

    if (value === '=') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Если есть выражение со скобками, вычисляем его
      if (expression.includes('(') || expression.includes(')')) {
        try {
          // Безопасное вычисление выражения без eval()
          const result = evaluateExpression(expression);
          setDisplayValue(String(result));
          setExpression('');
          setPreviousValue(null);
          setOperation(null);
          setWaitingForOperand(false);
        } catch (error) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setDisplayValue(ERROR_VALUE);
          setExpression('');
        }
      } else {
        const result = handleEquals(displayValue, previousValue, operation);
        setDisplayValue(result);
        setExpression('');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(false);
      }
      return;
    }

    if (['+', '-', '*', '/'].includes(value)) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const result = handleOperation(displayValue, value, previousValue, operation);
      setDisplayValue(result.displayValue);
      setExpression(expression ? expression + ' ' + value : result.displayValue + ' ' + value);
      setPreviousValue(result.storedValue);
      setOperation(result.storedOperation);
      setWaitingForOperand(true);
      return;
    }
  }, [displayValue, expression, previousValue, operation, waitingForOperand, t]);

  const buttons = [
    [
      { value: 'C', type: 'clear' as const },
      { value: '(', type: 'operator' as const },
      { value: ')', type: 'operator' as const },
      { value: '/', type: 'operator' as const },
    ],
    [
      { value: '7', type: 'number' as const },
      { value: '8', type: 'number' as const },
      { value: '9', type: 'number' as const },
      { value: '*', type: 'operator' as const },
    ],
    [
      { value: '4', type: 'number' as const },
      { value: '5', type: 'number' as const },
      { value: '6', type: 'number' as const },
      { value: '-', type: 'operator' as const },
    ],
    [
      { value: '1', type: 'number' as const },
      { value: '2', type: 'number' as const },
      { value: '3', type: 'number' as const },
      { value: '+', type: 'operator' as const },
    ],
    [
      { value: '0', type: 'number' as const },
      { value: '.', type: 'number' as const },
      { value: '=', type: 'equal' as const },
      { value: '⌫', type: 'clear' as const },
    ],
  ];

  // Показываем загрузочный экран при первой загрузке
  if (isInitialLoad && loading) {
    return <LoadingScreen isDarkMode={isDarkMode} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={{ flex: 1, opacity: themeOpacity, backgroundColor: theme.background }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, paddingTop: 50 }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={handleRefresh}
              tintColor={theme.text}
              colors={[theme.text]}
              progressViewOffset={50}
            />
          }
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <Display
            value={displayValue}
            expression={expression}
            isDarkMode={isDarkMode}
            onOpenCurrencySelector={() => setSelectorVisible(true)}
            onOpenSettings={() => setSettingsVisible(true)}
            t={t}
          />

          <StatusBanner
            isOffline={isOffline}
            isUsingMockData={isUsingMockData}
            isDarkMode={isDarkMode}
            t={t}
          />

          <SelectedCurrencies
            selectedCurrencies={selectedCurrencies}
            baseCurrency={baseCurrency}
            baseAmount={parseFloat(displayValue) || 0}
            onRemoveCurrency={handleRemoveCurrency}
            onOpenSelector={() => setSelectorVisible(true)}
            onSetBaseCurrency={setBaseCurrency}
            isDarkMode={isDarkMode}
            t={t}
          />

          <View style={styles.buttonsContainer}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((button) => (
              <CalculatorButton
                key={button.value}
                value={button.value}
                type={button.type}
                onPress={handleButtonPress}
                isDarkMode={isDarkMode}
              />
            ))}
          </View>
        ))}
      </View>
      </ScrollView>

      <Modal
        visible={selectorVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setSelectorVisible(false)}
      >
        <View style={[styles.modalBackground, { backgroundColor: theme.background }]}>
          <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]} edges={['left', 'right']}>
            <CurrencySelector
              cryptocurrencies={cryptocurrencies}
              selectedCurrencies={selectedCurrencies}
              onToggleCurrency={handleToggleCurrency}
              onClearAll={handleClearAll}
              onClose={() => setSelectorVisible(false)}
              isDarkMode={isDarkMode}
              t={t}
            />
          </SafeAreaView>
        </View>
      </Modal>

      {/* Модальное окно настроек */}
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        currentLanguage={language}
        onSelectLanguage={setLanguage}
      />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonsContainer: {
    justifyContent: 'flex-end',
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  modalBackground: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
  },
});
