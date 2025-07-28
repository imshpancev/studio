
'use server';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Sport } from '@/lib/workout-data';
import type { Workout } from './workoutService';

export interface Record {
    name: string;
    value: string;
    date: string; // ISO string
    workoutId: string;
}

export interface SportRecords {
    sport: Sport | 'general';
    records: Record[];
}

export interface UserRecords {
    userId: string;
    sports: SportRecords[];
}

// Helper to parse duration string "HH:MM:SS" into seconds
const durationToSeconds = (duration: string): number => {
    const parts = duration.split(':').map(Number);
    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }
    return 0;
};

// Helper to format seconds back to a string
const secondsToDuration = (seconds: number): string => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

// Helper to parse pace string "M'SS\"" to seconds
const paceToSeconds = (pace: string): number => {
  const parts = pace.replace('"', '').split("'").map(Number);
  return parts[0] * 60 + parts[1];
};

// Helper to format seconds to pace string "M'SS\""
const secondsToPace = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60).toString().padStart(2, '0');
    return `${mins}'${secs}"`;
};


/**
 * Calculates all personal records for a given user from their workouts.
 * @param userId The UID of the user.
 * @returns A promise that resolves to the user's records.
 */
export async function getUserRecords(userId: string): Promise<UserRecords> {
    const q = query(collection(db, 'workouts'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const workouts: Workout[] = [];
    querySnapshot.forEach((doc) => {
        workouts.push({ id: doc.id, ...doc.data() } as Workout);
    });

    const records: UserRecords = {
        userId,
        sports: [],
    };

    if (workouts.length === 0) return records;

    // --- General Records ---
    const generalRecords: Record[] = [];
    const longestWorkout = workouts.reduce((prev, current) => {
        return durationToSeconds(prev.duration) > durationToSeconds(current.duration) ? prev : current;
    });
    generalRecords.push({
        name: 'Самая долгая тренировка',
        value: longestWorkout.duration,
        date: longestWorkout.date,
        workoutId: longestWorkout.id!,
    });

    const mostCalories = workouts.reduce((prev, current) => {
        return (prev.calories || 0) > (current.calories || 0) ? prev : current;
    });
    generalRecords.push({
        name: 'Больше всего калорий',
        value: `${mostCalories.calories} ккал`,
        date: mostCalories.date,
        workoutId: mostCalories.id!,
    });
    records.sports.push({ sport: 'general', records: generalRecords });


    // --- Running Records ---
    const runningWorkouts = workouts.filter(w => w.type === Sport.Running);
    const runningRecords: Record[] = [];
    if (runningWorkouts.length > 0) {
        const longestRun = runningWorkouts.reduce((prev, current) => {
             return parseFloat(prev.distance || '0') > parseFloat(current.distance || '0') ? prev : current;
        });
        runningRecords.push({
             name: 'Самая длинная пробежка',
             value: longestRun.distance || '0 км',
             date: longestRun.date,
             workoutId: longestRun.id!,
        });

        // Best pace records (simplified - checks average pace of workout)
        // A real implementation would parse splits/laps data.
        const fastest5k = runningWorkouts
            .filter(w => parseFloat(w.distance || '0') >= 5)
            .sort((a, b) => paceToSeconds(a.avgPace || "99'99\"") - paceToSeconds(b.avgPace || "99'99\""))[0];
        
        if (fastest5k) {
             runningRecords.push({
                name: 'Лучшие 5 км',
                value: fastest5k.avgPace || '-',
                date: fastest5k.date,
                workoutId: fastest5k.id!,
            });
        }
    }
     records.sports.push({ sport: Sport.Running, records: runningRecords });


    // --- Cycling Records ---
    const cyclingWorkouts = workouts.filter(w => w.type === Sport.Cycling);
    const cyclingRecords: Record[] = [];
    if (cyclingWorkouts.length > 0) {
        const longestRide = cyclingWorkouts.reduce((prev, current) => {
             return parseFloat(prev.distance || '0') > parseFloat(current.distance || '0') ? prev : current;
        });
         cyclingRecords.push({
             name: 'Самая длинная поездка',
             value: longestRide.distance || '0 км',
             date: longestRide.date,
             workoutId: longestRide.id!,
        });
    }
    records.sports.push({ sport: Sport.Cycling, records: cyclingRecords });
    
    // Add placeholders for other sports
    records.sports.push({ sport: Sport.Swimming, records: [] });
    records.sports.push({ sport: Sport.Triathlon, records: [] });


    return records;
}
