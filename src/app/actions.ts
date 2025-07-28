'use server';

import { generateWorkoutPlan, type GenerateWorkoutPlanInput, type GenerateWorkoutPlanOutput } from '@/ai/flows/generate-workout-plan';
import { analyzeWorkoutFeedback, type AnalyzeWorkoutFeedbackInput, type AnalyzeWorkoutFeedbackOutput } from '@/ai/flows/analyze-workout-feedback';
import { Sport, workoutDatabase } from '@/lib/workout-data';

export async function generatePlanAction(input: GenerateWorkoutPlanInput): Promise<GenerateWorkoutPlanOutput> {
  // AI-less fallback implementation
  try {
    const sportKey = input.sportPreferences as Sport;
    const sportData = workoutDatabase[sportKey];

    if (!sportData) {
      throw new Error(`Invalid sport preference: ${input.sportPreferences}`);
    }

    const workoutDays = input.workoutDaysPerWeek;
    const totalDays = 7;
    const restDays = totalDays - workoutDays;
    
    // Simple distribution of workout and rest days
    const planDays = Array.from({ length: totalDays }, (_, i) => {
      // This is a naive distribution logic, can be improved
      const workoutDayIndex = Math.floor(totalDays / workoutDays);
      return (i + 1) % workoutDayIndex === 0 || workoutDays === 7;
    });

    // Ensure we have the correct number of workout days
    let currentWorkoutDays = planDays.filter(d => d).length;
    let dayIndex = 0;
    while(currentWorkoutDays < workoutDays && dayIndex < totalDays) {
        if (!planDays[dayIndex]) {
            planDays[dayIndex] = true;
            currentWorkoutDays++;
        }
        dayIndex++;
    }
    while(currentWorkoutDays > workoutDays && dayIndex < totalDays) {
       if (planDays[dayIndex]) {
            planDays[dayIndex] = false;
            currentWorkoutDays--;
        }
        dayIndex++;
    }


    const sampleWorkout = sportData.workouts[0] || { name: 'Отдых', description: 'Отдых', exercises: [] };

    const plan = planDays.map((isWorkout, i) => {
      if (!isWorkout) {
        return {
          day: `День ${i + 1}`,
          title: 'День отдыха',
          exercises: [{ 
            name: 'Легкая активность', 
            details: 'Прогулка, растяжка или активный отдых.',
            description: 'Легкая активность помогает восстановиться и улучшить кровообращение.',
            technique: 'Выполняйте легкую прогулку в парке или сделайте комплекс суставной гимнастики и растяжки.'
          }],
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
            description: ex.description,
            technique: ex.technique,
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
