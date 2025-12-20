import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, translations } from '../i18n/translations';

const LANGUAGE_KEY = '@app_language';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('ru');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage && (savedLanguage === 'ru' || savedLanguage === 'en')) {
        setLanguage(savedLanguage as Language);
      }
    } catch (error) {
      if (__DEV__) {
        console.log('Error loading language:', error);
      }
    } finally{
      setIsLoading(false);
    }
  };

  const changeLanguage = async (newLanguage: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      if (__DEV__) {
        console.log('Error saving language:', error);
      }
    }
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'ru' ? 'en' : 'ru';
    changeLanguage(newLanguage);
  };

  const t = translations[language];

  return {
    language,
    setLanguage: changeLanguage,
    toggleLanguage,
    t,
    isLoading,
  };
};
