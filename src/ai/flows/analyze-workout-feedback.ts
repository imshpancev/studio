'use server';

/**
 * @fileOverview A workout feedback analysis AI agent.
 *
 * - analyzeWorkoutFeedback - A function that handles the workout feedback analysis process.
 * - AnalyzeWorkoutFeedbackInput - The input type for the analyzeWorkoutFeedback function.
 * - AnalyzeWorkoutFeedbackOutput - The return type for the analyzeWorkoutFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeWorkoutFeedbackInputSchema = z.object({
  workoutName: z.string().describe('The name of the workout.'),
  workoutDifficulty: z
    .number()
    .min(1)
    .max(10)
    .describe('The perceived difficulty of the workout, on a scale of 1 to 10.'),
  workoutFeedback: z.string().describe('The user provided text feedback on the workout.'),
  wearableSensorData: z
    .string()
    .optional()
    .describe(
      'Wearable sensor data from the workout, such as heart rate, pace, and cadence. Should be passed as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  workoutPlan: z.string().describe('The current workout plan in JSON format.'),
});

export type AnalyzeWorkoutFeedbackInput = z.infer<typeof AnalyzeWorkoutFeedbackInputSchema>;

const AnalyzeWorkoutFeedbackOutputSchema = z.object({
  adaptedWorkoutPlan: z
    .string()
    .describe(
      'The adapted workout plan in JSON format, adjusted based on the user feedback and sensor data.'
    ),
  recommendations: z.string().describe('Specific recommendations for future workouts.'),
});

export type AnalyzeWorkoutFeedbackOutput = z.infer<typeof AnalyzeWorkoutFeedbackOutputSchema>;

export async function analyzeWorkoutFeedback(
  input: AnalyzeWorkoutFeedbackInput
): Promise<AnalyzeWorkoutFeedbackOutput> {
  return analyzeWorkoutFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeWorkoutFeedbackPrompt',
  input: {schema: AnalyzeWorkoutFeedbackInputSchema},
  output: {schema: AnalyzeWorkoutFeedbackOutputSchema},
  prompt: `You are an AI workout plan optimizer. You will analyze user feedback, wearable sensor data, and the current workout plan to adapt the workout plan for the user.\n
  Consider the following information:\n
  Workout Name: {{{workoutName}}}\n  Workout Difficulty: {{{workoutDifficulty}}}\n  Workout Feedback: {{{workoutFeedback}}}\n  Wearable Sensor Data: {{#if wearableSensorData}}{{media url=wearableSensorData}}{{else}}No wearable sensor data provided.{{/if}}\n  Current Workout Plan: {{{workoutPlan}}}\n
  Based on this information, generate an adapted workout plan and provide specific recommendations for future workouts. The adapted workout plan should be in JSON format.\n
  Output the adapted workout plan and recommendations:\n  Adapted Workout Plan: {{adaptedWorkoutPlan}}\n  Recommendations: {{recommendations}}`,
});

const analyzeWorkoutFeedbackFlow = ai.defineFlow(
  {
    name: 'analyzeWorkoutFeedbackFlow',
    inputSchema: AnalyzeWorkoutFeedbackInputSchema,
    outputSchema: AnalyzeWorkoutFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
