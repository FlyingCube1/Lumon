# Lumon Industries App - Severance Theme

A minimalist application inspired by the TV show "Severance" on Apple TV+. The app features a Lumon Industries-themed login interface where you can enter a name and 5-digit code. 

## Features

- Minimalist login screen with Lumon Industries branding
- Successful login with specific credentials (Name: Felix, Code: 00000)
- Post-login page with mysterious "Your job has yet to be assigned" message
- Mobile-optimized design and styling

## Web Application

The web application can be run directly on Replit using the "Start application" workflow.

## Building an Android APK

This repository includes scripts to help you generate an Android APK file that can be installed on Android devices. Here's how to create your APK:

### Prerequisites

To build an Android APK, you will need:

1. A local development environment with:
   - Node.js and npm
   - Java Development Kit (JDK) 11 or higher
   - Android SDK with Android platform tools
   - Gradle
   - Android Studio (recommended for easier build process)

### Steps to Build APK

1. Clone this repository to your local machine
2. Install dependencies using `npm install`
3. Run the initialization script: `./cap-init.sh`
   - This will build the web app, initialize Capacitor, add the Android platform, and sync the web assets

4. Run the build script: `./build-apk.sh`
   - This will build the web app, sync Capacitor, and generate an APK file

5. Find your APK at `android/app/build/outputs/apk/debug/app-debug.apk`

### Manual Build Process

If the scripts don't work for your environment, you can follow these manual steps:

1. Build the web application:
   ```
   npm run build
   ```

2. Initialize Capacitor (if not already done):
   ```
   npx cap init "Lumon Industries" "com.lumonindustries.app"
   npx cap add android
   ```

3. Sync web assets with Android:
   ```
   npx cap sync
   ```

4. Build the APK:
   ```
   cd android
   ./gradlew assembleDebug
   ```

5. The APK will be available at `android/app/build/outputs/apk/debug/app-debug.apk`

## Login Credentials

To access the application:
- Name: Felix
- Code: 00000

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Capacitor for mobile packaging