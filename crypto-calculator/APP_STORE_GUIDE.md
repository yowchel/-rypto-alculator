# Руководство по публикации в App Store

## Подготовка к публикации

### 1. Создание иконки и графических материалов

#### Требования к иконке:
- **Размер**: 1024x1024 пикселей
- **Формат**: PNG (без прозрачности)
- **Цветовое пространство**: RGB
- **Стиль**: Минималистичный, узнаваемый дизайн с символом калькулятора и криптовалюты

**Рекомендации для дизайна:**
- Используйте градиент из темы приложения (графитовые оттенки)
- Добавьте символ калькулятора (цифры, кнопки)
- Можно добавить символ Bitcoin (₿) или другой крипто-символ
- Избегайте мелких деталей - иконка должна хорошо выглядеть в маленьком размере

#### Скриншоты для App Store:

**iPhone (обязательно):**
- 6.7" display (iPhone 15 Pro Max): 1290 x 2796 px
- 6.5" display (iPhone 14 Plus): 1284 x 2778 px

**Что показать на скриншотах:**
1. Главный экран калькулятора (светлая тема)
2. Главный экран калькулятора (тёмная тема)
3. Выбор криптовалюты
4. Пример расчёта
5. Swipe для смены темы (с подсказкой)

### 2. Регистрация в Apple Developer Program

1. Перейдите на https://developer.apple.com
2. Зарегистрируйтесь ($99/год)
3. Создайте App ID в Apple Developer Console
4. Создайте сертификаты и provisioning profiles

### 3. Настройка проекта

#### Обновите `app.json`:

```json
{
  "expo": {
    "name": "Crypto Calculator",
    "slug": "crypto-calculator",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourname.cryptocalculator",
      "buildNumber": "1",
      ...
    }
  }
}
```

Замените:
- `com.yourname.cryptocalculator` на ваш Bundle Identifier
- Убедитесь что версия и buildNumber корректны

#### Обновите `eas.json`:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-app-id",
        "appleTeamId": "your-team-id"
      }
    }
  }
}
```

### 4. Установка EAS CLI

```bash
npm install -g eas-cli
eas login
```

### 5. Создание проекта в App Store Connect

1. Перейдите на https://appstoreconnect.apple.com
2. Нажмите "My Apps" → "+" → "New App"
3. Заполните информацию:
   - **Name**: Crypto Calculator
   - **Primary Language**: Russian
   - **Bundle ID**: выберите созданный ранее
   - **SKU**: crypto-calculator-1

### 6. Подготовка метаданных

#### App Information:
- **Name**: Crypto Calculator
- **Subtitle**: Быстрый расчёт криптовалют
- **Description**:

```
Crypto Calculator - удобный и простой калькулятор для расчёта криптовалют в реальном времени.

ОСНОВНЫЕ ВОЗМОЖНОСТИ:
• Поддержка 100+ криптовалют (Bitcoin, Ethereum, и др.)
• Актуальные курсы в реальном времени от CoinGecko
• Удобный калькулятор с поддержкой скобок
• Светлая и тёмная темы (переключение свайпом)
• Минималистичный дизайн
• Работает без регистрации

КОНФИДЕНЦИАЛЬНОСТЬ:
• Не собираем персональные данные
• Все расчёты выполняются локально на устройстве
• Не требуется регистрация

БЕСПЛАТНО И БЕЗ РЕКЛАМЫ
Полностью бесплатное приложение без встроенных покупок и рекламы.

Идеально подходит для:
- Трейдеров и инвесторов
- Людей, интересующихся криптовалютами
- Быстрых расчётов курсов криптовалют
```

#### Keywords (100 символов макс):
```
crypto,bitcoin,ethereum,calculator,калькулятор,криптовалюта,btc,eth
```

#### Categories:
- Primary: Finance
- Secondary: Utilities

#### Support URL:
Создайте страницу с описанием или используйте GitHub repo

#### Privacy Policy URL:
Разместите PRIVACY_POLICY.md на GitHub Pages или другом хостинге

### 7. Build и отправка в App Store

#### Создайте production build:

```bash
# Убедитесь что установлен EAS CLI
eas build --platform ios --profile production

# Дождитесь завершения build (это может занять 15-30 минут)
# Build будет автоматически загружен
```

#### Отправка в App Store:

```bash
eas submit --platform ios --profile production
```

### 8. Подготовка к ревью

1. **App Review Information**:
   - Укажите контактные данные
   - Добавьте заметки для ревьюера (опционально)

2. **Version Information**:
   - Загрузите скриншоты (минимум 3, максимум 10)
   - Добавьте описание и ключевые слова
   - Выберите возрастной рейтинг

3. **Pricing**:
   - Выберите "Free" (бесплатно)
   - Выберите страны для распространения

### 9. Отправка на ревью

1. Проверьте всю информацию
2. Нажмите "Submit for Review"
3. Дождитесь проверки (обычно 1-3 дня)

### 10. После одобрения

- Приложение автоматически появится в App Store
- Вы получите уведомление на email
- Можно настроить автоматический или ручной релиз

## Обновления приложения

Для выпуска обновления:

1. Обновите версию в `app.json`:
   ```json
   {
     "version": "1.1.0",
     "ios": {
       "buildNumber": "2"
     }
   }
   ```

2. Создайте новый build:
   ```bash
   eas build --platform ios --profile production
   ```

3. Отправьте в App Store:
   ```bash
   eas submit --platform ios --profile production
   ```

4. Добавьте описание изменений (What's New) в App Store Connect

## Важные замечания

- **Проверьте политику конфиденциальности**: Убедитесь что URL доступен
- **Тестирование**: Протестируйте все функции перед отправкой
- **Версионность**: Всегда увеличивайте `buildNumber` для каждого нового build
- **Сертификаты**: Проверьте срок действия сертификатов

## Полезные ссылки

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

## Контрольный список перед отправкой

- [ ] Создана иконка 1024x1024
- [ ] Подготовлены скриншоты (минимум 3)
- [ ] Политика конфиденциальности размещена онлайн
- [ ] Bundle ID соответствует зарегистрированному
- [ ] Версия и buildNumber обновлены
- [ ] Приложение протестировано на реальном устройстве
- [ ] Заполнены все обязательные поля в App Store Connect
- [ ] Проверена работа offline режима
- [ ] Проверено переключение тем
- [ ] API ошибки обрабатываются корректно
