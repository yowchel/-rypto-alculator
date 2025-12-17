export const handleNumberInput = (currentValue: string, input: string): string => {
  if (currentValue === '0' && input !== '.') {
    return input;
  }

  if (input === '.' && currentValue.includes('.')) {
    return currentValue;
  }

  return currentValue + input;
};

export const handleOperation = (
  currentValue: string,
  operation: string,
  previousValue: string | null,
  previousOperation: string | null
): { displayValue: string; storedValue: string; storedOperation: string } => {
  const current = parseFloat(currentValue);

  if (previousValue !== null && previousOperation !== null) {
    const result = calculate(parseFloat(previousValue), current, previousOperation);
    return {
      displayValue: result.toString(),
      storedValue: result.toString(),
      storedOperation: operation,
    };
  }

  return {
    displayValue: currentValue,
    storedValue: currentValue,
    storedOperation: operation,
  };
};

export const calculate = (a: number, b: number, operation: string): number => {
  switch (operation) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return a / b;
    default:
      return b;
  }
};

export const handleEquals = (
  currentValue: string,
  previousValue: string | null,
  previousOperation: string | null
): string => {
  if (previousValue === null || previousOperation === null) {
    return currentValue;
  }

  try {
    const a = parseFloat(previousValue);
    const b = parseFloat(currentValue);

    // Проверка деления на ноль
    if (previousOperation === '/' && b === 0) {
      return 'Error';
    }

    const result = calculate(a, b, previousOperation);

    // Проверка на Infinity и NaN
    if (!isFinite(result)) {
      return 'Error';
    }

    return result.toString();
  } catch (error) {
    return 'Error';
  }
};

export const handleClear = (): string => {
  return '0';
};

export const handleBackspace = (currentValue: string): string => {
  if (currentValue === '0' || currentValue === 'Error') {
    return '0';
  }

  if (currentValue.length === 1) {
    return '0';
  }

  return currentValue.slice(0, -1);
};
