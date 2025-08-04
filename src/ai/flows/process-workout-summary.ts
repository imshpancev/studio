
'use server';

/**
 * @fileOverview A flow that processes a completed workout summary.
 * It saves the workout to the database and then analyzes user feedback.
 *
 * - processWorkoutSummary - The main function to process the summary.
 * - ProcessWorkoutSummaryInput - The input type for the function.
 * - ProcessWorkoutSummaryOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {
  analyzeWorkoutFeedback,
  type AnalyzeWorkoutFeedbackInput,
  type AnalyzeWorkoutFeedbackOutput,
} from './analyze-workout-feedback';
import { addWorkout } from '@/services/workoutService.server';


// This schema must be defined here because it's used in this flow's outputSchema,
// and it cannot be imported from 'analyze-workout-feedback.ts' because that file
// is a "use server" module and cannot export objects.
const AnalyzeWorkoutFeedbackOutputSchema = z.object({
  adaptedWorkoutPlan: z
    .string()
    .describe(
      'The adapted workout plan in JSON format, adjusted based on the user feedback and sensor data.'
    ),
  recommendations: z.string().describe('Specific recommendations for future workouts.'),
});

// Define Zod schema for the workout part of the input, based on the Workout type
// Omitting fields that are generated on the server (id, userId, createdAt)
const WorkoutInputSchema = z.object({
  title: z.string(),
  type: z.string(),
  date: z.string(),
  duration: z.string(),
  calories: z.number(),
  distance: z.string().nullable(),
  avgPace: z.string().nullable(),
  avgSpeed: z.string().nullable(),
  avgHeartRate: z.number().nullable(),
  peakHeartRate: z.number().nullable(),
  volume: z.string().nullable(),
  track: z.array(z.object({ lat: z.number(), lng: z.number() })).nullable(),
  splits: z.array(z.any()).nullable(),
  elevationGain: z.string().nullable(),
  avgCadence: z.string().nullable(),
  avgPower: z.string().nullable(),
});


const ProcessWorkoutSummaryInputSchema = z.object({
  userId: z.string(),
  workout: WorkoutInputSchema,
  feedback: z.object({
    difficulty: z.number().min(1).max(10),
    notes: z.string().optional(),
  }),
});

export type ProcessWorkoutSummaryInput = z.infer<typeof ProcessWorkoutSummaryInputSchema>;
export type ProcessWorkoutSummaryOutput = AnalyzeWorkoutFeedbackOutput;

export async function processWorkoutSummary(
  input: ProcessWorkoutSummaryInput
): Promise<ProcessWorkoutSummaryOutput> {
  return processWorkoutSummaryFlow(input);
}

const processWorkoutSummaryFlow = ai.defineFlow(
  {
    name: 'processWorkoutSummaryFlow',
    inputSchema: ProcessWorkoutSummaryInputSchema,
    outputSchema: AnalyzeWorkoutFeedbackOutputSchema,
  },
  async ({ userId, workout, feedback }) => {
    // We get the user ID from the input, not from client-side auth
    if (!userId) {
      throw new Error('User ID is required.');
    }
    
    // 1. Create a sanitized workout object to save, excluding any `undefined` fields.
    const workoutToSave: { [key: string]: any } = {};
    Object.keys(workout).forEach(key => {
        const value = (workout as any)[key];
        if (value !== undefined) {
            workoutToSave[key] = value;
        }
    });

    // 2. Save the workout to Firestore using the Admin SDK
    await addWorkout({
      ...workoutToSave,
      userId: userId, 
    });

    // 3. Fetch user profile and current plan for context
    // In a real app, you would fetch user profile here using Admin SDK if needed for analysis
    // const userProfile = await getUserProfile(userId); 

    // 4. Prepare input for feedback analysis
    const analysisInput: AnalyzeWorkoutFeedbackInput = {
      workoutName: workout.title,
      workoutDifficulty: feedback.difficulty,
      workoutFeedback: feedback.notes || 'No feedback provided.',
      // In a real app, you might pass sensor data URI here
      // wearableSensorData: ...
      // And the user's current plan
      // workoutPlan: JSON.stringify(userProfile.workoutPlan || {}),
      workoutPlan: '{}', // Temporarily providing an empty plan for now
    };

    // 5. Analyze the feedback (Temporarily disabled for debugging)
    // const analysisOutput = await analyzeWorkoutFeedback(analysisInput);
    const analysisOutput: AnalyzeWorkoutFeedbackOutput = {
      adaptedWorkoutPlan: '{}',
      recommendations: 'Анализ временно отключен для отладки. Тренировка сохранена.',
    };

    // 6. Optionally, you could update the user's plan in Firestore here
    // based on the analysis output. For now, we just return the analysis.

    return analysisOutput;
  }
);
