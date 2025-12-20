# App Store Metadata

This document contains all metadata needed for App Store Connect submission.

## Basic Information

**App Name:** Crypto Calculator

**Subtitle:** Quick Cryptocurrency Converter

**Bundle ID:** com.yshevchuk.cryptocalculator

**Version:** 1.0.0

**Privacy Policy URL:** https://yowchel.github.io/crypto-calculator-privacy/

**Support URL:** https://yowchel.github.io/crypto-calculator-privacy/

**Marketing URL:** (Optional - can be added later)

**Contact Email:** hi@architeq.io

## App Description

### Short Description (30 characters max)
```
Crypto Calculator & Converter
```

### Full Description (4000 characters max)
```
Crypto Calculator is a fast and convenient tool for real-time cryptocurrency conversions. Track prices and calculate amounts for over 200 cryptocurrencies with live market data.

KEY FEATURES:

• Real-Time Rates
Get live cryptocurrency prices updated every 90 seconds from CoinGecko API

• 200+ Cryptocurrencies
Support for Bitcoin, Ethereum, USDT, and 200+ other popular cryptocurrencies

• Quick Calculations
Built-in calculator for instant conversions between any crypto pairs

• Multiple Currencies
Track and compare multiple cryptocurrencies simultaneously

• Price Change Indicators
24-hour price change percentages with color-coded indicators

• Dark Mode
Automatic theme switching based on your system preferences

• Multiple Languages
Full support for English and Russian interfaces

• Offline Support
Continue using the calculator even without internet connection

• Privacy First
No personal data collection, all preferences stored locally on your device

PERFECT FOR:

• Crypto traders who need quick conversions
• Investors tracking multiple portfolios
• Anyone learning about cryptocurrencies
• Quick price checks and calculations

SIMPLE TO USE:

1. Select your cryptocurrencies from the list
2. Enter amounts using the built-in calculator
3. See instant conversions in real-time
4. Pull to refresh for latest prices

No registration required. No ads. No tracking.
Just a simple, fast, and privacy-focused cryptocurrency calculator.

Data provided by CoinGecko API.
```

### What's New (4000 characters max)
```
Initial release of Crypto Calculator!

Features:
• Support for 200+ cryptocurrencies
• Real-time price updates
• Built-in calculator
• Dark mode support
• English and Russian languages
• Privacy-focused design
```

## Keywords (100 characters max, comma-separated)
```
crypto,bitcoin,ethereum,calculator,converter,cryptocurrency,btc,eth,usdt,finance,trading,rates
```

## Categories

**Primary Category:** Finance

**Secondary Category:** Utilities

## Age Rating

**Rating:** 4+ (No objectionable content)

**Content Descriptions:**
- None (app contains no objectionable content)

## App Review Information

**Notes for Reviewer:**
```
This is a simple cryptocurrency calculator app that uses the free CoinGecko API to fetch current cryptocurrency prices.

Test Account: Not required (no login functionality)

The app works best with internet connection for live price updates, but can function offline using cached data.

Key features to test:
1. Pull-to-refresh to update cryptocurrency prices
2. Calculator functionality with crypto conversions
3. Theme switching (Settings → Theme)
4. Language switching (Settings → Language)
5. Adding/removing cryptocurrencies from the list

Privacy Policy: https://yowchel.github.io/crypto-calculator-privacy/
```

**Demo Account:** N/A (no login required)

**Contact Information:**
- First Name: Yana
- Last Name: Shevchuk
- Phone Number: [Your phone number]
- Email: hi@architeq.io

## Export Compliance

**Uses Encryption:** No

**ITSAppUsesNonExemptEncryption:** false

Note: App uses HTTPS for API calls, which is exempt from export compliance requirements.

## Screenshots Required

### iPhone 6.7" Display (iPhone 15 Pro Max)
Required: 3-10 screenshots, 1290 x 2796 pixels

### iPhone 6.5" Display (iPhone 14 Plus, iPhone 13 Pro Max)
Optional but recommended

### iPhone 5.5" Display (iPhone 8 Plus)
Optional

### iPad Pro 12.9" Display (6th Gen)
Required if supporting iPad: 2048 x 2732 pixels

## App Icon

**Size:** 1024 x 1024 pixels
**Format:** PNG or JPG
**No transparency:** Required
**No rounded corners:** System will apply

## Build Information

**Build Number:** 1
**Version String:** 1.0.0
**SDK:** Latest stable Expo SDK
**Minimum OS:** iOS 13.4+

## Localization

### Supported Languages:
- English (Primary)
- Russian

### Localized Metadata Required:
- App Name
- Description
- Keywords
- Screenshots (optional but recommended)

## Additional Notes

### For App Store Connect Setup:

1. Create app in App Store Connect
2. Copy the App Store Connect App ID (ascAppId)
3. Update eas.json with the real ascAppId
4. Copy your Apple Team ID
5. Update eas.json with your real appleTeamId

### Build Command:
```bash
eas build --platform ios --profile production
```

### Submit Command:
```bash
eas submit --platform ios --profile production
```

### Pre-submission Checklist:
- [ ] App icon created (1024x1024)
- [ ] Screenshots captured for all required sizes
- [ ] Privacy Policy URL confirmed working
- [ ] Test on physical device
- [ ] All localized content prepared
- [ ] Apple Developer account enrolled
- [ ] App created in App Store Connect
- [ ] Tax and banking information completed
