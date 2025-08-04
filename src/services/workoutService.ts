
'use server';

import { db } from '@/lib/firebase';
import { adminDb } from '@/lib/firebase-admin'; // Import adminDb
import * as admin from 'firebase-admin'; // Import the full admin SDK
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
 * Adds a new workout document to the 'workouts' collection in Firestore using the Admin SDK.
 * This is meant to be called from a trusted server-side environment (like a Genkit flow).
 * @param workoutData The workout data to save. The 'userId' field MUST be present.
 */
export async function addWorkout(workoutData: Omit<Workout, 'id' | 'createdAt'>): Promise<string> {
    if (!workoutData.userId) {
        throw new Error("User ID is required to add a workout.");
    }
    try {
        const dataToSave = {
            ...workoutData,
            // Use the serverTimestamp from the 'firebase-admin' package
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        // Use the correct method for the Admin SDK
        const docRef = await adminDb.collection('workouts').add(dataToSave);
        return docRef.id;
    } catch (error) {
        console.error("Error adding workout document: ", error);
        throw new Error('Could not save workout.');
    }
}


/**
 * Fetches all workouts for a specific user using the CLIENT SDK.
 * This respects security rules and should be used for client-facing requests.
 * @param userId The UID of the user whose workouts to fetch.
 * @returns A promise that resolves to an array of workout documents.
 */
export async function getUserWorkouts(userId: string): Promise<Workout[]> {
    const workoutsCollection = collection(db, 'workouts');
    const q = query(workoutsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const workouts: Workout[] = [];
    querySnapshot.forEach((doc) => {
        workouts.push({ id: doc.id, ...doc.data() } as Workout);
    });
    return workouts;
}

/**
 * Fetches a single workout by its document ID using the CLIENT SDK.
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
 * Deletes a workout document from Firestore using the CLIENT SDK.
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
    const workoutsCollection = collection(db, 'workouts');
    const q = query(workoutsCollection, orderBy('createdAt', 'desc'), limit(20));
    const querySnapshot = await getDocs(q);
    
    const feedWorkouts: WorkoutWithUser[] = [];
    const userPromises = new Map<string, Promise<UserProfile | null>>();

    for (const doc of querySnapshot.docs) {
        const workout = { id: doc.id, ...doc.data() } as Workout;
        
        if (workout.userId === currentUserId) continue;

        if (!userPromises.has(workout.userId)) {
            userPromises.set(workout.userId, getUserProfile(workout.userId));
        }
        
        try {
             const userProfile = await userPromises.get(workout.userId);
            if (userProfile) {
                feedWorkouts.push({ ...workout, user: userProfile });
            }
        } catch (error) {
            console.error(`Failed to fetch profile for user ${workout.userId}`, error);
        }
    }

    return feedWorkouts;
}
