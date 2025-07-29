
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, getDoc, deleteDoc, orderBy, limit } from 'firebase/firestore';
import { Sport } from '@/lib/workout-data';
import { getUserProfile, UserProfile } from './userService';

type Point = { lat: number; lng: number };

export interface Workout {
    id?: string;
    userId: string;
    title: string;
    type: Sport;
    date: string; // ISO string
    duration: string;
    calories: number;
    distance?: string;
    avgPace?: string;
    avgSpeed?: string;
    avgHeartRate?: number;
    peakHeartRate?: number;
    volume?: string;
    track?: Point[];
    splits?: any[];
    elevationGain?: string;
    avgCadence?: string;
    avgPower?: string;
    createdAt?: any;
}

export interface WorkoutWithUser extends Workout {
    user: UserProfile;
}

/**
 * Adds a new workout document to the 'workouts' collection in Firestore.
 * @param workoutData The workout data to save. The 'userId' field MUST be present.
 */
export async function addWorkout(workoutData: Omit<Workout, 'id' | 'createdAt'>): Promise<string> {
    if (!workoutData.userId) {
        throw new Error("User ID is required to add a workout.");
    }
    try {
        const dataToSave = {
            ...workoutData,
            createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, 'workouts'), dataToSave);
        return docRef.id;
    } catch (error) {
        console.error("Error adding workout document: ", error);
        throw new Error('Could not save workout.');
    }
}

/**
 * Fetches all workouts for a specific user.
 * @param userId The UID of the user whose workouts to fetch.
 * @returns A promise that resolves to an array of workout documents.
 */
export async function getUserWorkouts(userId: string): Promise<Workout[]> {
    const q = query(collection(db, 'workouts'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const workouts: Workout[] = [];
    querySnapshot.forEach((doc) => {
        workouts.push({ id: doc.id, ...doc.data() } as Workout);
    });
    return workouts;
}

/**
 * Fetches a single workout by its document ID.
 * @param workoutId The ID of the workout document to fetch.
 * @returns A promise that resolves to the workout document or null if not found.
 */
export async function getWorkoutById(workoutId: string): Promise<Workout | null> {
    const docRef = doc(db, 'workouts', workoutId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Workout;
    } else {
        return null;
    }
}


/**
 * Deletes a workout document from Firestore.
 * @param workoutId The ID of the workout to delete.
 */
export async function deleteWorkout(workoutId: string): Promise<void> {
    const docRef = doc(db, 'workouts', workoutId);
    await deleteDoc(docRef);
}


/**
 * Fetches the most recent workouts from all users (excluding the current user) for the feed.
 * @param currentUserId The UID of the current user to exclude from the feed.
 * @returns A promise that resolves to an array of workout documents with user info.
 */
export async function getFeedWorkouts(currentUserId: string): Promise<WorkoutWithUser[]> {
    // Note: Firestore does not support '!=' queries directly.
    // A common workaround is to fetch all recent workouts and filter client-side,
    // or use a more complex data structure/Cloud Functions.
    // For simplicity, we'll fetch all and filter. In a large-scale app, this would be inefficient.
    const q = query(collection(db, 'workouts'), orderBy('createdAt', 'desc'), limit(20));
    const querySnapshot = await getDocs(q);
    
    const feedWorkouts: WorkoutWithUser[] = [];
    const userPromises = new Map<string, Promise<UserProfile>>();

    for (const doc of querySnapshot.docs) {
        const workout = { id: doc.id, ...doc.data() } as Workout;
        
        if (workout.userId === currentUserId) continue;

        if (!userPromises.has(workout.userId)) {
            // Fetch user profile only once
            userPromises.set(workout.userId, getUserProfile(workout.userId, ''));
        }
        
        try {
             const userProfile = await userPromises.get(workout.userId);
            if (userProfile) {
                feedWorkouts.push({ ...workout, user: userProfile });
            }
        } catch (error) {
            console.error(`Failed to fetch profile for user ${workout.userId}`, error);
            // Continue without this workout in the feed
        }
    }

    return feedWorkouts;
}
