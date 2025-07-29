
/**
 * @fileoverview This file contains the Firebase Cloud Functions for the application.
 * It's used for server-side logic that responds to events within Firebase services.
 */

import { onUserCreate } from 'firebase-functions/v2/auth';
import * as admin from 'firebase-admin';
import type { UserProfile } from '../models/user-profile';

// Initialize the Admin SDK if it's not already initialized.
// This is safe to run in the Cloud Functions environment.
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * A Cloud Function that triggers when a new user is created in Firebase Authentication.
 * It automatically creates a corresponding user profile document in Firestore.
 */
export const createUserProfile = onUserCreate(async (event) => {
  const user = event.data; // The user record created
  const { uid, email, displayName, photoURL } = user;

  const userDocRef = db.collection('users').doc(uid);

  // Create a default profile structure for the new user.
  const newUserProfile: UserProfile = {
    uid: uid,
    email: email || '',
    name: displayName || email?.split('@')[0] || 'Новый пользователь',
    username: `@user_${uid.substring(0, 8)}`,
    avatar: photoURL || `https://i.pravatar.cc/150?u=${uid}`,
    bio: '',
    favoriteSports: [],
    gender: 'other',
    age: 18,
    weight: 70,
    height: 175,
    language: 'ru',
    mainGoal: 'Поддерживать форму',
    onboardingCompleted: true, // Mark onboarding as complete since they've signed up
  };

  try {
    // Set the new document in the 'users' collection with the user's UID.
    await userDocRef.set(newUserProfile);
    console.log(`Successfully created profile for user: ${uid}`);
  } catch (error) {
    console.error(`Error creating profile for user: ${uid}`, error);
  }
});
