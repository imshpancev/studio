// THIS FILE IS FOR SERVER-SIDE FIREBASE ADMIN SDK
// DO NOT USE IN CLIENT-SIDE CODE

import * as admin from 'firebase-admin';

// Ensure the app is not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    // projectId and other details are automatically picked up from the environment
    // when running in a Firebase/Google Cloud environment.
    // For local development, you'd set the GOOGLE_APPLICATION_CREDENTIALS env var.
    projectId: "optimumpulse",
  });
}

const db = admin.firestore();

export { admin, db };
