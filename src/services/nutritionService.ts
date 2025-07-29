
'use server';

import { db } from '@/lib/firebase-admin'; // Используем Admin SDK
import { doc, setDoc, getDoc, collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export interface Meal {
    id: string;
    name: string;
    calories: number;
    photo?: string | null;
    type: 'Завтрак' | 'Обед' | 'Ужин' | 'Перекусы';
    date: string; // YYYY-MM-DD
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
    const nutritionDocRef = db.collection('users').doc(userId).collection('nutrition').doc(date);
    const nutritionDocSnap = await nutritionDocRef.get();

    let calorieGoal = 2500;
    if (nutritionDocSnap.exists) {
        calorieGoal = nutritionDocSnap.data()?.calorieGoal || 2500;
    }
    
    const mealsQuery = db.collection('users').doc(userId).collection('meals').where('date', '==', date);
    const mealsSnap = await mealsQuery.get();
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
    const mealsColRef = db.collection('users').doc(userId).collection('meals');
    const docRef = await mealsColRef.add(mealData);
    return { id: docRef.id, ...mealData };
}

/**
 * Updates the daily calorie goal for a user.
 * @param userId The UID of the user.
 * @param date The date string in 'YYYY-MM-DD' format.
 * @param goal The new calorie goal.
 */
export async function updateCalorieGoal(userId: string, date: string, goal: number): Promise<void> {
    const nutritionDocRef = db.collection('users').doc(userId).collection('nutrition').doc(date);
    await nutritionDocRef.set({ calorieGoal: goal }, { merge: true });
}

/**
 * Retrieves water intake data for a specific user and date.
 * @param userId The UID of the user.
 * @param date The date string in 'YYYY-MM-DD' format.
 * @returns The user's water intake data.
 */
export async function getWaterIntake(userId: string, date: string): Promise<WaterData> {
    const waterDocRef = db.collection('users').doc(userId).collection('water').doc(date);
    const docSnap = await waterDocRef.get();
    if (docSnap.exists) {
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
    const waterDocRef = db.collection('users').doc(userId).collection('water').doc(date);
    await waterDocRef.set({ consumed, goal }, { merge: true });
}
