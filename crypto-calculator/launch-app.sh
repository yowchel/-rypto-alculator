#!/bin/bash

echo "🧹 Cleaning up..."
killall -9 node expo Metro 2>/dev/null || true
rm -rf .expo node_modules/.cache

echo ""
echo "📱 Launching iOS app on iPhone 17 Pro Max..."
echo "⏳ This will take 1-2 minutes for the first build"
echo ""

# Запускаем с явным указанием устройства
npx expo run:ios --device "iPhone 17 Pro Max"
