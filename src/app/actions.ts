
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
  
  // Original AI implementation
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

export async function analyzeFeedbackAction(
  input: AnalyzeWorkoutFeedbackInput
): Promise<AnalyzeWorkoutFeedbackOutput> {
  try {
    const output = await analyzeWorkoutFeedback(input);
    return output;
  } catch (error) {
    console.error('Error analyzing workout feedback:', error);
    throw new Error('Failed to analyze workout feedback.');
  }
}
