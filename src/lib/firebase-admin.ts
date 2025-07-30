// THIS FILE IS FOR SERVER-SIDE FIREBASE ADMIN SDK
// DO NOT USE IN CLIENT-SIDE CODE

import * as admin from 'firebase-admin';

// Ensure the app is not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      // If you have specific service account credentials, you can pass them here.
      // Otherwise, it will try to use Application Default Credentials.
      credential: admin.credential.applicationDefault(),
      projectId: 'the-lighsport',
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };
