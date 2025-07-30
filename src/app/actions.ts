
'use server';

import '@/lib/firebase-admin'; // Ensure Firebase Admin is initialized
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { generateWorkoutPlan as generateWorkoutPlanFlow, type GenerateWorkoutPlanInput, type GenerateWorkoutPlanOutput } from "@/ai/flows/generate-workout-plan";
import { processWorkoutSummary as processWorkoutSummaryFlow, type ProcessWorkoutSummaryInput, type ProcessWorkoutSummaryOutput } from "@/ai/flows/process-workout-summary";
import { UserProfile } from '@/models/user-profile';
import type { CreateUserInput } from '@/app/signup/page'; // We'll define this type in the signup page

const adminDb = getFirestore();

/**
 * Server Action to create a user profile document in Firestore.
 * This is called AFTER the user is created in Firebase Auth on the client.
 * @param input - The user's profile details, including the UID from Auth.
 * @returns The newly created user's basic info.
 */
export async function createUserProfileAction(input: CreateUserInput & { uid: string }) {
  try {
    const { uid, name, email, gender, age, weight, height, mainGoal } = input;

    // Create user profile document in Firestore
    const userProfile: UserProfile = {
      uid,
      email,
      name,
      username: `@user_${uid.substring(0, 8)}`,
      avatar: `https://i.pravatar.cc/150?u=${uid}`,
      onboardingCompleted: true, // Registration and onboarding are now one step
      createdAt: FieldValue.serverTimestamp(),
      gender,
      age,
      weight,
      height,
      mainGoal,
      language: 'ru',
      favoriteSports: [],
      bio: '',
    };
    
    await adminDb.collection('users').doc(uid).set(userProfile);

    return {
      uid,
      email,
      name,
    };
  } catch (error: any) {
      console.error('Error creating user profile in Server Action:', error);
      // Throw a more specific error to be handled by the client
      throw new Error('Failed to create user profile in database.');
  }
}


/**
 * Server Action to generate a workout plan.
 * @param input - The input data for the workout plan generation.
 * @returns The generated workout plan.
 */
export async function generatePlanAction(input: GenerateWorkoutPlanInput): Promise<GenerateWorkoutPlanOutput> {
  try {
    const plan = await generateWorkoutPlanFlow(input);
    return plan;
  } catch (error) {
    console.error('Error in generatePlanAction:', error);
    throw new Error('Failed to generate workout plan.');
  }
}


/**
 * Server Action to process a workout summary.
 * @param input - The workout summary and feedback.
 * @returns The analysis of the feedback.
 */
export async function processWorkoutSummaryAction(input: ProcessWorkoutSummaryInput): Promise<ProcessWorkoutSummaryOutput> {
  try {
    const result = await processWorkoutSummaryFlow(input);
    return result;
  } catch (error) {
    console.error('Error in processWorkoutSummaryAction:', error);
    throw new Error('Failed to process workout summary.');
  }
}
