
'use server';

import { generateWorkoutPlan as generateWorkoutPlanFlow, type GenerateWorkoutPlanInput, type GenerateWorkoutPlanOutput } from "@/ai/flows/generate-workout-plan";
import { processWorkoutSummary as processWorkoutSummaryFlow, type ProcessWorkoutSummaryInput, type ProcessWorkoutSummaryOutput } from "@/ai/flows/process-workout-summary";

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
