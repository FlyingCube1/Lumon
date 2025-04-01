#!/bin/bash

# Build the web app
npm run build

# Initialize Capacitor in the project
npx cap init "Lumon Industries" "com.lumonindustries.app" 

# Add Android platform
npx cap add android

# Copy web assets to Android platform
npx cap sync

echo "Capacitor initialization complete!"