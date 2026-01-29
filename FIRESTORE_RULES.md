# Firestore Security Rules

This document explains the Firestore security rules for KisanMitra.

## Overview

The security rules ensure that:
- Users can only access their own data
- User documents cannot be deleted
- Critical fields like `uid` and `createdAt` cannot be modified
- All writes require authentication

## Rules Breakdown

### Users Collection (`/users/{userId}`)

**Read Access:**
- Users can only read their own profile
- Requires authentication
- Rule: `isOwner(userId)`

**Create Access:**
- Users can create their own profile during signup
- Must include required fields: `uid`, `phone`, `updatedAt`
- Rule: `isOwner(userId) && isValidUserData()`

**Update Access:**
- Users can update their own profile
- Cannot change `uid` field
- Cannot change `createdAt` field (if it exists)
- Can update: `name`, `phone`, `language`, `location`, `farmerId`, `onboardingCompleted`, etc.
- Rule: `isOwner(userId)` with field validation

**Delete Access:**
- Deletion is not allowed
- Rule: `false`

### Future Collections

**Chats Collection (`/chats/{chatId}`):**
- Users can read/write only their own chat messages
- Must include `userId` field matching authenticated user

**Disease Detections Collection (`/diseaseDetections/{detectionId}`):**
- Users can read/write only their own detection history
- Must include `userId` field matching authenticated user

## User Data Structure

```javascript
{
  uid: string,              // Firebase Auth UID (required, immutable)
  phone: string,            // Phone number with country code (required)
  name: string,             // Farmer's full name
  language: string,         // Preferred language (en, hi, te)
  location: string,         // Farm location
  onboardingCompleted: boolean,  // Onboarding status
  createdAt: string,        // ISO timestamp (immutable)
  updatedAt: string         // ISO timestamp (required)
}
```

## Deploying Rules

### Using Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `kisanconnect-402db`
3. Navigate to **Firestore Database** → **Rules**
4. Copy the contents of `firestore.rules`
5. Click **Publish**

### Using Firebase CLI:
```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

## Testing Rules

You can test the rules in the Firebase Console:
1. Go to **Firestore Database** → **Rules**
2. Click on **Rules Playground**
3. Test different scenarios:
   - Authenticated user reading own data
   - Authenticated user reading another user's data (should fail)
   - Unauthenticated user reading data (should fail)
   - User updating own profile
   - User trying to change `uid` (should fail)

## Security Best Practices

1. **Never expose sensitive data** in Firestore documents
2. **Always validate data** on both client and server
3. **Use Firebase Authentication** for all operations
4. **Implement rate limiting** in Firebase Console
5. **Monitor usage** in Firebase Console → Usage tab
6. **Enable App Check** for additional security (recommended for production)

## Common Issues

**Issue:** "Missing or insufficient permissions"
- **Cause:** User is not authenticated or trying to access another user's data
- **Solution:** Ensure user is logged in and accessing their own data

**Issue:** "Document creation failed"
- **Cause:** Missing required fields (`uid`, `phone`, `updatedAt`)
- **Solution:** Include all required fields in the document

**Issue:** "Cannot update uid field"
- **Cause:** Trying to modify immutable `uid` field
- **Solution:** Remove `uid` from update payload

## Additional Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Security Rules Testing](https://firebase.google.com/docs/rules/unit-tests)
- [Best Practices](https://firebase.google.com/docs/firestore/security/rules-conditions)
