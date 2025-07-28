'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generatePlanAction } from '@/app/actions';
import type { GenerateWorkoutPlanOutput } from '@/ai/flows/generate-workout-plan';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const formSchema = z.object({
  sportPreferences: z.string().min(1, 'Sport preferences are required.'),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  availableEquipment: z.string().min(1, 'Please list available equipment, or type "none".'),
  workoutHistory: z.string().min(1, 'Workout history is required.'),
  goals: z.string().min(1, 'Please describe your fitness goals.'),
  workoutDifficultyFeedback: z.string().optional(),
  upcomingCompetitionReference: z.string().optional(),
  healthDataFromWearables: z.string().optional(),
  exerciseContraindications: z.string().optional(),
});

type GeneratePlanFormProps = {
  onPlanGenerated: (data: GenerateWorkoutPlanOutput) => void;
};

export function GeneratePlanForm({ onPlanGenerated }: GeneratePlanFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sportPreferences: 'Running, gym workouts',
      fitnessLevel: 'intermediate',
      availableEquipment: 'Dumbbells, resistance bands',
      workoutHistory: 'Workout 3-4 times a week for the last year.',
      goals: 'Build muscle and improve cardiovascular endurance.',
      workoutDifficultyFeedback: '',
      upcomingCompetitionReference: '',
      healthDataFromWearables: '',
      exerciseContraindications: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await generatePlanAction(values);
      onPlanGenerated(result);
      toast({
        title: 'Success!',
        description: 'Your new workout plan has been generated.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to generate workout plan. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sportPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sport Preferences</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Running, gym workouts" {...field} />
                </FormControl>
                <FormDescription>Separate with commas.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fitnessLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fitness Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your fitness level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="availableEquipment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available Equipment</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Dumbbells, treadmill, or 'none'" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Goals</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., Lose weight, build muscle, run a 5k" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="workoutHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workout History</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your recent workout habits." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced-options" className='border-b-0'>
            <AccordionTrigger className="hover:no-underline">
              Advanced & Optional Details
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-6 pt-4'>
                <FormField
                  control={form.control}
                  name="upcomingCompetitionReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upcoming Competition</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Marathon on Oct 10, 2025" {...field} />
                      </FormControl>
                      <FormDescription>Tell us about any upcoming events you're training for.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="healthDataFromWearables"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Health Data Summary</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Avg. resting heart rate: 60bpm, Avg. sleep: 7 hours" {...field} />
                      </FormControl>
                      <FormDescription>Provide a summary of relevant health data from your wearables.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workoutDifficultyFeedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Workout Feedback</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Previous routines felt too easy/hard in some areas." {...field} />
                      </FormControl>
                      <FormDescription>Feedback on past workout difficulties.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="exerciseContraindications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise Contraindications</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 'squats' due to knee pain" {...field} />
                      </FormControl>
                      <FormDescription>List any exercises you need to avoid.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Generating Plan...' : 'Generate Workout Plan'}
        </Button>
      </form>
    </Form>
  );
}
