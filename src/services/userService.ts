
'use server';

import { db } from '@/lib/firebase-admin'; // Используем Admin SDK на сервере
import { doc, setDoc, getDoc, getDocs, collection, query, limit } from 'firebase/firestore';


// Define the user profile type, mirroring the Zod schema in profile-page.tsx
export interface UserProfile {
    uid: string;
    email: string;
    onboardingCompleted?: boolean;
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
    
    // Analytics Data
    restingHeartRate?: number;
    hrv?: number;
    dailySteps?: number;
    avgSleepDuration?: number;
    mainGoal?: string;
    bodyFat?: number;
    muscleMass?: number;
    visceralFat?: number;
    bmr?: number;
    water?: number;
    skeletalMuscle?: number;
    sleepData?: { date: string, duration: number, quality: number }[];
    sleepPhases?: { deep: number, light: number, rem: number };
    readinessScore?: number;
    trainingLoadRatio?: number;
    stressLevel?: number;
    bodyBattery?: number;
    recoveryTimeHours?: number;
    
    // Gear
    runningShoes?: any[];
    bikes?: any[];

    // Workout Plan
    workoutPlan?: any | null;
    workoutPlanInput?: any | null;

    // For leaderboard purposes
    totalDistance?: number;
    totalSteps?: number;
    totalCalories?: number;
}


const defaultProfile: Omit<UserProfile, 'uid' | 'email'> = {
    onboardingCompleted: false,
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
    dailySteps: 8241,
    avgSleepDuration: 7.5,
    bodyFat: 27.8,
    muscleMass: 68.4,
    visceralFat: 11,
    bmr: 1919,
    water: 48.6,
    skeletalMuscle: 37.9,
    sleepData: [
      { date: 'Пн', duration: 7.2, quality: 85 },
      { date: 'Вт', duration: 6.8, quality: 78 },
      { date: 'Ср', duration: 8.1, quality: 92 },
      { date: 'Чт', duration: 7.5, quality: 88 },
      { date: 'Пт', duration: 6.5, quality: 75 },
      { date: 'Сб', duration: 8.5, quality: 95 },
      { date: 'Вс', duration: 7.8, quality: 90 },
    ],
    sleepPhases: {
        deep: 20,
        light: 60,
        rem: 20,
    },
    readinessScore: 88,
    trainingLoadRatio: 1.1,
    stressLevel: 25,
    bodyBattery: 78,
    recoveryTimeHours: 28,
    runningShoes: [],
    bikes: [],
    workoutPlan: null,
    workoutPlanInput: null,
    totalDistance: 0,
    totalSteps: 0,
    totalCalories: 0,
};


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
        // Merge with defaults to ensure new fields from the template are present for older users
        return { ...defaultProfile, ...data, uid: userId, email: data?.email || email } as UserProfile;
    } else {
        // If the profile doesn't exist, return a default structure.
        return {
            ...defaultProfile,
            uid: userId,
            email: email,
            username: `@user_${userId.substring(0, 8)}`,
            name: email.split('@')[0],
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
