'use server';

/**
 * @fileOverview An AI agent that adapts a workout plan based on user feedback and wearable sensor data.
 *
 * @function adaptWorkoutPlan - Adapts a workout plan based on user feedback and sensor data.
 * @interface AdaptWorkoutPlanInput - The input type for the adaptWorkoutPlan function.
 * @interface AdaptWorkoutPlanOutput - The output type for the adaptWorkoutPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptWorkoutPlanInputSchema = z.object({
  workoutPlan: z
    .string()
    .describe('The current workout plan in JSON format.'),
  workoutFeedback: z
    .string()
    .describe('User feedback on the workout, including difficulty and enjoyment.'),
  wearableSensorData: z
    .string().optional()
    .describe(
      'Wearable sensor data from the workout, such as heart rate and pace. Should be passed as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'    ),
  userProfile: z.string().describe('User profile information including fitness level, goals, and preferences.'),
});

export type AdaptWorkoutPlanInput = z.infer<typeof AdaptWorkoutPlanInputSchema>;

const AdaptWorkoutPlanOutputSchema = z.object({
  adaptedWorkoutPlan: z
    .string()
    .describe('The adapted workout plan in JSON format.'),
  recommendations: z
    .string()
    .describe('Specific recommendations for future workouts based on feedback and data.'),
});

export type AdaptWorkoutPlanOutput = z.infer<typeof AdaptWorkoutPlanOutputSchema>;

export async function adaptWorkoutPlan(input: AdaptWorkoutPlanInput): Promise<AdaptWorkoutPlanOutput> {
  return adaptWorkoutPlanFlow(input);
}

const adaptWorkoutPlanPrompt = ai.definePrompt({
  name: 'adaptWorkoutPlanPrompt',
  input: {schema: AdaptWorkoutPlanInputSchema},
  output: {schema: AdaptWorkoutPlanOutputSchema},
  prompt: `You are an AI personal trainer that refines workout plans based on user feedback and wearable sensor data.

  Consider the following information:
  - Current Workout Plan: {{{workoutPlan}}}
  - Workout Feedback: {{{workoutFeedback}}}
  {{#if wearableSensorData}}
  - Wearable Sensor Data: {{media url=wearableSensorData}}
  {{else}}
  - No Wearable Sensor Data Provided
  {{/if}}
  - User Profile: {{{userProfile}}}

  Based on this information, generate an adapted workout plan in JSON format and provide specific recommendations for future workouts.
  Adapted Workout Plan: {{adaptedWorkoutPlan}}
  Recommendations: {{recommendations}}`,
});

const adaptWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'adaptWorkoutPlanFlow',
    inputSchema: AdaptWorkoutPlanInputSchema,
    outputSchema: AdaptWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await adaptWorkoutPlanPrompt(input);
    return output!;
  }
);
