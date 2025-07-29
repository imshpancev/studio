
'use server';

import { db } from '@/lib/firebase';
import type { UserProfile } from '@/models/user-profile';
import { doc, getDoc, setDoc, collection, getDocs, query, limit, serverTimestamp } from "firebase/firestore";

/**
 * Creates the initial user profile document in Firestore right after signup.
 * This profile is minimal, with onboarding marked as incomplete.
 * @param userId The UID of the new user.
 * @param email The email of the new user.
 * @param name The display name provided during signup.
 */
export async function createInitialUserProfile(userId: string, email: string, name: string): Promise<void> {
    const userDocRef = doc(db, 'users', userId);
    
    // Check if a document already exists, perhaps from a failed previous attempt.
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        console.log(`Profile for user ${userId} already exists. Skipping creation.`);
        return;
    }

    const newUserProfile: UserProfile = {
        uid: userId,
        email: email,
        name: name,
        username: `@user_${userId.substring(0, 8)}`,
        avatar: `https://i.pravatar.cc/150?u=${userId}`,
        onboardingCompleted: false, // <-- This is the key change.
        createdAt: serverTimestamp(),
    };
    await setDoc(userDocRef, newUserProfile);
}


/**
 * Retrieves a user's profile from Firestore.
 * @param userId The UID of the user.
 * @returns The user's profile data or null if not found.
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        return userDocSnap.data() as UserProfile;
    } else {
        return null;
    }
}

/**
 * Creates or updates a user's profile in Firestore.
 * This function is used by the onboarding form to add the detailed info.
 * @param userId The UID of the user to create/update.
 * @param data The profile data to set.
 */
export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, data, { merge: true });
}


/**
 * Fetches all users from the database.
 * @returns An array of user profiles.
 */
export async function getAllUsers(): Promise<UserProfile[]> {
    const usersCollection = collection(db, 'users');
    const usersSnap = await getDocs(usersCollection);
    const users: UserProfile[] = [];
    usersSnap.forEach(doc => {
        users.push({ uid: doc.id, ...doc.data() } as UserProfile);
    });
    return users;
}

/**
 * Fetches leaderboard data.
 * This is a simplified version; a real-world scenario would involve more complex queries or cloud functions.
 * @returns An array of users sorted for the leaderboard.
 */
export async function getLeaderboardData(): Promise<UserProfile[]> {
    const usersRef = collection(db, "users");
    // Example: ordering by total distance. You can change 'totalDistance' to other fields.
    const q = query(usersRef, limit(10));
    
    const querySnapshot = await getDocs(q);
    const leaderboard: UserProfile[] = [];
    querySnapshot.forEach((doc) => {
        leaderboard.push({ uid: doc.id, ...doc.data() } as UserProfile);
    });
    
    // Mocking some values for demonstration as they are not tracked yet
    const processedLeaderboard = leaderboard.map(user => ({
        ...user,
        totalDistance: Math.floor(Math.random() * 50),
        totalSteps: user.dailySteps || Math.floor(Math.random() * 100000),
        totalCalories: Math.floor(Math.random() * 4000),
    })).sort((a,b) => (b.totalDistance || 0) - (a.totalDistance || 0));

    return processedLeaderboard;
}
