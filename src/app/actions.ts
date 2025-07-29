
'use server';

import { generateWorkoutPlan as generateWorkoutPlanFlow, type GenerateWorkoutPlanInput, type GenerateWorkoutPlanOutput } from "@/ai/flows/generate-workout-plan";
import { processWorkoutSummary as processWorkoutSummaryFlow, type ProcessWorkoutSummaryInput, type ProcessWorkoutSummaryOutput } from "@/ai/flows/process-workout-summary";
import { registerUserFlow, type RegisterUserInput, type RegisterUserOutput } from "@/ai/flows/register-user";


/**
 * Server Action to register a user.
 * This wraps the Genkit flow for user registration.
 * @param input - The user's registration details.
 * @returns The newly created user's basic info.
 */
export async function registerUserAction(input: RegisterUserInput): Promise<RegisterUserOutput> {
  try {
    const result = await registerUserFlow(input);
    return result;
  } catch (error) {
    console.error('Error in registerUserAction:', error);
    // Re-throw with a generic message for the client
    throw new Error('An error occurred during registration. Please try again.');
  }
}


/**
 * Server Action to generate a workout plan.
 * @param input - The input data for the workout plan generation.
 * @returns The generated workout plan.
 */
export async function generatePlanAction(input: GenerateWorkoutPlanInput): Promise<GenerateWorkoutPlanOutput> {
  try {
    const plan = await generateWorkoutPlanFlow(input);
    return plan;
  } catch (error) {
    console.error('Error in generatePlanAction:', error);
    throw new Error('Failed to generate workout plan.');
  }
}


/**
 * Server Action to process a workout summary.
 * @param input - The workout summary and feedback.
 * @returns The analysis of the feedback.
 */
export async function processWorkoutSummaryAction(input: ProcessWorkoutSummaryInput): Promise<ProcessWorkoutSummaryOutput> {
  try {
    const result = await processWorkoutSummaryFlow(input);
    return result;
  } catch (error) {
    console.error('Error in processWorkoutSummaryAction:', error);
    throw new Error('Failed to process workout summary.');
  }
}

