'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HeartPulse, Activity, Moon, Ruler, Weight, Droplets, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  // Basic Info
  gender: z.enum(['male', 'female', 'other']),
  age: z.coerce.number().min(1, 'Возраст обязателен.'),
  weight: z.coerce.number().min(1, 'Вес обязателен.'),
  height: z.coerce.number().min(1, 'Рост обязателен.'),
  
  // Vitals
  restingHeartRate: z.coerce.number().optional(),
  hrv: z.coerce.number().optional(),

  // Activity
  dailySteps: z.coerce.number().optional(),
  
  // Sleep
  avgSleepDuration: z.coerce.number().optional(),
  
  // Goals
  mainGoal: z.string().min(1, "Цель обязательна."),
});

export function ProfilePage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      gender: 'male',
      age: 30,
      weight: 80,
      height: 180,
      mainGoal: 'Нарастить мышечную массу',
      restingHeartRate: 60,
      hrv: 45,
      dailySteps: 8000,
      avgSleepDuration: 7.5,
    },
  });

  function onSubmit(values: z.infer<typeof profileSchema>) {
    console.log(values);
    toast({
      title: 'Профиль обновлен!',
      description: 'Ваши данные были успешно сохранены.',
    });
  }

  return (
    <div className="max-w-4xl mx-auto">
       <Card>
        <CardHeader>
          <CardTitle>Ваш Профиль</CardTitle>
          <CardDescription>Обновите вашу личную информацию и отслеживаемые показатели здоровья. Эти данные помогут нам точнее адаптировать ваши планы.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Personal Info Section */}
              <div className="space-y-4">
                 <h3 className="text-lg font-medium text-primary">Основная информация</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пол</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Пол" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="male">Мужской</SelectItem>
                            <SelectItem value="female">Женский</SelectItem>
                            <SelectItem value="other">Другой</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="age" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Возраст</FormLabel>
                        <FormControl><Input type="number" placeholder="30" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="weight" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Вес (кг)</FormLabel>
                        <FormControl><Input type="number" placeholder="80" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="height" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Рост (см)</FormLabel>
                        <FormControl><Input type="number" placeholder="180" {...field} /></FormControl>
                      </FormItem>
                    )} />
                 </div>
              </div>

              {/* Health Metrics Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-primary">Показатели здоровья</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField control={form.control} name="restingHeartRate" render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'><HeartPulse className='w-4 h-4' />Пульс в покое</FormLabel>
                      <FormControl><Input type="number" placeholder="60" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="hrv" render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'><Droplets className='w-4 h-4' />ВСР (HRV), мс</FormLabel>
                      <FormControl><Input type="number" placeholder="45" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="dailySteps" render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'><Activity className='w-4 h-4' />Среднее кол-во шагов</FormLabel>
                      <FormControl><Input type="number" placeholder="8000" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="avgSleepDuration" render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'><Moon className='w-4 h-4' />Средний сон (часы)</FormLabel>
                      <FormControl><Input type="number" step="0.1" placeholder="7.5" {...field} /></FormControl>
                    </FormItem>
                  )} />
                </div>
              </div>

              {/* Goals Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-primary">Цели</h3>
                 <FormField control={form.control} name="mainGoal" render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'><Target className='w-4 h-4' />Основная цель</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Выберите вашу основную цель" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Похудеть">Похудеть</SelectItem>
                          <SelectItem value="Нарастить мышечную массу">Нарастить мышечную массу</SelectItem>
                          <SelectItem value="Улучшить выносливость">Улучшить выносливость</SelectItem>
                          <SelectItem value="Поддерживать форму">Поддерживать форму</SelectItem>
                          <SelectItem value="Подготовиться к соревнованиям">Подготовиться к соревнованиям</SelectItem>
                        </SelectContent>
                      </Select>
                  </FormItem>
                )} />
              </div>

              <Button type="submit">Сохранить изменения</Button>
            </form>
          </Form>
        </CardContent>
       </Card>
    </div>
  );
}
