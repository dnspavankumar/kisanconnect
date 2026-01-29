# Firestore Troubleshooting Guide

## Common Issues and Solutions

### 1. Deploy Firestore Rules First

**IMPORTANT:** You must deploy the security rules to Firebase before Firestore will work.

#### Option A: Using Firebase Console (Easiest)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **kisanconnect-402db**
3. Click **Firestore Database** in left menu
4. Click **Rules** tab
5. Copy the contents from `firestore.rules` file
6. Paste into the editor
7. Click **Publish** button

#### Option B: Using Firebase CLI
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

### 2. Check Browser Console for Errors

Open browser DevTools (F12) and check the Console tab for errors like:
- `Missing or insufficient permissions` → Rules not deployed
- `PERMISSION_DENIED` → Rules not deployed or user not authenticated
- `Network error` → Check internet connection
- `Firebase: Error (auth/...)` → Authentication issue

### 3. Verify Environment Variables

Make sure `.env` file has all Firebase credentials:
```env
VITE_FIREBASE_API_KEY=AIzaSyDf7ziRE9E-YGU--gf5FK0MXVtRf8dFkVE
VITE_FIREBASE_AUTH_DOMAIN=kisanconnect-402db.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kisanconnect-402db
VITE_FIREBASE_STORAGE_BUCKET=kisanconnect-402db.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=818230658186
VITE_FIREBASE_APP_ID=1:818230658186:web:bffc01438812378f94d973
VITE_FIREBASE_MEASUREMENT_ID=G-BQPTQNLX2Q
```

**After changing .env, restart the dev server:**
```bash
# Stop the server (Ctrl+C)
# Start again
npm run dev
```

### 4. Enable Firestore Database

Make sure Firestore is enabled in Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **kisanconnect-402db**
3. Click **Firestore Database**
4. If you see "Create database" button, click it
5. Choose **Start in production mode** (we'll add rules manually)
6. Select a location (e.g., asia-south1 for India)
7. Click **Enable**

### 5. Test Firestore Connection

Add this code temporarily to test Firestore:

```javascript
// In src/pages/Dashboard.jsx or any page
import { db } from '@/config/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Add this inside a component
const testFirestore = async () => {
  try {
    const docRef = await addDoc(collection(db, 'test'), {
      message: 'Hello Firestore!',
      timestamp: new Date().toISOString()
    });
    console.log('✅ Firestore working! Document ID:', docRef.id);
  } catch (error) {
    console.error('❌ Firestore error:', error.message);
  }
};

// Call it on button click
<button onClick={testFirestore}>Test Firestore</button>
```

### 6. Check Firestore Rules in Console

Verify rules are deployed:
1. Go to Firebase Console → Firestore Database → Rules
2. You should see rules similar to:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 7. Common Error Messages

#### "Missing or insufficient permissions"
- **Cause:** Firestore rules not deployed or too restrictive
- **Solution:** Deploy rules from `firestore.rules` file

#### "Document doesn't exist"
- **Cause:** Trying to update a document that doesn't exist
- **Solution:** Fixed in `authService.js` - now uses `setDoc` if document doesn't exist

#### "Network request failed"
- **Cause:** Internet connection issue or Firebase service down
- **Solution:** Check internet connection, try again later

#### "Firebase