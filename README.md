# Lumon Industries Employee Portal

A Severance-themed web application inspired by the Apple TV+ show. This application features:

## Features

1. **Employee Login System**
   - Secure login with employee name and 5-digit code
   - Department-specific work information after login
   - Clean, minimalist interface inspired by Lumon Industries

2. **Admin Management Portal**
   - Add, edit, and remove employees
   - Assign departments and job roles
   - Secure admin authentication

3. **Multi-platform Access**
   - Web application
   - Android application (via Capacitor)

## Technologies Used

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI components
- **Backend**: Express.js, Node.js
- **Data Management**: In-memory storage with interface for potential database integration
- **Mobile**: Capacitor for Android APK building

## Running the Application

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## Default Admin Login

- **Name**: Admin
- **Code**: 99999

## Building Android APK

See the [APK_BUILD_GUIDE.md](./APK_BUILD_GUIDE.md) file for detailed instructions.