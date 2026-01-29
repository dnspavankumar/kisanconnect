# Firebase Authentication Setup

This document explains how Firebase Authentication is configured in KisanMitra.

## Firebase Configuration

The Firebase project is configured in `src/config/firebase.js` with the following services:
- **Firebase Authentication**: Phone number authentication with OTP
- **Cloud Firestore**: User profile storage
- **Analytics**: Usage tracking (optional)

## Authentication Flow

### 1. Phone Number Authentication

The app uses Firebase Phone Authentication with the following flow:

1. **User enters phone number** (10 digits)
2. **reCAPTCHA verification** (invisible, handled automatically)
3. **OTP sent via SMS** (6-digit code)
4. **User enters OTP**
5. **Firebase verifies OTP**
6. **User authenticated** and profile created/loaded

### 2. User Profile Management

User profiles are stored in Firestore under the `users` collection:

```javascript
{
  uid: "firebase_user_id",
  phone: "+91XXXXXXXXXX",
  farmerId: "optional_farmer_id",
  name: "Farmer Name",
  location: "City, State",
  farmSize: "5 acres",
  crops: "Cotton, Rice",
  createdAt: "ISO timestamp",
  updatedAt: "ISO timestamp"
}
```

## Files Structure

### Configuration
- `src/config/firebase.js` - Firebase initialization and exports

### Services
- `src/services/authService.js` - Authentication functions:
  - `sendOTP(phoneNumber)` - Send OTP to phone
  - `verifyOTP(otp)` - Verify OTP code
  - `getUserProfile(uid)` - Get user profile from Firestore
  - `updateUserProfile(uid, updates)` - Update user profile
  - `signOutUser()` - Sign out user
  - `onAuthStateChange(callback)` - Listen to auth state

### Context
- `src/contexts/AuthContext.jsx` - Auth state management:
  - `user` - Firebase user object
  - `userProfile` - User profile from Firestore
  - `isAuthenticated` - Boolean auth status
  - `isLoading` - Loading state
  - `logout()` - Sign out function
  - `updateProfile(updates)` - Update profile function

### Pages
- `src/pages/AuthPage.jsx` - Login page with phone OTP
- `src/pages/ProfilePage.jsx` - User profile management

## Firebase Console Setup

### Required Firebase Services

1. **Authentication**
   - Enable Phone authentication provider
   - Configure authorized domains for your app

2. **Firestore Database**
   - Create database in production mode
   - Set up security rules (see below)

3. **App Check** (Recommended)
   - Enable reCAPTCHA v3 for web apps
   - Protects against abuse

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Users can read and write their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Environment Variables

The Firebase configuration is currently hardcoded in `src/config/firebase.js`. For production, consider using environment variables:

```javascript
// .env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
// ... other config values
```

## Testing Authentication

### Test Phone Numbers (Development)

Firebase allows you to configure test phone numbers in the console:
1. Go to Authentication > Sign-in method > Phone
2. Add test phone numbers with fixed OTP codes
3. Use these for development without SMS charges

Example:
- Phone: +91 9999999999
- OTP: 123456

## Troubleshooting

### Common Issues

1. **reCAPTCHA not working**
   - Ensure domain is authorized in Firebase Console
   - Check browser console for errors
   - Clear reCAPTCHA verifier on error

2. **OTP not received**
   - Check Firebase quota limits
   - Verify phone number format (+91XXXXXXXXXX)
   - Check SMS provider status in Firebase Console

3. **Firestore permission denied**
   - Verify security rules are set correctly
   - Ensure user is authenticated before accessing Firestore
   - Check user UID matches document ID

## Production Checklist

- [ ] Enable App Check for production
- [ ] Set up proper Firestore security rules
- [ ] Configure authorized domains
- [ ] Set up billing alerts
- [ ] Enable Firebase Analytics
- [ ] Move Firebase config to environment variables
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Test authentication flow thoroughly
- [ ] Set up backup for Firestore data

## Additional Resources

- [Firebase Phone Auth Documentation](https://firebase.google.com/docs/auth/web/phone-auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
