
/**
 * @fileoverview Defines the TypeScript interface for a user's profile.
 * This provides strong typing for user data throughout the application.
 */

export interface UserProfile {
    uid: string;
    email?: string;
    onboardingCompleted: boolean;
    createdAt: any; // Can be a server timestamp or a Date object
    name?: string;
    username?: string;
    bio?: string;
    avatar?: string;
    favoriteSports?: string[];
    gender?: 'male' | 'female' | 'other';
    age?: number;
    weight?: number;
    height?: number;
    language?: 'ru' | 'en';
    
    // Analytics Data (Optional - can be added later)
    restingHeartRate?: number;
    hrv?: number;
    dailySteps?: number;
    avgSleepDuration?: number;
    mainGoal?: string;
    bodyFat?: number;
    muscleMass?: number;
    visceralFat?: number;
    bmr?: number;
    water?: number;
    skeletalMuscle?: number;
    sleepData?: { date: string, duration: number, quality: number }[];
    sleepPhases?: { deep: number, light: number, rem: number };
    readinessScore?: number;
    trainingLoadRatio?: number;
    stressLevel?: number;
    bodyBattery?: number;
    recoveryTimeHours?: number;
    
    // Gear
    runningShoes?: any[];
    bikes?: any[];

    // Workout Plan
    workoutPlan?: any | null;
    workoutPlanInput?: any | null;

    // For leaderboard purposes
    totalDistance?: number;
    totalSteps?: number;
    totalCalories?: number;
}
