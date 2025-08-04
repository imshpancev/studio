// This file now contains functions that use the CLIENT-SIDE SDK
// and should be called from client components or hooks.
// It no longer uses 'use server'.

import { db, auth } from '@/lib/firebase';
import { doc, setDoc, getDoc, collection, addDoc, getDocs, query, where, serverTimestamp, documentId } from 'firebase/firestore';

export interface Meal {
    id: string;
    name: string;
    calories: number;
    photo?: string | null;
    type: 'Завтрак' | 'Обед' | 'Ужин' | 'Перекусы';
    date: string; // YYYY-MM-DD
    userId: string;
}

export interface NutritionData {
    calorieGoal: number;
    meals: Meal[];
}

export interface WaterData {
    consumed: number;
    goal: number;
}


/**
 * Retrieves all nutrition data (meals, goals) for a specific user and date.
 * If no data exists, it returns a default structure.
 * @param userId The UID of the user.
 * @param date The date string in 'YYYY-MM-DD' format.
 * @returns The user's nutrition data for that day.
 */
export async function getDailyNutrition(userId: string, date: string): Promise<NutritionData> {
    const nutritionDocRef = doc(db, 'users', userId, 'nutrition', date);
    const nutritionDocSnap = await getDoc(nutritionDocRef);

    let calorieGoal = 2500;
    if (nutritionDocSnap.exists()) {
        calorieGoal = nutritionDocSnap.data()?.calorieGoal || 2500;
    }
    
    const mealsCollectionRef = collection(db, 'users', userId, 'meals');
    const mealsQuery = query(mealsCollectionRef, where('date', '==', date), where('userId', '==', userId));
    
    const mealsSnap = await getDocs(mealsQuery);
    const meals: Meal[] = mealsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meal));

    return {
        calorieGoal,
        meals
    };
}


/**
 * Adds a meal to a user's nutrition log.
 * @param userId The UID of the user.
 * @param mealData The meal data to add.
 * @returns The newly created meal object with its ID.
 */
export async function addMeal(userId: string, mealData: Omit<Meal, 'id'>): Promise<Meal> {
    const mealsColRef = collection(db, 'users', userId, 'meals');
    const docRef = await addDoc(mealsColRef, { ...mealData, userId, createdAt: serverTimestamp() });
    return { id: docRef.id, ...mealData };
}

/**
 * Updates the daily calorie goal for a user.
 * @param userId The UID of the user.
 * @param date The date string in 'YYYY-MM-DD' format.
 * @param goal The new calorie goal.
 */
export async function updateCalorieGoal(userId: string, date: string, goal: number): Promise<void> {
    const nutritionDocRef = doc(db, 'users', userId, 'nutrition', date);
    await setDoc(nutritionDocRef, { calorieGoal: goal }, { merge: true });
}

/**
 * Retrieves water intake data for a specific user and date.
 * @param userId The UID of the user.
 * @param date The date string in 'YYYY-MM-DD' format.
 * @returns The user's water intake data.
 */
export async function getWaterIntake(userId: string, date: string): Promise<WaterData> {
    const waterDocRef = doc(db, 'users', userId, 'water', date);
    const docSnap = await getDoc(waterDocRef);
    if (docSnap.exists()) {
        return docSnap.data() as WaterData;
    }
    // Return default if no data exists for the day
    return { consumed: 0, goal: 2700 };
}

/**
 * Updates water intake data for a specific user and date.
 * @param userId The UID of the user.
 * @param date The date string in 'YYYY-MM-DD' format.
 * @param consumed The new consumed amount in ml.
 * @param goal The daily goal in ml.
 */
export async function updateWaterIntake(userId: string, date: string, consumed: number, goal: number): Promise<void> {
    const waterDocRef = doc(db, 'users', userId, 'water', date);
    await setDoc(waterDocRef, { consumed, goal }, { merge: true });
}
