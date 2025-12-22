#!/bin/bash

# Остановить все процессы
echo "🛑 Stopping all Expo processes..."
killall -9 node expo Metro 2>/dev/null || true

# Очистить кэш
echo "🧹 Clearing cache..."
rm -rf .expo node_modules/.cache

# Ждём немного
sleep 2

# Запустить Expo
echo "🚀 Starting Expo..."
echo ""
echo "📱 When you see 'Metro Bundler is ready', press 'i' to open iOS Simulator"
echo ""

npx expo start --clear
