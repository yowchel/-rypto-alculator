import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Modal } from 'react-native';
import Display from '../components/Display';
import CalculatorButton from '../components/CalculatorButton';
import SelectedCurrencies from '../components/SelectedCurrencies';
import CurrencySelector from '../components/CurrencySelector';
import { lightTheme } from '../constants/colors';
import {
  handleNumberInput,
  handleOperation,
  handleEquals,
  handleClear,
  handleBackspace,
} from '../services/calculator';
import { useCryptoRates } from '../hooks/useCryptoRates';
import { Cryptocurrency } from '../types/crypto';

export default function CalculatorScreen() {
  const [displayValue, setDisplayValue] = useState('0');
  const [expression, setExpression] = useState('');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Состояние для выбранных валют (отображаются вверху)
  const [selectedCurrencies, setSelectedCurrencies] = useState<Cryptocurrency[]>([]);
  const [baseCurrency, setBaseCurrency] = useState<Cryptocurrency | null>(null);
  const [selectorVisible, setSelectorVisible] = useState(false);

  const theme = isDarkMode ? require('../constants/colors').darkTheme : lightTheme;

  // Подключаем API для получения курсов криптовалют
  const { cryptocurrencies } = useCryptoRates();

  useEffect(() => {
    if (cryptocurrencies.length > 0) {
      console.log('Загружено криптовалют:', cryptocurrencies.length);

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
  }, [cryptocurrencies]);

  const handleToggleCurrency = (crypto: Cryptocurrency) => {
    const isSelected = selectedCurrencies.some(c => c.id === crypto.id);

    if (isSelected) {
      // Удаляем валюту из выбранных
      setSelectedCurrencies(prev => prev.filter(c => c.id !== crypto.id));

      // Если удалили базовую валюту, выбираем первую из оставшихся
      if (baseCurrency?.id === crypto.id) {
        const remaining = selectedCurrencies.filter(c => c.id !== crypto.id);
        setBaseCurrency(remaining.length > 0 ? remaining[0] : null);
      }
    } else {
      // Добавляем валюту в выбранные
      setSelectedCurrencies(prev => [...prev, crypto]);

      // Если это первая валюта, делаем её базовой
      if (selectedCurrencies.length === 0) {
        setBaseCurrency(crypto);
      }
    }
  };

  const handleRemoveCurrency = (crypto: Cryptocurrency) => {
    setSelectedCurrencies(prev => prev.filter(c => c.id !== crypto.id));

    // Если удалили базовую валюту, выбираем первую из оставшихся
    if (baseCurrency?.id === crypto.id) {
      const remaining = selectedCurrencies.filter(c => c.id !== crypto.id);
      setBaseCurrency(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const handleClearAll = () => {
    setSelectedCurrencies([]);
    setBaseCurrency(null);
  };

  const handleButtonPress = (value: string) => {
    if (value === 'C') {
      setDisplayValue(handleClear());
      setExpression('');
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(false);
      return;
    }

    if (value === '⌫') {
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
      setExpression(expression ? expression + ' ' + value : value);
      if (value === '(') {
        setWaitingForOperand(true);
      }
      return;
    }

    if (value >= '0' && value <= '9' || value === '.') {
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
      // Если есть выражение со скобками, вычисляем его
      if (expression.includes('(') || expression.includes(')')) {
        try {
          // Безопасное вычисление выражения
          const result = eval(expression.replace(/×/g, '*').replace(/÷/g, '/'));
          setDisplayValue(String(result));
          setExpression('');
          setPreviousValue(null);
          setOperation(null);
          setWaitingForOperand(false);
        } catch (error) {
          setDisplayValue('Ошибка');
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
      const result = handleOperation(displayValue, value, previousValue, operation);
      setDisplayValue(result.displayValue);
      setExpression(expression ? expression + ' ' + value : result.displayValue + ' ' + value);
      setPreviousValue(result.storedValue);
      setOperation(result.storedOperation);
      setWaitingForOperand(true);
      return;
    }
  };

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Display
        value={displayValue}
        expression={expression}
        isDarkMode={isDarkMode}
        onOpenCurrencySelector={() => setSelectorVisible(true)}
      />

      <SelectedCurrencies
        selectedCurrencies={selectedCurrencies}
        baseCurrency={baseCurrency}
        baseAmount={parseFloat(displayValue) || 0}
        onRemoveCurrency={handleRemoveCurrency}
        onOpenSelector={() => setSelectorVisible(true)}
        onSetBaseCurrency={setBaseCurrency}
        isDarkMode={isDarkMode}
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

      <Modal
        visible={selectorVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectorVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <CurrencySelector
            cryptocurrencies={cryptocurrencies}
            selectedCurrencies={selectedCurrencies}
            onToggleCurrency={handleToggleCurrency}
            onClearAll={handleClearAll}
            onClose={() => setSelectorVisible(false)}
            isDarkMode={isDarkMode}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonsContainer: {
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
  },
});
