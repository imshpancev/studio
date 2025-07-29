/**
 * @fileoverview A Genkit flow for handling user registration.
 * This flow creates a user in Firebase Auth and then creates their profile in Firestore.
 */
import '@/lib/firebase-admin'; // Ensure Firebase Admin is initialized
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { UserProfile } from '@/models/user-profile';
import { serverTimestamp } from 'firebase/firestore';

// Initialize Firebase Admin services
const adminAuth = getAuth();
const adminDb = getFirestore();


export const RegisterUserInputSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  gender: z.enum(['male', 'female', 'other']),
  age: z.number().min(1),
  weight: z.number().min(1),
  height: z.number().min(1),
  mainGoal: z.string(),
});

export type RegisterUserInput = z.infer<typeof RegisterUserInputSchema>;

export const RegisterUserOutputSchema = z.object({
  uid: z.string(),
  email: z.string(),
  name: z.string(),
});

export type RegisterUserOutput = z.infer<typeof RegisterUserOutputSchema>;


export const registerUserFlow = ai.defineFlow(
  {
    name: 'registerUserFlow',
    inputSchema: RegisterUserInputSchema,
    outputSchema: RegisterUserOutputSchema,
  },
  async (input) => {
    try {
      // 1. Create user in Firebase Auth
      const userRecord = await adminAuth.createUser({
        email: input.email,
        password: input.password,
        displayName: input.name,
      });

      const { uid } = userRecord;

      // 2. Create user profile document in Firestore
      const userProfile: UserProfile = {
        uid: uid,
        email: input.email,
        name: input.name,
        username: `@user_${uid.substring(0, 8)}`,
        avatar: `https://i.pravatar.cc/150?u=${uid}`,
        onboardingCompleted: true, // Registration and onboarding are now one step
        createdAt: serverTimestamp(),
        gender: input.gender,
        age: input.age,
        weight: input.weight,
        height: input.height,
        mainGoal: input.mainGoal,
        language: 'ru',
        favoriteSports: [],
        bio: '',
      };
      
      await adminDb.collection('users').doc(uid).set(userProfile);

      return {
        uid: userRecord.uid,
        email: userRecord.email || '',
        name: userRecord.displayName || '',
      };
    } catch (error: any) {
        console.error('Error in registerUserFlow:', error);
        // Re-throw the error to be handled by the caller
        throw new Error(error.message || 'Failed to register user.');
    }
  }
);
