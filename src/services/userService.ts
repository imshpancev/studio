'use server';

import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, getDocs, collection, query, limit } from 'firebase/firestore';

// Define the user profile type, mirroring the Zod schema in profile-page.tsx
export interface UserProfile {
    uid: string;
    email: string;
    name?: string;
    username?: string;
    bio?: string;
    avatar?: string;
    favoriteSports?: string[];
    gender?: 'male' | 'female' | 'other';
    age?: number;
    weight?: number;
    height?: number;
    language?: 'ru' | 'en';
    restingHeartRate?: number;
    hrv?: number;
    dailySteps?: number;
    avgSleepDuration?: number;
    mainGoal?: string;
    runningShoes?: any[];
    bikes?: any[];
    // For leaderboard purposes
    totalDistance?: number;
    totalSteps?: number;
    totalCalories?: number;
}


const defaultProfile: Omit<UserProfile, 'uid' | 'email'> = {
    name: 'Новый пользователь',
    username: '',
    bio: '',
    avatar: `https://i.pravatar.cc/150?u=${Math.random().toString(36).substring(7)}`,
    favoriteSports: [],
    gender: 'other',
    age: 30,
    weight: 70,
    height: 175,
    language: 'ru',
    mainGoal: 'Поддерживать форму',
    restingHeartRate: 65,
    hrv: 40,
    dailySteps: 5000,
    avgSleepDuration: 7,
    runningShoes: [],
    bikes: [],
    totalDistance: 0,
    totalSteps: 0,
    totalCalories: 0,
};


/**
 * Retrieves a user's profile from Firestore, creating it if it doesn't exist.
 * @param userId The UID of the user.
 * @param email The email of the user, used for creating a default profile.
 * @returns The user's profile data.
 */
export async function getUserProfile(userId: string, email: string): Promise<UserProfile> {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        return userDocSnap.data() as UserProfile;
    } else {
        // Document does not exist, create a default profile
        const newProfile: UserProfile = {
            ...defaultProfile,
            uid: userId,
            email: email,
            username: `@user_${userId.substring(0, 8)}`
        };
        await setDoc(userDocRef, newProfile);
        return newProfile;
    }
}

/**
 * Updates a user's profile in Firestore.
 * @param userId The UID of the user.
 * @param data The partial profile data to update.
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
        users.push(doc.data() as UserProfile);
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
        leaderboard.push({ id: doc.id, ...doc.data() } as UserProfile);
    });
    
    // Mocking some values for demonstration as they are not tracked yet
    const processedLeaderboard = leaderboard.map(user => ({
        ...user,
        totalDistance: Math.floor(Math.random() * 50),
        totalSteps: Math.floor(Math.random() * 100000),
        totalCalories: Math.floor(Math.random() * 4000),
    })).sort((a,b) => (b.totalDistance || 0) - (a.totalDistance || 0));

    return processedLeaderboard;
}
