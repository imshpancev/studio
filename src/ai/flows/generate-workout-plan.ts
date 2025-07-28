'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized workout plans.
 * The flow takes user preferences, fitness level, available equipment, workout history, and goals as input,
 * and outputs a personalized workout plan.
 *
 * @interface GenerateWorkoutPlanInput - The input type for the generateWorkoutPlan function.
 * @interface GenerateWorkoutPlanOutput - The output type for the generateWorkoutPlan function.
 * @function generateWorkoutPlan - The main function to generate personalized workout plans.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWorkoutPlanInputSchema = z.object({
  sportPreferences: z
    .string()
    .describe('The user sport preferences, e.g., running, gym workouts, outdoor activities, home workouts. Multiple sports can be specified, separated by commas.'),
  fitnessLevel: z
    .string()
    .describe(
      'The user fitness level, e.g., beginner, intermediate, advanced.'
    ),
  availableEquipment: z
    .string()
    .describe(
      'The equipment available to the user, e.g., treadmill, weights, resistance bands. Specify none if no equipment is available. Multiple items can be specified, separated by commas.'
    ),
  workoutHistory: z
    .string()
    .describe(
      'A summary of the user past workout history, including frequency, duration, and types of exercises performed.'
    ),
  goals: z
    .string()
    .describe(
      'The user fitness goals, e.g., lose weight, build muscle, improve endurance.'
    ),
  workoutDifficultyFeedback: z
    .string().optional()
    .describe(
      'Optional feedback from the user on previous workout difficulties. Should be in a simple sentences.'
    ),
  upcomingCompetitionReference: z.string().optional().describe('Optional information about upcoming competitions, e.g., \"I want to run a marathon on October 10, 2025.\"'),
  healthDataFromWearables: z
    .string().optional()
    .describe(
      'Optional health data (heart rate, sleep quality, stress level etc.) obtained from wearable devices, which may inform the workout plan generation.'
    ),
  exerciseContraindications: z.string().optional().describe('Any exercises that the user has contraindications for, such as \"squats\" or \"push ups\".'),
});

export type GenerateWorkoutPlanInput = z.infer<typeof GenerateWorkoutPlanInputSchema>;

const GenerateWorkoutPlanOutputSchema = z.object({
  workoutPlan:
    z
      .string()
      .describe('A detailed personalized workout plan based on the user input.'),
});

export type GenerateWorkoutPlanOutput = z.infer<typeof GenerateWorkoutPlanOutputSchema>;

export async function generateWorkoutPlan(input: GenerateWorkoutPlanInput): Promise<GenerateWorkoutPlanOutput> {
  return generateWorkoutPlanFlow(input);
}

const generateWorkoutPlanPrompt = ai.definePrompt({
  name: 'generateWorkoutPlanPrompt',
  input: {schema: GenerateWorkoutPlanInputSchema},
  output: {schema: GenerateWorkoutPlanOutputSchema},
  prompt: `You are an expert personal trainer who can create personalized workout plans for users based on their preferences, fitness level, available equipment, workout history, and goals.

  Consider the following information about the user:
  - Sport Preferences: {{{sportPreferences}}}
  - Fitness Level: {{{fitnessLevel}}}
  - Available Equipment: {{{availableEquipment}}}
  - Workout History: {{{workoutHistory}}}
  - Goals: {{{goals}}}
  {{#if workoutDifficultyFeedback}}
  - Previous Workout Difficulty Feedback: {{{workoutDifficultyFeedback}}}
  {{/if}}
  {{#if upcomingCompetitionReference}}
  - Upcoming Competition Reference: {{{upcomingCompetitionReference}}}
  {{/if}}
  {{#if healthDataFromWearables}}
  - Health Data from Wearables: {{{healthDataFromWearables}}}
  {{/if}}
  {{#if exerciseContraindications}}
  - Exercise Contraindications: {{{exerciseContraindications}}}
  {{/if}}

  Create a detailed and personalized workout plan for the user. The workout plan should include specific exercises, sets, reps, and rest times. Be sure to consider user preferences, fitness level, equipment, history and goals when creating the plan.
  `,
});

const generateWorkoutPlanFlow = ai.defineFlow(
  {
    name: 'generateWorkoutPlanFlow',
    inputSchema: GenerateWorkoutPlanInputSchema,
    outputSchema: GenerateWorkoutPlanOutputSchema,
  },
  async input => {
    const {output} = await generateWorkoutPlanPrompt(input);
    return output!;
  }
);

