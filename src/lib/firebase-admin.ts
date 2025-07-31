// THIS FILE IS FOR SERVER-SIDE FIREBASE ADMIN SDK
// DO NOT USE IN CLIENT-SIDE CODE

import * as admin from 'firebase-admin';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Ensure the app is not already initialized
if (!admin.apps.length) {
  try {
    // In a managed environment like App Hosting, initializeApp() without arguments
    // automatically uses Application Default Credentials.
    // The credentials can also be provided via the GOOGLE_APPLICATION_CREDENTIALS
    // environment variable, which we load from the .env file.
    admin.initializeApp();
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

const adminDb = admin.firestore();
const adminAuth = admin.auth();

export { adminDb, adminAuth };
