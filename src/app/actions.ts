
'use server';

import {
  generateWorkoutPlan,
  type GenerateWorkoutPlanInput,
  type GenerateWorkoutPlanOutput,
} from '@/ai/flows/generate-workout-plan';
import {
  analyzeWorkoutFeedback,
  type AnalyzeWorkoutFeedbackInput,
  type AnalyzeWorkoutFeedbackOutput,
} from '@/ai/flows/analyze-workout-feedback';
import {
  processWorkoutSummary,
  type ProcessWorkoutSummaryInput,
  type ProcessWorkoutSummaryOutput,
} from '@/ai/flows/process-workout-summary';
import { Sport, workoutDatabase } from '@/lib/workout-data';
import { auth } from '@/lib/firebase';
import { updateUserProfile } from '@/services/userService';

export async function generatePlanAction(
  input: GenerateWorkoutPlanInput
): Promise<GenerateWorkoutPlanOutput> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  try {
    const output = await generateWorkoutPlan(input);
    
    // Save the generated plan to the user's profile
    await updateUserProfile(user.uid, { workoutPlan: output, workoutPlanInput: input });

    return output;
  } catch (error) {
    console.error('Error generating workout plan in action:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate workout plan: ${error.message}`);
    }
    throw new Error('An unknown error occurred while generating the workout plan.');
  }
}

export async function processWorkoutSummaryAction(
  input: ProcessWorkoutSummaryInput
): Promise<ProcessWorkoutSummaryOutput> {
  try {
    const output = await processWorkoutSummary(input);
    // The flow now handles saving the workout and analyzing feedback.
    // We can potentially do more here, like updating the user's profile with the new plan.
    return output;
  } catch (error) {
    console.error('Error processing workout summary:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to process workout summary: ${error.message}`);
    }
    throw new Error('An unknown error occurred while processing the workout summary.');
  }
}
