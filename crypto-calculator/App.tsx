import { StatusBar } from 'expo-status-bar';
import CalculatorScreen from './app/screens/CalculatorScreen';

export default function App() {
  return (
    <>
      <CalculatorScreen />
      <StatusBar style="auto" />
    </>
  );
}
