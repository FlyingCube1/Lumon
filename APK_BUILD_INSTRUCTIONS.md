# How to Build the Lumon Industries Android APK

Follow these steps to build the Android APK on your local machine:

## Prerequisites

1. Make sure you have installed:
   - Node.js and npm
   - Android Studio
   - JDK 11 or newer
   - Android SDK with build tools

## Step 1: Download the project

Download the project from Replit to your local machine.

## Step 2: Install dependencies

```bash
npm install
```

## Step 3: Build the web application

```bash
npm run build
```

## Step 4: Initialize Capacitor

```bash
npx cap init "Lumon Industries" "com.lumonindustries.app"
```

## Step 5: Add Android platform

```bash
npx cap add android
```

## Step 6: Sync the web assets with Capacitor

```bash
npx cap sync
```

## Step 7: Build the APK

Option 1: Using command line:
```bash
cd android && ./gradlew assembleDebug
```

Option 2: Using Android Studio:
```bash
npx cap open android
```
Then in Android Studio, select Build > Build Bundle(s) / APK(s) > Build APK(s)

## Step 8: Find the APK

The APK will be available at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

You can install this APK on any Android device by transferring it and installing it directly.

## Notes

- You may need to enable "Install from Unknown Sources" in your Android device settings to install the APK.
- The app should work on Android 5.0 (Lollipop) and above.
- The login credentials are: Name = "Felix", Code = "00000"