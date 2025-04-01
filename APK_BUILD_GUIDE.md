# Detailed Guide to Building an Android APK

This guide provides step-by-step instructions for creating an Android APK of the Lumon Industries application.

## Prerequisites

You'll need to have the following installed on your local machine:

1. **Node.js and npm** - [Download](https://nodejs.org/)
2. **JDK 11 or newer** - [Download](https://adoptium.net/)
3. **Android Studio** - [Download](https://developer.android.com/studio)
   - During installation, make sure to install the Android SDK
   - Install at least one Android SDK Platform (Android 12 or newer recommended)
   - Install Android SDK Build-Tools
   - Install Android SDK Command-line Tools
   - Install Android SDK Platform-Tools

## Setup Your Environment

1. Set up environment variables:
   - Set `ANDROID_HOME` to your Android SDK location
     - Windows: Usually `C:\Users\<your-username>\AppData\Local\Android\Sdk`
     - macOS: Usually `~/Library/Android/sdk`
     - Linux: Usually `~/Android/Sdk`
   - Add these directories to your PATH:
     - `$ANDROID_HOME/tools`
     - `$ANDROID_HOME/tools/bin`
     - `$ANDROID_HOME/platform-tools`

## Step-by-Step Build Process

Follow these detailed steps to create your APK:

### 1. Clone and Setup the Project

```bash
# Clone the project from Replit
git clone [YOUR-REPLIT-REPOSITORY-URL]
cd [REPOSITORY-DIRECTORY]

# Install dependencies
npm install
```

### 2. Build the Web Application

```bash
# Build the React application
npm run build
```

This will create a `dist` directory with the compiled web application.

### 3. Initialize Capacitor

```bash
# Initialize Capacitor
npx cap init "Lumon Industries" "com.lumonindustries.app"

# Add Android platform
npx cap add android

# Copy web assets to the Android project
npx cap sync
```

### 4. Configure Android Project (Optional)

To customize your app:

1. Open the project in Android Studio:
   ```bash
   npx cap open android
   ```

2. In Android Studio, you can:
   - Modify app icons (located in `android/app/src/main/res/`)
   - Update app name or other resources
   - Configure Android permissions

### 5. Build the Debug APK

```bash
# Navigate to the Android directory
cd android

# Build a debug APK
./gradlew assembleDebug
```

The debug APK will be located at:
`android/app/build/outputs/apk/debug/app-debug.apk`

### 6. Build a Release APK (Optional)

To build a release version:

1. Create a keystore file (if you don't already have one):
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore lumon-keystore.keystore -alias lumon -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Update `android/app/build.gradle` with your keystore information:
   ```gradle
   android {
     signingConfigs {
       release {
         storeFile file("path/to/lumon-keystore.keystore")
         storePassword "your-keystore-password"
         keyAlias "lumon"
         keyPassword "your-key-password"
       }
     }
     buildTypes {
       release {
         signingConfig signingConfigs.release
         // ...
       }
     }
   }
   ```

3. Build the release APK:
   ```bash
   ./gradlew assembleRelease
   ```

The release APK will be at:
`android/app/build/outputs/apk/release/app-release.apk`

## Installing the APK

1. Transfer the APK to your Android device using:
   - USB connection
   - Email
   - Cloud storage
   - ADB (Android Debug Bridge):
     ```bash
     adb install path/to/app-debug.apk
     ```

2. On your Android device:
   - Allow installation from unknown sources in your device settings
   - Open the APK file to install

## Troubleshooting

If you encounter issues:

1. **Build failures**:
   - Check Android Studio logs
   - Ensure Android SDK is properly installed
   - Verify environment variables are correctly set

2. **App crashes on launch**:
   - Check logcat in Android Studio for error details
   - Ensure Capacitor is properly synced: `npx cap sync`

3. **White screen issues**:
   - Check the browser console in Android Studio's WebView debugger
   - Verify your app's content security policy