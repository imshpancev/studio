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
  workoutName: z.string().min(1, 'Название тренировки обязательно.'),
  workoutDifficulty: z.number().min(1).max(10),
  workoutFeedback: z.string().min(1, 'Пожалуйста, оставьте отзыв.'),
  workoutPlan: z.string().min(1, 'Текущий план тренировок обязателен.'),
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
      workoutName: 'День 1: Силовая тренировка на все тело',
      workoutDifficulty: 7,
      workoutFeedback: 'Последний подход приседаний был очень сложным. Думаю, в следующий раз я смогу сделать больше отжиманий.',
      workoutPlan: '{"day": "День 1", "exercises": [{"name": "Приседания", "sets": 3, "reps": 12}, {"name": "Отжимания", "sets": 3, "reps": "до отказа"}]}',
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
        title: 'Анализ завершен!',
        description: 'Ваш план тренировок был адаптирован на основе ваших отзывов.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Произошла ошибка.',
        description: 'Не удалось проанализировать отзыв. Пожалуйста, попробуйте еще раз.',
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
              <FormLabel>Название тренировки</FormLabel>
              <FormControl>
                <Input placeholder="например, Утренняя пробежка, День ног" {...field} />
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
              <FormLabel>Воспринимаемая сложность</FormLabel>
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
              <FormDescription>По шкале от 1 (очень легко) до 10 (максимальное усилие).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="workoutFeedback"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Отзыв о тренировке</FormLabel>
              <FormControl>
                <Textarea placeholder="Как прошла тренировка? Были ли какие-то особые трудности или успехи?" {...field} />
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
              <FormLabel>Текущий план тренировок</FormLabel>
              <FormControl>
                <Textarea placeholder="Вставьте сюда свой текущий план тренировок в формате JSON." {...field} className="h-32 font-mono text-xs" />
              </FormControl>
              <FormDescription>Предоставьте план, которому вы сейчас следуете, для контекста.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="wearableSensorData"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Данные с носимых датчиков (необязательно)</FormLabel>
              <FormControl>
                <Textarea placeholder="Вставьте сюда данные датчиков (например, в виде URI данных)" {...field} className="h-24 font-mono text-xs" />
              </FormControl>
              <FormDescription>
                Предоставьте данные датчиков, такие как частота сердечных сокращений, темп и т. д., для более точного анализа.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Анализируем...' : 'Проанализировать и адаптировать план'}
        </Button>
      </form>
    </Form>
  );
}
