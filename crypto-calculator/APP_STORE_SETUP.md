# Настройка App Store Connect - Пошаговая Инструкция

Это руководство поможет вам подготовить приложение Crypto Calculator к публикации в App Store.

---

## 📋 ЧЕКЛИСТ ПЕРЕД НАЧАЛОМ

- [ ] У вас есть Apple Developer аккаунт ($99/год)
- [ ] Вы авторизованы в EAS CLI (`eas login`)
- [ ] У вас есть 5 iPhone скриншотов (1284×2778)
- [ ] У вас есть 3 iPad скриншота (2048×2732)
- [ ] Вы выбрали логотип приложения (1024×1024)

---

## ЭТАП 1: Настройка EAS Project (10 минут)

### 1.1 Авторизация в EAS

```bash
cd /Users/yanashevchuk/Documents/-rypto-alculator/crypto-calculator
npx eas-cli login
```

Введите ваши учётные данные Expo:
- Email: `hi@architeq.io` (или ваш email)
- Password: `********`

### 1.2 Инициализация проекта

```bash
npx eas-cli init
```

Команда создаст:
- Project ID в вашем Expo аккаунте
- Обновит `app.json` с реальным `projectId`

**Ожидаемый результат:**
```
✔ Project successfully linked (ID: abc123xyz...)
```

### 1.3 Проверка конфигурации

Откройте `app.json` и убедитесь, что `projectId` больше не placeholder:

```json
"extra": {
  "eas": {
    "projectId": "реальный-project-id-здесь"
  }
}
```

---

## ЭТАП 2: Apple Developer Setup (30 минут)

### 2.1 Создание App в App Store Connect

