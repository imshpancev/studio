// THIS FILE IS FOR SERVER-SIDE FIREBASE ADMIN SDK
// DO NOT USE IN CLIENT-SIDE CODE

import * as admin from 'firebase-admin';

// Ensure the app is not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    // If you have specific service account credentials, you can pass them here.
    // Otherwise, it will try to use Application Default Credentials.
    // credential: admin.credential.applicationDefault(),
    // databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
  });
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };
