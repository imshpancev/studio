'use server';

import { generateWorkoutPlan, type GenerateWorkoutPlanInput, type GenerateWorkoutPlanOutput } from '@/ai/flows/generate-workout-plan';
import { analyzeWorkoutFeedback, type AnalyzeWorkoutFeedbackInput, type AnalyzeWorkoutFeedbackOutput } from '@/ai/flows/analyze-workout-feedback';
import { Sport, workoutDatabase } from '@/lib/workout-data';

export async function generatePlanAction(input: GenerateWorkoutPlanInput): Promise<GenerateWorkoutPlanOutput> {
  // AI-less fallback implementation
  try {
    // This is a simplified fallback. In a real app, this logic would be more sophisticated.
    const sportKey = input.sportPreferences as Sport;
    const sportData = workoutDatabase[sportKey];

    if (!sportData) {
      throw new Error(`Invalid sport preference: ${input.sportPreferences}`);
    }

    // Create a simple 7-day plan using the first workout for the selected sport
    const sampleWorkout = sportData.workouts[0] || { name: 'Отдых', exercises: [] };

    const plan = Array.from({ length: 7 }, (_, i) => {
      // Make days 4 and 7 rest days
      if (i === 3 || i === 6) {
        return {
          day: `День ${i + 1}`,
          title: 'День отдыха',
          exercises: [{ name: 'Легкая активность', details: 'Прогулка, растяжка или активный отдых.' }],
        };
      }
      return {
        day: `День ${i + 1}`,
        title: sampleWorkout.name,
        // Adapt exercise details based on fitness level
        exercises: sampleWorkout.exercises.map(ex => {
          let details = "3 подхода по 12 повторений, отдых 60 сек.";
          if (input.fitnessLevel === 'beginner') {
            details = "3 подхода по 8 повторений, отдых 90 сек.";
          } else if (input.fitnessLevel === 'advanced') {
            details = "4 подхода по 15 повторений, отдых 45 сек.";
          }
          return {
            name: ex.name,
            details: details,
          };
        }),
      };
    });

    // Simulate a delay to mimic AI generation time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { workoutPlan: plan };
  } catch (error) {
    console.error('Error generating static workout plan:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate workout plan: ${error.message}`);
    }
    throw new Error('An unknown error occurred while generating the workout plan.');
  }

  /*
  // Original AI implementation
  try {
    const output = await generateWorkoutPlan(input);
    return output;
  } catch (error) {
    console.error('Error generating workout plan in action:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate workout plan: ${error.message}`);
    }
    throw new Error('An unknown error occurred while generating the workout plan.');
  }
  */
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
