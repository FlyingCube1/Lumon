import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lumonindustries.app',
  appName: 'Lumon Industries',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystoreAlias: 'lumon',
      keystorePassword: 'lumon123',
      releaseType: 'APK'
    }
  }
};

export default config;