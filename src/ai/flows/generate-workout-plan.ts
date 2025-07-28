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
import { workoutDatabase, Sport, Workout } from '@/lib/workout-data';

// Tool to get the workout database
const getWorkoutDatabase = ai.defineTool(
  {
    name: 'getWorkoutDatabase',
    description: 'Get the list of available sports, workout types, and exercises.',
    inputSchema: z.object({
      sport: z.nativeEnum(Sport).optional().describe('Optional: filter by a specific sport to get its available workouts.'),
    }),
    outputSchema: z.array(Workout),
  },
  async ({ sport }) => {
    if (sport) {
      return workoutDatabase[sport]?.workouts || [];
    }
    // This is a simplification. In a real scenario, you might return the whole database
    // or provide more sophisticated filtering. For now, we return all workouts from all sports.
    let allWorkouts: Workout[] = [];
    for (const s in workoutDatabase) {
      allWorkouts = allWorkouts.concat(workoutDatabase[s as Sport].workouts);
    }
    return allWorkouts;
  }
);


const GenerateWorkoutPlanInputSchema = z.object({
  gender: z.enum(['male', 'female', 'other']).describe("The user's gender."),
  age: z.number().describe("The user's age."),
  weight: z.number().describe("The user's weight in kilograms."),
  height: z.number().describe("The user's height in centimeters."),
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
  upcomingCompetitionReference: z.string().optional().describe('Optional information about upcoming competitions, e.g., "I want to run a marathon on October 10, 2025."'),
  healthDataFromWearables: z
    .string().optional()
    .describe(
      'Optional health data (heart rate, sleep quality, stress level etc.) obtained from wearable devices, which may inform the workout plan generation.'
    ),
  exerciseContraindications: z.string().optional().describe('Any exercises that the user has contraindications for, such as "squats" or "push ups".'),
});

export type GenerateWorkoutPlanInput = z.infer<typeof GenerateWorkoutPlanInputSchema>;

const ExerciseSchema = z.object({
  name: z.string().describe('The name of the exercise.'),
  details: z.string().describe('The details of the exercise, e.g., sets, reps, rest time, duration, or distance.'),
});

const DayPlanSchema = z.object({
  day: z.string().describe('The day of the workout, e.g., "День 1".'),
  title: z.string().describe('The title for the workout day, e.g., "Силовая тренировка на все тело".'),
  exercises: z.array(ExerciseSchema),
});

const GenerateWorkoutPlanOutputSchema = z.object({
  workoutPlan: z.array(DayPlanSchema).describe('A detailed personalized workout plan based on the user input, as an array of DayPlan objects.'),
});

export type GenerateWorkoutPlanOutput = z.infer<typeof GenerateWorkoutPlanOutputSchema>;

export async function generateWorkoutPlan(input: GenerateWorkoutPlanInput): Promise<GenerateWorkoutPlanOutput> {
  return generateWorkoutPlanFlow(input);
}

const generateWorkoutPlanPrompt = ai.definePrompt({
  name: 'generateWorkoutPlanPrompt',
  input: {schema: GenerateWorkoutPlanInputSchema},
  output: {schema: GenerateWorkoutPlanOutputSchema},
  tools: [getWorkoutDatabase],
  prompt: `You are an expert personal trainer. Your task is to create a personalized 7-day workout plan for a user based on their profile and goals.

First, use the 'getWorkoutDatabase' tool to fetch the available workouts and exercises for the user's specified 'sportPreferences'.

Then, using ONLY the exercises from the provided database, create a structured 7-day plan. You MUST NOT invent new exercises.

Adapt the plan based on the user's entire profile:
- User Profile:
  - Gender: {{{gender}}}
  - Age: {{{age}}}
  - Weight: {{{weight}}} kg
  - Height: {{{height}}} cm
  - Fitness Level: {{{fitnessLevel}}}
  - Available Equipment: {{{availableEquipment}}}
  - Workout History: {{{workoutHistory}}}
  - Goals: {{{goals}}}
  - Sport Preferences: {{{sportPreferences}}}
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
  - Exercise Contraindications: {{{exerciseContraindications}}}. You MUST avoid any exercises listed here.
  {{/if}}

- Plan Requirements:
  - The plan should be for 7 days, including rest days where appropriate.
  - For each workout day, select a suitable workout type from the database (e.g., 'Interval Run', 'Full Body Strength').
  - For each workout, select a set of exercises from the database.
  - Specify the details for each exercise (e.g., "3 подхода по 12 повторений, отдых 60 сек.", "30 минут в умеренном темпе", "5 км"). Adapt sets, reps, duration, and intensity based on the user's fitness level and goals.
  - The final output MUST be a JSON object that perfectly matches the required output schema.
  - Ensure the response is in Russian.

Example of a single day in the output:
{
  "day": "День 1",
  "title": "Силовая тренировка на все тело",
  "exercises": [
    { "name": "Приседания со штангой", "details": "3 подхода по 10 повторений, отдых 90 сек." },
    { "name": "Становая тяга", "details": "3 подхода по 8 повторений, отдых 120 сек." }
  ]
}
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
