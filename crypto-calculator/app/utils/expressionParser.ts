/**
 * Безопасный парсер математических выражений
 * Заменяет использование eval() для вычисления выражений со скобками
 */

interface Token {
  type: 'number' | 'operator' | 'lparen' | 'rparen';
  value: string | number;
}

/**
 * Токенизация выражения
 */
function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  let currentNumber = '';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (char === ' ') {
      continue;
    }

    if (char >= '0' && char <= '9' || char === '.') {
      currentNumber += char;
    } else {
      if (currentNumber) {
        tokens.push({ type: 'number', value: parseFloat(currentNumber) });
        currentNumber = '';
      }

      if (char === '(') {
        tokens.push({ type: 'lparen', value: char });
      } else if (char === ')') {
        tokens.push({ type: 'rparen', value: char });
      } else if (['+', '-', '*', '/'].includes(char)) {
        tokens.push({ type: 'operator', value: char });
      }
    }
  }

  if (currentNumber) {
    tokens.push({ type: 'number', value: parseFloat(currentNumber) });
  }

  return tokens;
}

/**
 * Вычисление простого выражения (число оператор число)
 */
function calculate(left: number, operator: string, right: number): number {
  switch (operator) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      if (right === 0) {
        throw new Error('Division by zero');
      }
      return left / right;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
}

/**
 * Приоритет операторов
 */
function getPrecedence(operator: string): number {
  if (operator === '+' || operator === '-') return 1;
  if (operator === '*' || operator === '/') return 2;
  return 0;
}

/**
 * Преобразование инфиксной нотации в постфиксную (обратная польская нотация)
 */
function infixToPostfix(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const operators: Token[] = [];

  for (const token of tokens) {
    if (token.type === 'number') {
      output.push(token);
    } else if (token.type === 'operator') {
      while (
        operators.length > 0 &&
        operators[operators.length - 1].type === 'operator' &&
        getPrecedence(operators[operators.length - 1].value as string) >= getPrecedence(token.value as string)
      ) {
        output.push(operators.pop()!);
      }
      operators.push(token);
    } else if (token.type === 'lparen') {
      operators.push(token);
    } else if (token.type === 'rparen') {
      while (operators.length > 0 && operators[operators.length - 1].type !== 'lparen') {
        output.push(operators.pop()!);
      }
      if (operators.length === 0) {
        throw new Error('Mismatched parentheses');
      }
      operators.pop(); // Удаляем '('
    }
  }

  while (operators.length > 0) {
    const op = operators.pop()!;
    if (op.type === 'lparen' || op.type === 'rparen') {
      throw new Error('Mismatched parentheses');
    }
    output.push(op);
  }

  return output;
}

/**
 * Вычисление постфиксного выражения
 */
function evaluatePostfix(tokens: Token[]): number {
  const stack: number[] = [];

  for (const token of tokens) {
    if (token.type === 'number') {
      stack.push(token.value as number);
    } else if (token.type === 'operator') {
      if (stack.length < 2) {
        throw new Error('Invalid expression');
      }
      const right = stack.pop()!;
      const left = stack.pop()!;
      const result = calculate(left, token.value as string, right);
      stack.push(result);
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid expression');
  }

  return stack[0];
}

/**
 * Главная функция: безопасное вычисление математического выражения
 */
export function evaluateExpression(expression: string): number {
  // Нормализация: заменяем × и ÷ на * и /
  const normalized = expression.replace(/×/g, '*').replace(/÷/g, '/');

  // Валидация: проверяем что в выражении только разрешённые символы
  if (!/^[0-9+\-*/().\s]+$/.test(normalized)) {
    throw new Error('Invalid characters in expression');
  }

  // Токенизация
  const tokens = tokenize(normalized);

  // Преобразование в постфиксную нотацию
  const postfix = infixToPostfix(tokens);

  // Вычисление
  const result = evaluatePostfix(postfix);

  // Проверка на Infinity и NaN
  if (!isFinite(result)) {
    throw new Error('Result is not finite');
  }

  return result;
}
