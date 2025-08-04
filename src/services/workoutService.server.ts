
'use server';

// This file contains functions that use the ADMIN SDK and should only be
// imported and used in server-side code (e.g. Genkit flows, Server Actions).

import { adminDb } from '@/lib/firebase-admin'; // Admin SDK
import * as admin from 'firebase-admin'; // Full admin SDK for FieldValue
import type { Workout } from './workoutService';

/**
 * [ADMIN SDK] Adds a new workout document to Firestore.
 * This function is for server-side use ONLY (e.g., Genkit flows) as it uses the Admin SDK.
 * @param workoutData The workout data to save. The 'userId' field MUST be present.
 */
export async function addWorkout(workoutData: Omit<Workout, 'id' | 'createdAt'>): Promise<string> {
    if (!workoutData.userId) {
        throw new Error("User ID is required to add a workout.");
    }
    try {
        const dataToSave = {
            ...workoutData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        const docRef = await adminDb.collection('workouts').add(dataToSave);
        return docRef.id;
    } catch (error) {
        console.error("Error adding workout document with Admin SDK: ", error);
        throw new Error('Could not save workout using Admin SDK.');
    }
}
