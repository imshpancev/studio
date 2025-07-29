
'use server';

import { db } from '@/lib/firebase-admin'; // Используем Admin SDK на сервере
import type { UserProfile } from '@/services/userService';

/**
 * Создает документ профиля пользователя в Firestore.
 * Вызывается с сервера после успешной регистрации в Firebase Auth.
 * @param userId UID нового пользователя.
 * @param data Данные профиля из формы регистрации.
 */
export async function createUserProfileAction(userId: string, data: Omit<UserProfile, 'uid' | 'email' | 'onboardingCompleted'>): Promise<void> {
  if (!userId) {
    throw new Error('User ID is required.');
  }
  
  const userDocRef = db.collection('users').doc(userId);

  const profileData: Partial<UserProfile> = {
    ...data,
    uid: userId, // Явно добавляем UID
    onboardingCompleted: true,
  };

  try {
    await userDocRef.set(profileData, { merge: true });
  } catch (error) {
    console.error('Error creating user profile in Server Action:', error);
    // Выбрасываем ошибку, чтобы клиент мог ее обработать
    throw new Error('Failed to create user profile in database.');
  }
}