1. Перейдите на [App Store Connect](https://appstoreconnect.apple.com/)
2. Войдите с Apple ID: `hi@architeq.io`
3. Нажмите **"My Apps"** → **"+"** → **"New App"**

### 2.2 Заполнение информации о приложении

**Basic Information:**
- **Platform**: iOS
- **Name**: `Crypto Calculator`
- **Primary Language**: English (U.S.)
- **Bundle ID**:
  - Выберите **"Register New Bundle ID"**
  - Введите: `com.yshevchuk.cryptocalculator`
- **SKU**: `crypto-calculator-001` (уникальный ID для учёта)

**User Access:**
- Role: Admin

Нажмите **"Create"**

### 2.3 Получение App ID и Team ID

После создания приложения:

**Получить ascAppId (App Store Connect App ID):**
1. В App Store Connect, откройте ваше приложение
2. Перейдите в **"App Information"**
3. Найдите **"Apple ID"** (например: `6443558899`)
4. Это ваш `ascAppId`

**Получить appleTeamId:**
1. Перейдите на [Apple Developer](https://developer.apple.com/account)
2. В меню слева выберите **"Membership"**
3. Найдите **"Team ID"** (например: `A1B2C3D4E5`)
4. Это ваш `appleTeamId`

### 2.4 Обновление eas.json

Откройте файл `eas.json` и замените placeholders:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "hi@architeq.io",
        "ascAppId": "6443558899",  // <-- Ваш реальный App Store Connect ID
        "appleTeamId": "A1B2C3D4E5"  // <-- Ваш реальный Team ID
      }
    }
  }
}
```

---

## ЭТАП 3: Подготовка Иконок (5 минут)

### 3.1 Выбор логотипа

Определитесь с логотипом (один из трёх):
- `app-icon-conversion.png` (со стрелками конвертации) ← **Рекомендуется**
- `app-icon-calculator.png` (с калькулятором)
- `app-icon-crypto.png` (крипто монета)

### 3.2 Генерация всех размеров иконок

```bash
cd /Users/yanashevchuk/Documents/-rypto-alculator
python3 prepare-app-icons.py app-icon-conversion.png
```

### 3.3 Копирование иконок в проект

```bash
cp -r app-icons-output/* crypto-calculator/assets/
```

---

## ЭТАП 4: Подготовка Скриншотов

### 4.1 Размещение скриншотов

Убедитесь что у вас есть скриншоты в правильных папках:

```
crypto-calculator/assets/screenshots/
├── iphone/
│   ├── 01-calculator-main.png (1284×2778)
│   ├── 02-calculator-expression.png
│   ├── 03-currency-selector.png
│   ├── 04-settings.png
│   └── 05-dark-mode.png
└── ipad/
    ├── 01-main-view.png (2048×2732)
    ├── 02-dark-mode.png
    └── 03-currency-picker.png
```

### 4.2 Если скриншотов нет

Запустите скрипты для создания:

```bash
# iPhone скриншоты
./make-screenshots.sh

# iPad скриншоты
./make-ipad-screenshots.sh
```

---

## ЭТАП 5: Production Build (15-30 минут)

### 5.1 Запуск тестов

Убедитесь что все тесты проходят:

```bash
npm test
```

**Ожидаемый результат:**
```
Test Suites: 3 passed, 3 total
Tests:       90 passed, 90 total
```

### 5.2 Создание Production Build

```bash
npx eas-cli build --platform ios --profile production
```

Процесс займёт 15-30 минут. EAS Build:
1. Загрузит ваш код на облачный сервер
2. Скомпилирует iOS приложение
3. Создаст .ipa файл
4. Подпишет его вашим сертификатом

**Важно:** При первом билде EAS автоматически:
- Создаст Distribution Certificate
- Создаст Provisioning Profile
- Зарегистрирует Bundle ID в Apple Developer

### 5.3 Мониторинг билда

Следите за процессом:
```bash
npx eas-cli build:list
```

Или откройте ссылку из терминала в браузере.

---

## ЭТАП 6: Submit в App Store (10 минут)

### 6.1 Автоматическая отправка через EAS

После успешного билда:

```bash
npx eas-cli submit --platform ios --latest
```

EAS автоматически:
1. Загрузит .ipa в App Store Connect
2. Создаст новую версию приложения
3. Прикрепит билд к версии

### 6.2 Ручная отправка (альтернатива)

Если автоматическая отправка не работает:

1. Скачайте .ipa с EAS Build
2. Установите [Transporter](https://apps.apple.com/app/transporter/id1450874784)
3. Откройте Transporter и перетащите .ipa файл
4. Дождитесь завершения загрузки

---

## ЭТАП 7: App Store Connect - Метаданные

### 7.1 Информация о приложении

В [App Store Connect](https://appstoreconnect.apple.com/) заполните:

**App Information:**
- **Name**: Crypto Calculator
- **Subtitle** (опционально): Fast crypto conversion tool
- **Category**: Finance → Primary, Utilities → Secondary

**Pricing and Availability:**
- **Price**: Free
- **Availability**: All countries

### 7.2 Описание приложения

**Promotional Text** (170 символов):
```
Real-time cryptocurrency calculator supporting 200+ coins.
Convert Bitcoin, Ethereum, and other cryptos instantly.
Dark mode, offline support, haptic feedback.
```

**Description**:
```
Crypto Calculator is a fast and convenient tool for real-time cryptocurrency conversions.

KEY FEATURES:
• Support for 200+ cryptocurrencies (BTC, ETH, USDT, BNB, and more)
• Real-time exchange rates from CoinGecko API
• Calculator with parentheses support
• Dark and light themes
• Offline mode with cached rates
• Pull-to-refresh rate updates
• Haptic feedback for better UX
• Multi-language support (English, Russian)
• Privacy-focused - no data collection

PERFECT FOR:
✓ Crypto traders
✓ Investors tracking portfolio value
✓ Anyone needing quick crypto conversions

PRIVACY:
We don't collect any personal data. The app uses public CoinGecko API
for exchange rates only. No registration required.

Download now and simplify your crypto calculations!
```

**Keywords** (100 символов макс):
```
crypto,bitcoin,ethereum,calculator,converter,cryptocurrency,btc,eth,trading,wallet
```

**Support URL**: `https://yowchel.github.io/crypto-calculator-privacy/`
**Marketing URL** (optional): оставьте пустым

### 7.3 Загрузка скриншотов

**iPhone 6.9" Display:**
1. Нажмите на поле "6.9" Display"
2. Перетащите 5 скриншотов из `assets/screenshots/iphone/`
3. Расположите в нужном порядке

**iPad Pro 12.9" (6th Gen):**
1. Нажмите на поле iPad Pro
2. Перетащите 3 скриншота из `assets/screenshots/ipad/`

### 7.4 App Icon

Загрузите файл `icon.png` (1024×1024) в разделе **"App Preview and Screenshots"**

---

## ЭТАП 8: Настройка Version & Build

### 8.1 Создание новой версии

1. В App Store Connect выберите **"+ Version"** → `1.0`
2. Выберите только что загруженный build
3. Заполните **"What's New in This Version"**:

```
Initial release of Crypto Calculator!

Features:
• Support for 200+ cryptocurrencies
• Real-time exchange rates
• Advanced calculator with parentheses
• Dark mode support
• Offline functionality
```

### 8.2 Age Rating

Нажмите **"Edit"** в разделе Age Rating:
- Все категории: **None**
- Результат: **4+**

### 8.3 Export Compliance

В разделе **"Export Compliance"**:
- **"Does your app use encryption?"**: No
  (У нас уже настроено `usesNonExemptEncryption: false`)

---

## ЭТАП 9: App Review Information

### 9.1 Contact Information

```
First Name: Yana
Last Name: Shevchuk
Phone: +XXX-XXX-XXXX (ваш номер)
Email: hi@architeq.io
```

### 9.2 Demo Account (не требуется)

Оставьте пустым - наше приложение не требует логина.

### 9.3 Notes for Reviewer (опционально)

```
This is a simple cryptocurrency calculator app that uses
public CoinGecko API for real-time exchange rates.

No user accounts or personal data collection.
All features are immediately accessible without registration.

Test instructions:
1. Open the app
2. Enter any number (e.g., 100)
3. See conversions to selected cryptocurrencies (BTC, ETH, USDT by default)
4. Tap "+" to add more currencies
5. Test calculator operations (+, -, *, /, parentheses)
```

---

## ЭТАП 10: Submit for Review

### 10.1 Финальная проверка

Убедитесь что заполнено:
- [x] App Name
- [x] Description
- [x] Keywords
- [x] Screenshots (iPhone + iPad)
- [x] App Icon
- [x] Build прикреплён
- [x] Pricing & Availability
- [x] Age Rating
- [x] Export Compliance
- [x] Contact Info

### 10.2 Отправка на ревью

1. Нажмите **"Add for Review"** вверху справа
2. Нажмите **"Submit to App Review"**
3. Подтвердите отправку

**Ожидаемое время ревью:** 24-48 часов

---

## ❓ FAQ / Решение Проблем

### Ошибка: "No profiles for team matching"

**Решение:**
```bash
npx eas-cli credentials
# Выберите iOS → Production → Delete all credentials → Try again
npx eas-cli build --platform ios --profile production --clear-credentials
```

### Ошибка: "Bundle ID already exists"

**Решение:**
В `app.json` измените `bundleIdentifier`:
```json
"bundleIdentifier": "com.yshevchuk.cryptocalculator2"
```

### Build застрял в очереди

**Решение:**
- Подождите 5-10 минут
- Или отмените и запустите заново: `npx eas-cli build:cancel`

### App Review Rejection

**Наиболее частые причины:**
1. **Crash при запуске** - протестируйте на физическом устройстве
2. **Missing functionality** - убедитесь что API работает
3. **Privacy policy issues** - проверьте что ссылка на privacy policy доступна

---

## 🎉 После Approval

После одобрения Apple:

1. Приложение появится в App Store через 24-48 часов
2. Вы получите email от Apple
3. Можете поделиться ссылкой: `https://apps.apple.com/app/idXXXXXXXXXX`

---

## 📞 Поддержка

Если возникли вопросы:
- [Expo Documentation](https://docs.expo.dev/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [Expo Discord](https://chat.expo.dev/)

---

**Удачи с релизом! 🚀**
