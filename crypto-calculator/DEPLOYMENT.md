# Инструкция по публикации в App Store

## Подготовка завершена

### ✅ Выполненные задачи:

1. **Исправлена критическая уязвимость безопасности**
   - Заменён небезопасный `eval()` на собственный парсер выражений
   - Файл: [app/utils/expressionParser.ts](app/utils/expressionParser.ts)

2. **Настроен app.json для App Store**
   - Обновлено название: "Crypto Calculator"
   - Bundle ID: `com.yshevchuk.cryptocalculator`
   - Добавлено описание и метаданные
   - Файл: [app.json](app.json)

3. **Создана политика конфиденциальности**
   - Файл: [PRIVACY_POLICY.md](PRIVACY_POLICY.md)
   - Требуется разместить онлайн перед публикацией

4. **Настроена конфигурация для EAS Build**
   - Файл: [eas.json](eas.json)
   - Профили: development, preview, production

5. **Улучшена обработка ошибок API**
   - Добавлена проверка интернет-подключения
   - Детальное логирование ошибок
   - Fallback на локальные данные
   - Файлы: [app/services/api.ts](app/services/api.ts), [app/hooks/useCryptoRates.ts](app/hooks/useCryptoRates.ts)

## Что осталось сделать

### 1. Создать графические материалы

#### Иконка приложения (1024x1024 px):
```
Требования:
- Размер: 1024 x 1024 пикселей
- Формат: PNG без прозрачности
- Цветовое пространство: RGB
- Дизайн: Минималистичный с символами калькулятора и криптовалюты
```

**Рекомендации:**
- Используйте графитовые оттенки из темы приложения
- Добавьте символ калькулятора (цифры, кнопки)
- Можно добавить Bitcoin символ (₿)
- Избегайте мелких деталей

**Инструменты для создания:**
- Figma (https://figma.com)
- Sketch
- Adobe Illustrator
- Canva

#### Скриншоты (минимум 3-5 штук):

**Размеры для iPhone:**
- 6.7" display: 1290 x 2796 px
- 6.5" display: 1284 x 2778 px

**Что показать:**
1. Главный экран (светлая тема)
2. Главный экран (тёмная тема)
3. Выбор криптовалюты
4. Пример расчёта
5. Подсказка о свайпе

### 2. Регистрация Apple Developer Account

1. Перейдите: https://developer.apple.com
2. Зарегистрируйтесь ($99/год)
3. Создайте App ID с Bundle Identifier: `com.yshevchuk.cryptocalculator`

### 3. Установка EAS CLI и настройка

```bash
# Установить EAS CLI
npm install -g eas-cli

# Войти в аккаунт Expo
eas login

# Настроить проект (если ещё не настроен)
eas build:configure
```

### 4. Обновить eas.json вашими данными

Откройте [eas.json](eas.json) и обновите:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",        // ВАШ Apple ID
        "ascAppId": "your-app-store-connect-app-id", // ID из App Store Connect
        "appleTeamId": "your-team-id"                // Team ID из Developer Portal
      }
    }
  }
}
```

### 5. Создать приложение в App Store Connect

1. Перейдите: https://appstoreconnect.apple.com
2. My Apps → "+" → New App
3. Заполните:
   - **Name**: Crypto Calculator
   - **Primary Language**: Russian
   - **Bundle ID**: com.yshevchuk.cryptocalculator
   - **SKU**: crypto-calculator-1

### 6. Разместить политику конфиденциальности онлайн

Варианты:
- GitHub Pages (бесплатно)
- Ваш веб-сайт
- Medium / Notion (публичная страница)

**Пример для GitHub Pages:**
```bash
# В репозитории создайте ветку gh-pages
git checkout -b gh-pages
git push origin gh-pages

# Включите GitHub Pages в Settings → Pages
# URL будет: https://username.github.io/repo-name/PRIVACY_POLICY.html
```

### 7. Build приложения

```bash
# Создать production build
eas build --platform ios --profile production

# Процесс займёт 15-30 минут
# После завершения получите ссылку на .ipa файл
```

### 8. Отправка в App Store

```bash
# Submit в App Store
eas submit --platform ios --profile production

# Следуйте инструкциям в терминале
```

### 9. Заполнение метаданных в App Store Connect

#### App Information:
- **Name**: Crypto Calculator
- **Subtitle**: Быстрый расчёт криптовалют
- **Category**: Finance (Primary), Utilities (Secondary)

#### Description:
```
Crypto Calculator - удобный и простой калькулятор для расчёта криптовалют в реальном времени.

ОСНОВНЫЕ ВОЗМОЖНОСТИ:
• Поддержка 100+ криптовалют (Bitcoin, Ethereum, Solana и др.)
• Актуальные курсы в реальном времени от CoinGecko
• Удобный калькулятор с поддержкой скобок
• Светлая и тёмная темы (переключение свайпом)
• Минималистичный дизайн
• Работает без регистрации

КОНФИДЕНЦИАЛЬНОСТЬ:
• Не собираем персональные данные
• Все расчёты выполняются локально
• Не требуется регистрация

БЕСПЛАТНО И БЕЗ РЕКЛАМЫ
Полностью бесплатное приложение без встроенных покупок и рекламы.
```

#### Keywords (макс 100 символов):
```
crypto,bitcoin,ethereum,calculator,калькулятор,криптовалюта,btc
```

#### Screenshots:
- Загрузите подготовленные скриншоты

#### Support URL:
- Укажите URL вашего GitHub репозитория или сайта

#### Privacy Policy URL:
- Укажите URL размещённой политики конфиденциальности

### 10. Submit for Review

1. Проверьте всю информацию
2. Выберите "Pricing and Availability": Free
3. Нажмите "Submit for Review"
4. Дождитесь одобрения (обычно 1-3 дня)

## Тестирование перед публикацией

### Контрольный список:

- [ ] Приложение запускается без ошибок
- [ ] Калькулятор работает корректно
- [ ] Выбор криптовалюты работает
- [ ] Курсы загружаются (или показываются локальные)
- [ ] Работает offline режим
- [ ] Переключение тем свайпом работает
- [ ] Подсказка показывается при первом запуске
- [ ] Нет критических багов
- [ ] Протестировано на разных размерах iPhone

### Команды для тестирования:

```bash
# Запуск на iOS Simulator
npm run ios

# Build preview версии для тестирования
eas build --platform ios --profile preview

# После build установите на физическое устройство
```

## После публикации

### Мониторинг:
- Проверяйте отзывы в App Store
- Отслеживайте краши (если настроен Sentry или другой сервис)

### Обновления:

Для выпуска обновления:

1. Обновите версию:
```json
// app.json
{
  "version": "1.1.0",
  "ios": {
    "buildNumber": "2"  // Увеличьте на 1
  }
}
```

2. Создайте новый build:
```bash
eas build --platform ios --profile production
```

3. Submit:
```bash
eas submit --platform ios --profile production
```

4. Добавьте "What's New" в App Store Connect

## Полезные ссылки

- [Expo EAS Documentation](https://docs.expo.dev/build/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

## Поддержка

Если возникли вопросы:
- Expo Forums: https://forums.expo.dev/
- Stack Overflow: [expo], [react-native]
- Apple Developer Forums: https://developer.apple.com/forums/
