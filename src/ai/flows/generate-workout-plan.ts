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
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced'])
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

const ExerciseSchema = z.object({
  name: z.string().describe('The name of the exercise.'),
  details: z.string().describe('The details of the exercise, e.g., sets, reps, rest time.'),
});

const DayPlanSchema = z.object({
  day: z.string().describe('The day of the workout, e.g., "День 1".'),
  title: z.string().describe('The title for the workout day, e.g., "Силовая тренировка на все тело".'),
  exercises: z.array(ExerciseSchema),
});

const GenerateWorkoutPlanOutputSchema = z.object({
  workoutPlan: z.string().describe('A detailed personalized workout plan based on the user input, formatted as a JSON string representing an array of DayPlan objects.'),
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

  Create a detailed and personalized workout plan for the user.
  The output MUST be a JSON string that parses into an array of objects, where each object represents a workout day.
  Each day object must have the following properties: "day", "title", and "exercises".
  The "exercises" property must be an array of objects, where each object has "name" and "details" properties.
  For example:
  [
    {
      "day": "День 1",
      "title": "Силовая тренировка на все тело",
      "exercises": [
        { "name": "Приседания", "details": "3 подхода по 12 повторений, отдых 60 сек." },
        { "name": "Отжимания", "details": "3 подхода до отказа, отдых 60 сек." }
      ]
    },
    {
      "day": "День 2",
      "title": "Кардио и кор",
      "exercises": [
        { "name": "Бег", "details": "30 минут в умеренном темпе" },
        { "name": "Планка", "details": "3 подхода по 60 секунд" }
      ]
    }
  ]
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
