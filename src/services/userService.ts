
'use server';

import { db } from '@/lib/firebase';
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
 * Retrieves a user's profile from Firestore, creating it if it doesn't exist.
 * @param userId The UID of the user.
 * @param email The email of the user, used for creating a default profile.
 * @returns The user's profile data.
 */
export async function getUserProfile(userId: string, email: string): Promise<UserProfile> {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        // Merge with defaults to ensure new fields are present
        const mergedProfile = { ...defaultProfile, ...data, uid: userId, email: email };
        return mergedProfile as UserProfile;
    } else {
        // Document does not exist, create a default profile
        const newProfile: UserProfile = {
            ...defaultProfile,
            uid: userId,
            email: email,
            username: `@user_${userId.substring(0, 8)}`
        };
        // We will create the document via updateUserProfile on onboarding
        return newProfile;
    }
}

/**
 * Creates or updates a user's profile in Firestore.
 * @param userId The UID of the user.
 * @param data The partial profile data to update.
 */
export async function updateUserProfile(userId: string, data: Partial<Omit<UserProfile, 'email'>>): Promise<void> {
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
