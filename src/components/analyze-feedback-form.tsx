'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { analyzeFeedbackAction } from '@/app/actions';
import type { AnalyzeWorkoutFeedbackOutput } from '@/ai/flows/analyze-workout-feedback';

const formSchema = z.object({
  workoutName: z.string().min(1, 'Workout name is required.'),
  workoutDifficulty: z.number().min(1).max(10),
  workoutFeedback: z.string().min(1, 'Please provide some feedback.'),
  workoutPlan: z.string().min(1, 'The current workout plan is required.'),
  wearableSensorData: z.string().optional(),
});

type AnalyzeFeedbackFormProps = {
  onAnalysisComplete: (data: AnalyzeWorkoutFeedbackOutput) => void;
};

export function AnalyzeFeedbackForm({ onAnalysisComplete }: AnalyzeFeedbackFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workoutName: 'Day 1: Full Body Strength',
      workoutDifficulty: 7,
      workoutFeedback: 'The last set of squats was very challenging. I think I can do more push-ups next time.',
      workoutPlan: '{"day": "Day 1", "exercises": [{"name": "Squats", "sets": 3, "reps": 12}, {"name": "Push-ups", "sets": 3, "reps": "failure"}]}',
      wearableSensorData: '',
    },
  });
  
  const difficultyValue = form.watch('workoutDifficulty');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await analyzeFeedbackAction({
        ...values,
        wearableSensorData: values.wearableSensorData || '', 
      });
      onAnalysisComplete(result);
      toast({
        title: 'Analysis Complete!',
        description: 'Your workout plan has been adapted based on your feedback.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to analyze feedback. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="workoutName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workout Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Morning Run, Leg Day" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="workoutDifficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Perceived Difficulty</FormLabel>
              <FormControl>
                <div className='flex items-center gap-4 pt-2'>
                   <Slider
                      min={1}
                      max={10}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                    <span className='font-bold text-lg text-primary w-8 text-center'>{difficultyValue}</span>
                </div>
              </FormControl>
              <FormDescription>On a scale of 1 (very easy) to 10 (maximal effort).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="workoutFeedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workout Feedback</FormLabel>
              <FormControl>
                <Textarea placeholder="How did the workout feel? Any specific challenges or successes?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="workoutPlan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Workout Plan</FormLabel>
              <FormControl>
                <Textarea placeholder="Paste your current workout plan JSON here." {...field} className="h-32 font-mono text-xs" />
              </FormControl>
              <FormDescription>Provide the plan you are currently following for context.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="wearableSensorData"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wearable Sensor Data (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Paste sensor data here (e.g., as a data URI)" {...field} className="h-24 font-mono text-xs" />
              </FormControl>
              <FormDescription>
                Provide sensor data like heart rate, pace, etc. for a more accurate analysis.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Analyzing...' : 'Analyze & Adapt Plan'}
        </Button>
      </form>
    </Form>
  );
}
