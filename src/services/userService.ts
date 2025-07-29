
'use server';

import { db } from '@/lib/firebase-admin'; // Используем Admin SDK на сервере
import type { UserProfile } from '@/models/user-profile';


/**
 * Retrieves a user's profile from Firestore. (This is now a server-side function)
 * @param userId The UID of the user.
 * @param email The email of the user, used for creating a default profile shell.
 * @returns The user's profile data or a default object if not found.
 */
export async function getUserProfile(userId: string, email: string): Promise<UserProfile> {
    const userDocRef = db.collection('users').doc(userId);
    const userDocSnap = await userDocRef.get();

    if (userDocSnap.exists) {
        const data = userDocSnap.data();
        return { ...data, uid: userId, email: data?.email || email } as UserProfile;
    } else {
        // This case should ideally not be hit if the onUserCreate function works correctly.
        // It serves as a fallback.
        return {
            uid: userId,
            email: email,
            name: email.split('@')[0],
            onboardingCompleted: false, // Explicitly false as the profile is missing
        };
    }
}

/**
 * Creates or updates a user's profile in Firestore. (This is now a server-side function)
 * @param userId The UID of the user to create/update.
 * @param data The profile data to set.
 */
export async function updateUserProfile(userId: string, data: Omit<Partial<UserProfile>, 'uid'>): Promise<void> {
    const userDocRef = db.collection('users').doc(userId);
    // Use setDoc with merge:true to create or update.
    await userDocRef.set(data, { merge: true });
}


/**
 * Fetches all users from the database. (This is now a server-side function)
 * @returns An array of user profiles.
 */
export async function getAllUsers(): Promise<UserProfile[]> {
    const usersCollection = db.collection('users');
    const usersSnap = await usersCollection.get();
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
     const usersRef = db.collection("users");
    // Example: ordering by total distance. You can change 'totalDistance' to other fields.
    const q = usersRef.limit(10);
    
    const querySnapshot = await q.get();
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
