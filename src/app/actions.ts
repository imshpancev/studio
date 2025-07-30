
'use server';

import { adminAuth, adminDb } from '@/lib/firebase-admin';
import type { UserProfile } from '@/models/user-profile';
import type { OnboardingFormData } from '@/app/onboarding/page';

/**
 * Server Action for user sign-up. Creates user in Auth and a basic profile in Firestore.
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

    const initialProfile: UserProfile = {
      uid: userRecord.uid,
      email: userRecord.email || '',
      onboardingCompleted: false,
      createdAt: adminDb.Timestamp.now(),
      language: 'ru',
    };

    await adminDb.collection('users').doc(userRecord.uid).set(initialProfile);

    return {
      uid: userRecord.uid,
      email: userRecord.email || '',
    };
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
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
 * Server Action to complete the onboarding process. Updates the user's profile with detailed info.
 * @param uid - The user's UID.
 * @param data - The onboarding form data.
 * @returns A success message.
 * @throws Will throw an error if the profile update fails.
 */
export async function completeOnboardingAction(uid: string, data: OnboardingFormData) {
    try {
        const userProfileRef = adminDb.collection('users').doc(uid);

        const profileUpdateData: Partial<UserProfile> = {
            ...data,
            username: `@user_${uid.substring(0, 8)}`,
            avatar: `https://i.pravatar.cc/150?u=${uid}`,
            onboardingCompleted: true,
        };

        await userProfileRef.update(profileUpdateData);

        return { success: true, message: "Профиль успешно обновлен!" };

    } catch (error: any) {
        console.error('Error in completeOnboardingAction:', error);
        throw new Error('Не удалось обновить профиль.');
    }
}
