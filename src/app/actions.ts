'use server';

import { generateWorkoutPlan, type GenerateWorkoutPlanInput, type GenerateWorkoutPlanOutput } from '@/ai/flows/generate-workout-plan';
import { analyzeWorkoutFeedback, type AnalyzeWorkoutFeedbackInput, type AnalyzeWorkoutFeedbackOutput } from '@/ai/flows/analyze-workout-feedback';

export async function generatePlanAction(input: GenerateWorkoutPlanInput): Promise<GenerateWorkoutPlanOutput> {
  try {
    const output = await generateWorkoutPlan(input);
    return output;
  } catch (error) {
    console.error('Error generating workout plan in action:', error);
    // Re-throwing the error to be caught by the form handler
    if (error instanceof Error) {
      throw new Error(`Failed to generate workout plan: ${error.message}`);
    }
    throw new Error('An unknown error occurred while generating the workout plan.');
  }
}

export async function analyzeFeedbackAction(input: AnalyzeWorkoutFeedbackInput): Promise<AnalyzeWorkoutFeedbackOutput> {
  try {
    const output = await analyzeWorkoutFeedback(input);
    return output;
  } catch (error) {
    console.error('Error analyzing workout feedback:', error);
    throw new Error('Failed to analyze workout feedback.');
  }
}
