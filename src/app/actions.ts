
'use server';

import { adminAuth } from '@/lib/firebase-admin';
import type { UserProfile } from '@/models/user-profile';
import type { OnboardingFormData } from '@/app/onboarding/page';
import { db } from '@/lib/firebase'; // Client SDK for client-context operations
import { doc, setDoc } from "firebase/firestore";


/**
 * Server Action for user sign-up. Creates user ONLY in Firebase Authentication.
 * Firestore document creation is now handled in `completeOnboardingAction`.
 * @param email - User's email.
 * @param password - User's password.
 * @returns The newly created user's UID and email.
 * @throws Will throw an error if the user already exists or another error occurs.
 */
export async function signUpAction(email: string, password: string): Promise<{ uid: string; email: string }> {
  try {
    const userRecord = await adminAuth.createUser({
      email,
      password,
    });

    // Firestore document is NOT created here anymore.
    // It will be created during onboarding.

    return {
      uid: userRecord.uid,
      email: userRecord.email || '',
    };
  } catch (error: any) {
    if (error.code === 'auth/email-already-exists') {
      throw new Error('Этот email уже используется. Попробуйте войти.');
    }
    if (error.code === 'auth/invalid-password') {
        throw new Error('Пароль слишком слабый. Он должен содержать не менее 6 символов.');
    }
    console.error('Error in signUpAction:', error);
    throw new Error('Произошла ошибка во время регистрации.');
  }
}


/**
 * Server Action to complete the onboarding process. 
 * Creates the user's profile document in Firestore with detailed info.
 * @param uid - The user's UID.
 * @param data - The onboarding form data.
 * @returns A success message.
 * @throws Will throw an error if the profile creation fails.
 */
export async function completeOnboardingAction(uid: string, email: string, data: OnboardingFormData) {
    try {
        const userProfileRef = doc(db, 'users', uid);

        const newProfile: UserProfile = {
            uid: uid,
            email: email,
            ...data,
            onboardingCompleted: true,
            createdAt: new Date().toISOString(), // Use client-side timestamp for simplicity here
            language: 'ru',
            username: `@user_${uid.substring(0, 8)}`,
            avatar: `https://i.pravatar.cc/150?u=${uid}`,
        };

        // Use setDoc from the client SDK because this action is initiated
        // by an authenticated client, and our rules expect that.
        await setDoc(userProfileRef, newProfile);

        return { success: true, message: "Профиль успешно создан!" };

    } catch (error: any) {
        console.error('Error in completeOnboardingAction:', error);
        throw new Error('Не удалось создать профиль.');
    }
}

/**
 * Server action to process a completed workout, save it, and analyze feedback.
 * @param input - The workout summary and feedback.
 * @returns The analysis output from the AI.
 */
export async function processWorkoutSummaryAction(input: import('@/ai/flows/process-workout-summary').ProcessWorkoutSummaryInput): Promise<import('@/ai/flows/process-workout-summary').ProcessWorkoutSummaryOutput> {
  const { processWorkoutSummary } = await import('@/ai/flows/process-workout-summary');
  return processWorkoutSummary(input);
}

/**
 * Server action to generate a workout plan.
 * @param input - The user's preferences and goals for the plan.
 * @returns The generated workout plan.
 */
export async function generatePlanAction(input: import('@/ai/flows/generate-workout-plan').GenerateWorkoutPlanInput): Promise<import('@/ai/flows/generate-workout-plan').GenerateWorkoutPlanOutput> {
    const { generateWorkoutPlan } = await import('@/ai/flows/generate-workout-plan');
    return generateWorkoutPlan(input);
}


