
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { useState, useEffect } from 'react';
import { updateUserProfile, getUserProfile } from '@/services/userService';
import { Loader2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const onboardingSchema = z.object({
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Пожалуйста, выберите пол.' }),
  age: z.coerce.number().min(1, 'Возраст обязателен.'),
  weight: z.coerce.number().min(1, 'Вес обязателен.'),
  height: z.coerce.number().min(1, 'Рост обязателен.'),
  mainGoal: z.string().optional(),
});


export function OnboardingForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user = auth.currentUser;

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
        gender: undefined,
        age: 18,
        weight: 70,
        height: 175,
        mainGoal: 'Поддерживать форму',
    },
  });
  
  useEffect(() => {
    if (user) {
        setIsLoading(false);
    } else {
        // If no user, wait for auth state to change or redirect
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                router.push('/login');
            } else {
                 setIsLoading(false);
            }
        });
        return () => unsubscribe();
    }
  }, [user, router]);
  
  async function onSubmit(values: z.infer<typeof onboardingSchema>) {
    if (!user) {
        toast({ variant: 'destructive', title: 'Ошибка', description: 'Пользователь не найден. Пожалуйста, войдите снова.'});
        router.push('/login');
        return;
    };
    setIsSaving(true);
    try {
        await updateUserProfile(user.uid, {
            ...values,
            onboardingCompleted: true,
        });
        toast({
            title: 'Профиль создан!',
            description: 'Добро пожаловать! Давайте начнем ваш путь к лучшей форме.',
        });
        router.push('/');
    } catch (error) {
        console.error("Failed to save onboarding data:", error);
        toast({
            variant: "destructive",
            title: "Ошибка сохранения",
            description: "Не удалось сохранить данные. Попробуйте еще раз."
        });
    } finally {
        setIsSaving(false);
    }
  }
  
  if (isLoading) {
      return (
          <div className='space-y-6'>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
             <Skeleton className="h-10 w-full" />
             <Skeleton className="h-10 w-full" />
          </div>
      )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabel>Пол</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Пол" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="male">Мужской</SelectItem>
                      <SelectItem value="female">Женский</SelectItem>
                      <SelectItem value="other">Другой</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="age" render={({ field }) => (
                <FormItem>
                  <FormLabel>Возраст</FormLabel>
                  <FormControl><Input type="number" placeholder="30" {...field} /></FormControl>
                   <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="weight" render={({ field }) => (
                <FormItem>
                  <FormLabel>Вес (кг)</FormLabel>
                  <FormControl><Input type="number" placeholder="80" {...field} /></FormControl>
                   <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="height" render={({ field }) => (
                <FormItem>
                  <FormLabel>Рост (см)</FormLabel>
                  <FormControl><Input type="number" placeholder="180" {...field} /></FormControl>
                   <FormMessage />
                </FormItem>
              )} />
           </div>

            <FormField control={form.control} name="mainGoal" render={({ field }) => (
              <FormItem>
                  <FormLabel>Ваша основная фитнес-цель?</FormLabel>
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
                   <FormMessage />
              </FormItem>
            )} />

        <Button type="submit" disabled={isSaving || !user} className="w-full">
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Завершить и начать
        </Button>
      </form>
    </Form>
  );
}
