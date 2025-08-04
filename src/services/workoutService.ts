
// This file contains functions that use the CLIENT-SIDE SDK
// and should be called from client components or hooks.

import { db } from '@/lib/firebase'; // Client SDK
import { collection, getDocs, query, where, doc, getDoc, deleteDoc, orderBy, limit } from 'firebase/firestore'; // Client SDK methods
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
 * [CLIENT SDK] Fetches all workouts for a specific user.
 * This function respects security rules and should be used for client-facing requests.
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
 * [CLIENT SDK] Fetches a single workout by its document ID.
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
 * [CLIENT SDK] Deletes a workout document from Firestore.
 * @param workoutId The ID of the workout to delete.
 */
export async function deleteWorkout(workoutId: string): Promise<void> {
    const docRef = doc(db, 'workouts', workoutId);
    await deleteDoc(docRef);
}


/**
 * [CLIENT SDK] Fetches the most recent workouts from all users (excluding the current user) for the feed.
 * @param currentUserId The UID of the current user to exclude from the feed.
 * @returns A promise that resolves to an array of workout documents with user info.
 */
export async function getFeedWorkouts(currentUserId: string): Promise<WorkoutWithUser[]> {
    const workoutsCollection = collection(db, 'workouts');
    const q = query(workoutsCollection, orderBy('createdAt', 'desc'), limit(20));
    
    const querySnapshot = await getDocs(q);
    
    const feedWorkouts: WorkoutWithUser[] = [];

    // Batch user profile requests
    const userIds = new Set<string>();
    querySnapshot.docs.forEach(doc => {
        const workout = doc.data() as Workout;
        if (workout.userId !== currentUserId) {
            userIds.add(workout.userId);
        }
    });

    const userProfiles = new Map<string, UserProfile | null>();
    const userPromises = Array.from(userIds).map(uid => getUserProfile(uid).then(p => ({uid, p})));
    
    (await Promise.all(userPromises)).forEach(result => {
        userProfiles.set(result.uid, result.p);
    });


    for (const doc of querySnapshot.docs) {
        const workout = { id: doc.id, ...doc.data() } as Workout;
        
        if (workout.userId === currentUserId) continue;

        const userProfile = userProfiles.get(workout.userId);
        if (userProfile) {
            feedWorkouts.push({ ...workout, user: userProfile });
        }
    }

    return feedWorkouts;
}
