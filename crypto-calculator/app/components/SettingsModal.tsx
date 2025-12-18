import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { XIcon, SunIcon, MoonIcon } from 'phosphor-react-native';
import { lightTheme } from '../constants/colors';
import { Language } from '../i18n/translations';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export default function SettingsModal({
  visible,
  onClose,
  isDarkMode,
  onToggleTheme,
  currentLanguage,
  onSelectLanguage,
}: SettingsModalProps) {
  const theme = isDarkMode ? require('../constants/colors').darkTheme : lightTheme;

  const handleThemeToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggleTheme();
  };

  const handleLanguageSelect = (lang: Language) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelectLanguage(lang);
  };


  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            {currentLanguage === 'ru' ? 'Настройки' : 'Settings'}
          </Text>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onClose();
            }}
            style={styles.closeButton}
          >
            <XIcon color={theme.text} size={28} weight="regular" style={styles.icon} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Секция темы */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>
              {currentLanguage === 'ru' ? 'Тема' : 'Theme'}
            </Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: !isDarkMode ? theme.primaryButton : theme.secondaryBackground,
                    borderColor: !isDarkMode ? theme.primaryButton : theme.border,
                  }
                ]}
                onPress={handleThemeToggle}
                activeOpacity={0.7}
              >
                <SunIcon
                  color={!isDarkMode ? '#FFFFFF' : theme.secondaryText}
                  size={24}
                  weight={!isDarkMode ? 'fill' : 'regular'}
                />
                <Text style={[
                  styles.optionText,
                  { color: !isDarkMode ? '#FFFFFF' : theme.secondaryText }
                ]}>
                  {currentLanguage === 'ru' ? 'Светлая' : 'Light'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: isDarkMode ? theme.primaryButton : theme.secondaryBackground,
                    borderColor: isDarkMode ? theme.primaryButton : theme.border,
                  }
                ]}
                onPress={handleThemeToggle}
                activeOpacity={0.7}
              >
                <MoonIcon
                  color={isDarkMode ? '#FFFFFF' : theme.secondaryText}
                  size={24}
                  weight={isDarkMode ? 'fill' : 'regular'}
                />
                <Text style={[
                  styles.optionText,
                  { color: isDarkMode ? '#FFFFFF' : theme.secondaryText }
                ]}>
                  {currentLanguage === 'ru' ? 'Тёмная' : 'Dark'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Секция языка */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>
              {currentLanguage === 'ru' ? 'Язык' : 'Language'}
            </Text>
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: currentLanguage === 'ru' ? theme.primaryButton : theme.secondaryBackground,
                    borderColor: currentLanguage === 'ru' ? theme.primaryButton : theme.border,
                  }
                ]}
                onPress={() => handleLanguageSelect('ru')}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 24 }}>🇷🇺</Text>
                <Text style={[
                  styles.optionText,
                  { color: currentLanguage === 'ru' ? '#FFFFFF' : theme.secondaryText }
                ]}>
                  Русский
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.optionButton,
                  {
                    backgroundColor: currentLanguage === 'en' ? theme.primaryButton : theme.secondaryBackground,
                    borderColor: currentLanguage === 'en' ? theme.primaryButton : theme.border,
                  }
                ]}
                onPress={() => handleLanguageSelect('en')}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 24 }}>🇬🇧</Text>
                <Text style={[
                  styles.optionText,
                  { color: currentLanguage === 'en' ? '#FFFFFF' : theme.secondaryText }
                ]}>
                  English
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    pointerEvents: 'none',
  },
  iconWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 28,
    fontWeight: '400',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  themeIcon: {
    fontSize: 24,
  },
});
