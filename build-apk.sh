#!/bin/bash

# Build the web app
npm run build

# Sync the web assets with Capacitor
npx cap sync

# Build Android APK
cd android && ./gradlew assembleDebug

# The APK will be located at:
# android/app/build/outputs/apk/debug/app-debug.apk

echo "APK build complete! Check android/app/build/outputs/apk/debug/app-debug.apk"