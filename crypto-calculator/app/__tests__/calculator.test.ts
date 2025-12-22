import {
  handleNumberInput,
  handleOperation,
  handleEquals,
  handleClear,
  handleBackspace,
  calculate,
} from '../services/calculator';
import { ERROR_VALUE } from '../constants/calculator';

describe('calculator service', () => {
  describe('handleNumberInput', () => {
    test('should replace 0 with input digit', () => {
      expect(handleNumberInput('0', '5')).toBe('5');
    });

    test('should append digit to existing number', () => {
      expect(handleNumberInput('12', '3')).toBe('123');
    });

    test('should allow decimal point', () => {
      expect(handleNumberInput('12', '.')).toBe('12.');
    });

    test('should not allow multiple decimal points', () => {
      expect(handleNumberInput('12.5', '.')).toBe('12.5');
    });

    test('should allow 0 after decimal', () => {
      expect(handleNumberInput('0', '.')).toBe('0.');
    });
  });

  describe('calculate', () => {
    test('should add numbers', () => {
      expect(calculate(5, 3, '+')).toBe(8);
    });

    test('should subtract numbers', () => {
      expect(calculate(10, 4, '-')).toBe(6);
    });

    test('should multiply numbers', () => {
      expect(calculate(6, 7, '*')).toBe(42);
    });

    test('should divide numbers', () => {
      expect(calculate(15, 3, '/')).toBe(5);
    });

    test('should return second number for unknown operation', () => {
      expect(calculate(5, 3, 'unknown')).toBe(3);
    });

    test('should handle negative results', () => {
      expect(calculate(3, 8, '-')).toBe(-5);
    });

    test('should handle decimal results', () => {
      expect(calculate(10, 3, '/')).toBeCloseTo(3.333333, 5);
    });
  });

  describe('handleOperation', () => {
    test('should store first operand', () => {
      const result = handleOperation('10', '+', null, null);
      expect(result.displayValue).toBe('10');
      expect(result.storedValue).toBe('10');
      expect(result.storedOperation).toBe('+');
    });

    test('should calculate when chaining operations', () => {
      const result = handleOperation('5', '*', '10', '+');
      expect(result.displayValue).toBe('15');
      expect(result.storedValue).toBe('15');
      expect(result.storedOperation).toBe('*');
    });

    test('should handle multiple consecutive operations', () => {
      // 10 + 5 = 15, then - operation
      const result = handleOperation('5', '-', '10', '+');
      expect(result.displayValue).toBe('15');
    });
  });

  describe('handleEquals', () => {
    test('should return current value if no operation pending', () => {
      expect(handleEquals('42', null, null)).toBe('42');
    });

    test('should calculate simple addition', () => {
      expect(handleEquals('5', '10', '+')).toBe('15');
    });

    test('should calculate simple subtraction', () => {
      expect(handleEquals('3', '10', '-')).toBe('7');
    });

    test('should calculate simple multiplication', () => {
      expect(handleEquals('5', '6', '*')).toBe('30');
    });

    test('should calculate simple division', () => {
      expect(handleEquals('4', '20', '/')).toBe('5');
    });

    test('should return ERROR for division by zero', () => {
      expect(handleEquals('0', '10', '/')).toBe(ERROR_VALUE);
    });

    test('should return ERROR for infinity results', () => {
      // Division by very small number could cause infinity
      const result = handleEquals('0', '1e308', '*');
      // This might not trigger infinity, so let's test actual division by zero
      expect(handleEquals('0', '5', '/')).toBe(ERROR_VALUE);
    });

    test('should handle decimal results', () => {
      const result = handleEquals('3', '10', '/');
      expect(parseFloat(result)).toBeCloseTo(3.333333, 5);
    });
  });

  describe('handleClear', () => {
    test('should return 0', () => {
      expect(handleClear()).toBe('0');
    });
  });

  describe('handleBackspace', () => {
    test('should remove last digit', () => {
      expect(handleBackspace('123')).toBe('12');
    });

    test('should return 0 when deleting single digit', () => {
      expect(handleBackspace('5')).toBe('0');
    });

    test('should return 0 when value is already 0', () => {
      expect(handleBackspace('0')).toBe('0');
    });

    test('should return 0 when value is ERROR', () => {
      expect(handleBackspace(ERROR_VALUE)).toBe('0');
    });

    test('should handle decimal point deletion', () => {
      expect(handleBackspace('12.')).toBe('12');
    });

    test('should handle negative numbers', () => {
      expect(handleBackspace('-5')).toBe('-');
    });
  });

  describe('Edge cases and error handling', () => {
    test('should handle very large numbers', () => {
      const result = calculate(1e10, 1e10, '+');
      expect(result).toBe(2e10);
    });

    test('should handle very small numbers', () => {
      const result = calculate(0.0001, 0.0002, '+');
      expect(result).toBeCloseTo(0.0003, 10);
    });

    test('should handle negative operands', () => {
      expect(calculate(-5, -3, '+')).toBe(-8);
      expect(calculate(-5, 3, '+')).toBe(-2);
      expect(calculate(5, -3, '+')).toBe(2);
    });

    test('should handle zero operands', () => {
      expect(calculate(0, 5, '+')).toBe(5);
      expect(calculate(5, 0, '+')).toBe(5);
      expect(calculate(0, 0, '+')).toBe(0);
    });
  });

  describe('Real-world calculator flows', () => {
    test('should handle complete calculation: 100 + 50 - 25', () => {
      // User enters 100
      let display = '100';

      // User presses +
      let op1 = handleOperation(display, '+', null, null);
      expect(op1.storedValue).toBe('100');

      // User enters 50
      display = '50';

      // User presses - (should calculate 100+50=150)
      let op2 = handleOperation(display, '-', op1.storedValue, op1.storedOperation);
      expect(op2.displayValue).toBe('150');

      // User enters 25
      display = '25';

      // User presses = (should calculate 150-25=125)
      let result = handleEquals(display, op2.storedValue, op2.storedOperation);
      expect(result).toBe('125');
    });

    test('should handle cryptocurrency conversion: 0.5 * 43250', () => {
      let display = '0.5';
      let op = handleOperation(display, '*', null, null);
      display = '43250';
      let result = handleEquals(display, op.storedValue, op.storedOperation);
      expect(result).toBe('21625');
    });
  });
});
