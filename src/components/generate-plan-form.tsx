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
  sportPreferences: z.string().min(1, 'Предпочтения в спорте обязательны.'),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  availableEquipment: z.string().min(1, 'Пожалуйста, укажите доступное оборудование или напишите "нет".'),
  workoutHistory: z.string().min(1, 'История тренировок обязательна.'),
  goals: z.string().min(1, 'Пожалуйста, опишите свои фитнес-цели.'),
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
      sportPreferences: 'Бег',
      fitnessLevel: 'intermediate',
      availableEquipment: 'Гантели, эспандеры',
      workoutHistory: 'Тренируюсь 3-4 раза в неделю в течение последнего года.',
      goals: 'Нарастить мышечную массу и улучшить сердечно-сосудистую выносливость.',
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
        title: 'Успех!',
        description: 'Ваш новый план тренировок был сгенерирован.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Произошла ошибка.',
        description: 'Не удалось сгенерировать план тренировок. Пожалуйста, попробуйте еще раз.',
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
                <FormLabel>Предпочтения в спорте</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите ваш вид спорта" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Бег">Бег</SelectItem>
                    <SelectItem value="Тренажерный зал">Тренажерный зал</SelectItem>
                    <SelectItem value="Домашние тренировки">Домашние тренировки</SelectItem>
                    <SelectItem value="Плавание">Плавание</SelectItem>
                    <SelectItem value="Йога">Йога</SelectItem>
                     <SelectItem value="Другое">Другое (укажите в целях)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fitnessLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Уровень подготовки</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите ваш уровень подготовки" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Начинающий</SelectItem>
                    <SelectItem value="intermediate">Средний</SelectItem>
                    <SelectItem value="advanced">Продвинутый</SelectItem>
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
              <FormLabel>Доступное оборудование</FormLabel>
              <FormControl>
                <Input placeholder="например, Гантели, беговая дорожка, или 'нет'" {...field} />
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
              <FormLabel>Основные цели</FormLabel>
              <FormControl>
                <Textarea placeholder="например, Похудеть, нарастить мышцы, пробежать 5 км" {...field} />
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
              <FormLabel>История тренировок</FormLabel>
              <FormControl>
                <Textarea placeholder="Опишите свои недавние тренировочные привычки." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced-options" className='border-b-0'>
            <AccordionTrigger className="hover:no-underline">
              Расширенные и необязательные детали
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-6 pt-4'>
                <FormField
                  control={form.control}
                  name="upcomingCompetitionReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Предстоящие соревнования</FormLabel>
                      <FormControl>
                        <Input placeholder="например, Марафон 10 октября 2025 г." {...field} />
                      </FormControl>
                      <FormDescription>Расскажите нам о любых предстоящих событиях, к которым вы готовитесь.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="healthDataFromWearables"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сводка данных о здоровье</FormLabel>
                      <FormControl>
                        <Textarea placeholder="например, Средний пульс в покое: 60 ударов в минуту, Средний сон: 7 часов" {...field} />
                      </FormControl>
                      <FormDescription>Предоставьте сводку соответствующих данных о состоянии здоровья с ваших носимых устройств.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workoutDifficultyFeedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Отзывы о сложности предыдущих тренировок</FormLabel>
                      <FormControl>
                        <Textarea placeholder="например, Предыдущие программы казались слишком легкими/сложными в некоторых областях." {...field} />
                      </FormControl>
                      <FormDescription>Отзывы о сложности прошлых тренировок.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="exerciseContraindications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Противопоказания к упражнениям</FormLabel>
                      <FormControl>
                        <Input placeholder="например, 'приседания' из-за боли в колене" {...field} />
                      </FormControl>
                      <FormDescription>Перечислите все упражнения, которых вам следует избегать.</FormDescription>
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
          {isLoading ? 'Создание плана...' : 'Создать план тренировок'}
        </Button>
      </form>
    </Form>
  );
}
