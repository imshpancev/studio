
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
import { addWorkout } from '@/services/workoutService';
// We don't use client-side auth here
// import { auth } from '@/lib/firebase';

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
  distance: z.string().optional(),
  avgPace: z.string().optional(),
  avgSpeed: z.string().optional(),
  avgHeartRate: z.number().optional(),
  peakHeartRate: z.number().optional(),
  volume: z.string().optional(),
  track: z.array(z.object({ lat: z.number(), lng: z.number() })).optional(),
  splits: z.array(z.any()).optional(),
  elevationGain: z.string().optional(),
  avgCadence: z.string().optional(),
  avgPower: z.string().optional(),
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

    // 1. Save the workout to Firestore
    await addWorkout({
      ...workout,
      userId: userId,
    });

    // 2. Fetch user profile and current plan for context
    // const userProfile = await getUserProfile(user.uid, user.email || '');

    // 3. Prepare input for feedback analysis
    const analysisInput: AnalyzeWorkoutFeedbackInput = {
      workoutName: workout.title,
      workoutDifficulty: feedback.difficulty,
      workoutFeedback: feedback.notes || 'No feedback provided.',
      // In a real app, you might pass sensor data URI here
      // wearableSensorData: ...
      // workoutPlan: JSON.stringify(userProfile.workoutPlan || {}),
      workoutPlan: '{}', // Temporarily providing an empty plan
    };

    // 4. Analyze the feedback
    const analysisOutput = await analyzeWorkoutFeedback(analysisInput);

    // 5. Optionally, adapt the workout plan based on the analysis
    // This could be a separate step or integrated here.
    // For now, we just return the analysis.

    return analysisOutput;
  }
);
