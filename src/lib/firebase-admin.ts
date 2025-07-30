
// THIS FILE IS FOR SERVER-SIDE FIREBASE ADMIN SDK
// DO NOT USE IN CLIENT-SIDE CODE

import * as admin from 'firebase-admin';

// Ensure the app is not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // Application Default Credentials will be used in the App Hosting environment.
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };
