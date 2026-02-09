# Environment Variables Setup

This document explains how to set up environment variables for the KisanMitra application.

## Environment Files

The project uses environment variables to store sensitive configuration data like API keys and Firebase credentials.

### Files

- `.env` - Main environment file (DO NOT commit to Git)
- `.env.example` - Template file with placeholder values (safe to commit)

## Setup Instructions

### 1. Create Your .env File

Copy the example file to create your own `.env`:

```bash
cp .env.example .env
```

### 2. Add Your Credentials

Open `.env` and replace the placeholder values with your actual credentials:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_actual_auth_domain
VITE_FIREBASE_PROJECT_ID=your_actual_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_actual_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_actual_measurement_id

# Weather API
VITE_OPENWEATHER_API_KEY=your_openweather_api_key

# App Configuration
VITE_APP_NAME=KisanMitra
VITE_APP_URL=http://localhost:8080
```

## Getting API Keys

### Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `kisanconnect-402db`
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on the web app (</> icon)
6. Copy the configuration values

### OpenWeather API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to API Keys section
4. Copy your API key

## Environment Variables in Vite

Vite exposes environment variables through `import.meta.env`:

```javascript
// Accessing environment variables
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const appName = import.meta.env.VITE_APP_NAME;
```

### Important Rules

1. **Prefix Required**: All environment variables must start with `VITE_` to be exposed to the client
2. **No Secrets**: Never store backend secrets in client-side environment variables
3. **Restart Required**: After changing `.env`, restart the dev server

## Security Best Practices

### ✅ DO

- Keep `.env` in `.gitignore`
- Use `.env.example` for documentation
- Use different values for development and production
- Rotate API keys regularly
- Use Firebase App Check in production

### ❌ DON'T

- Commit `.env` to version control
- Share API keys in public channels
- Use production keys in development
- Hardcode sensitive values in source code

## Production Deployment

### Vercel

Add environment variables in Vercel dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add each variable with its value
4. Redeploy the application

### Netlify

Add environment variables in Netlify dashboard:
1. Go to Site Settings
2. Navigate to Build & Deploy > Environment
3. Add each variable with its value
4. Trigger a new deploy

### Other Platforms

Most hosting platforms provide a way to set environment variables through their dashboard or CLI.

## Troubleshooting

### Variables Not Loading

1. **Check prefix**: Ensure variables start with `VITE_`
2. **Restart server**: Stop and restart `npm run dev`
3. **Check syntax**: No spaces around `=` in `.env` file
4. **Check file location**: `.env` should be in project root

### Firebase Not Connecting

1. **Verify credentials**: Check all Firebase config values
2. **Check console**: Look for errors in browser console
3. **Test connection**: Try initializing Firebase manually
4. **Check domains**: Ensure domain is authorized in Firebase Console

### Weather API Not Working

1. **Verify API key**: Check OpenWeather API key is valid
2. **Check quota**: Free tier has request limits
3. **Check network**: Ensure API endpoint is accessible
4. **Fallback**: App uses mock data if API fails

## Example Usage in Code

### Firebase Config

```javascript
// src/config/firebase.js
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... other config
};
```

### Weather Service

```javascript
// src/services/weatherService.js
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
```

## Development vs Production

### Development (.env)
```env
VITE_APP_URL=http://localhost:8080
VITE_FIREBASE_PROJECT_ID=kisanconnect-402db-dev
```

### Production (.env.production)
```env
VITE_APP_URL=https://kisanmitra.com
VITE_FIREBASE_PROJECT_ID=kisanconnect-402db
```

## Support

If you encounter issues with environment variables:
1. Check this documentation
2. Verify `.env` file exists and has correct values
3. Ensure dev server is restarted after changes
4. Check browser console for specific errors

## Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [OpenWeather API Docs](https://openweathermap.org/api)
