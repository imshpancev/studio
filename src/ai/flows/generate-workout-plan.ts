'use server';

/**
 * @fileoverview This file defines a Genkit flow for generating personalized workout plans.
 * The flow takes user preferences, fitness level, available equipment, workout history, and goals as input,
 * and outputs a personalized workout plan.
 *
 * @interface GenerateWorkoutPlanInput - The input type for the generateWorkoutPlan function.
 * @interface GenerateWorkoutPlanOutput - The output type for the generateWorkoutPlan function.
 * @function generateWorkoutPlan - The main function to generate personalized workout plans.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { workoutDatabase, Sport, type Workout } from '@/lib/workout-data';

// Tool to get the workout database
const getWorkoutDatabase = ai.defineTool(
  {
    name: 'getWorkoutDatabase',
    description: 'Get the list of available sports, workout types, and exercises.',
    inputSchema: z.object({
      sport: z.nativeEnum(Sport).optional().describe('Optional: filter by a specific sport to get its available workouts.'),
    }),
    outputSchema: z.array(z.any()), // Using z.any() because Workout type is complex for schema
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
    .describe('The user sport preferences, e.g., running, gym workouts, outdoor activities, home workouts.'),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced'])
    .describe(
      'The user fitness level, e.g., beginner, intermediate, advanced.'
    ),
  workoutDaysPerWeek: z.number().min(1).max(7).describe('The number of days per week the user wants to train.'),
  availableEquipment: z
    .array(z.string())
    .describe(
      'The equipment available to the user, e.g., ["treadmill", "weights", "resistance bands"]. Can be an empty array.'
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
  technique: z.string().describe('The detailed technique for performing the exercise.'),
  description: z.string().describe('A brief description of the exercise and its purpose.'),
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
  prompt: `You are an expert personal trainer. Your task is to create a personalized weekly workout plan.

First, use the 'getWorkoutDatabase' tool to fetch the available workouts and exercises for the user's specified 'sportPreferences'.

Then, using ONLY the exercises from the provided database, create a structured plan for a 7-day week. The plan must contain exactly {{{workoutDaysPerWeek}}} workout days and the rest should be rest days.

When selecting exercises, you MUST consider the user's 'availableEquipment'. If an exercise requires equipment not in the user's list, you MUST NOT include it.

Adapt the plan based on the user's entire profile:
- User Profile:
  - Gender: {{{gender}}}
  - Age: {{{age}}}
  - Weight: {{{weight}}} kg
  - Height: {{{height}}} cm
  - Fitness Level: {{{fitnessLevel}}}
  - Workout Days Per Week: {{{workoutDaysPerWeek}}}
  - Available Equipment: {{#if availableEquipment}}{{#each availableEquipment}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}
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
  - The plan should be for a 7-day week.
  - Distribute the {{{workoutDaysPerWeek}}} workout days evenly throughout the week, with appropriate rest days in between (e.g., Day 1, Day 3, Day 5 for 3 days/week).
  - For each workout day, select a suitable workout type from the database (e.g., 'Interval Run', 'Full Body Strength').
  - For each workout, select a set of exercises from the database. For each exercise, you MUST include the 'name', 'details', 'technique', and 'description' from the database.
  - Specify the 'details' for each exercise (e.g., "3 подхода по 12 повторений, отдых 60 сек.", "30 минут в умеренном темпе", "5 км"). Adapt sets, reps, duration, and intensity based on the user's fitness level and goals.
  - For rest days, the 'title' should be "День отдыха" and the 'exercises' array can be empty or contain one activity like "Легкая активность" or "Растяжка".
  - The final output MUST be a JSON object that perfectly matches the required output schema.
  - Ensure the response is in Russian.
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
    if (!output || !output.workoutPlan || output.workoutPlan.length === 0) {
      throw new Error("AI failed to generate a valid workout plan.");
    }
    return output;
  }
);
