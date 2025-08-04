
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
  planDurationWeeks: z.number().min(1).max(12).describe('The total duration of the workout plan in weeks.'),
  availableEquipment: z
    .array(z.string())
    .describe(
      'The equipment available to the user, e.g., ["treadmill", "weights", "resistance bands"]. Can be an empty array.'
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
  description: z.string().optional().describe('A brief description of the workout for this day, its purpose and focus.'),
});

const WeekPlanSchema = z.object({
  week: z.number().describe('The week number, e.g., 1.'),
  weekGoal: z.string().describe('The main goal for this specific week of training, e.g., "Focus on increasing volume" or "Technique improvement week".'),
  days: z.array(DayPlanSchema),
});

const GenerateWorkoutPlanOutputSchema = z.object({
  planTitle: z.string().describe('A catchy and motivating title for the entire workout plan.'),
  workoutPlan: z.array(WeekPlanSchema).describe('A detailed personalized workout plan, as an array of WeekPlan objects.'),
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
  model: 'googleai/gemini-1.5-flash-preview-0514',
  prompt: `You are an expert personal trainer. Your task is to create a personalized, multi-week workout plan. The total duration of the plan must be exactly {{{planDurationWeeks}}} weeks.

First, use the 'getWorkoutDatabase' tool to fetch the available workouts and exercises for the user's specified 'sportPreferences'.

Then, using ONLY the exercises from the provided database, create a structured plan. For EACH week, you must define a 'weekGoal' and create a 7-day plan. Each day's plan must contain a 'day', a 'title', a 'description' of the day's workout, and an array of 'exercises'.

The plan MUST contain exactly {{{workoutDaysPerWeek}}} workout days per week, and the rest should be rest days.

When selecting exercises, you MUST consider the user's 'availableEquipment'. If an exercise requires equipment not in the user's list, you MUST NOT include it.

Adapt the plan based on the user's entire profile:
- User Profile:
  - Gender: {{{gender}}}
  - Age: {{{age}}}
  - Weight: {{{weight}}} kg
  - Height: {{{height}}} cm
  - Fitness Level: {{{fitnessLevel}}}
  - Workout Days Per Week: {{{workoutDaysPerWeek}}}
  - Total Plan Duration: {{{planDurationWeeks}}} weeks
  - Available Equipment: {{#if availableEquipment}}{{#each availableEquipment}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}None{{/if}}
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
  - The plan should be for exactly {{{planDurationWeeks}}} weeks.
  - For each week, define a specific 'weekGoal'.
  - For each day in the week, define a 'day' (e.g., "День 1"), a 'title', a brief 'description', and an array of 'exercises'.
  - Distribute the {{{workoutDaysPerWeek}}} workout days evenly throughout the week, with appropriate rest days in between.
  - For each workout day, select a suitable workout type and a set of exercises from the database. For each exercise, you MUST include 'name', 'details', 'technique', and 'description'.
  - Adapt sets, reps, duration, and intensity based on the user's fitness level, goals, and the week number (e.g., progressive overload).
  - For rest days, the 'title' should be "День отдыха" and the 'exercises' array should be empty. The 'description' can mention light activity.
  - The final output MUST be a JSON object that perfectly matches the required output schema, including a 'planTitle'.
  - Ensure the response is in Russian.
  - IMPORTANT: Before finishing, double-check that EVERY day object in EVERY week of the plan contains the required fields: 'day', 'title', and 'exercises' to conform to the schema.
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
    
    // Defensive code: Ensure every day has an 'exercises' array and each exercise has all required fields.
    output.workoutPlan.forEach(week => {
      if (week.days) {
        week.days.forEach(day => {
          if (!day.exercises) {
            day.exercises = [];
          } else {
            day.exercises.forEach(exercise => {
              if (!exercise.details) exercise.details = 'N/A';
              if (!exercise.technique) exercise.technique = 'Техника не указана.';
              if (!exercise.description) exercise.description = 'Описание не указано.';
            });
          }
        });
      }
    });

    return output;
  }
);
