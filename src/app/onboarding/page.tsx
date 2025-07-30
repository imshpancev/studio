
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { completeOnboardingAction } from '../actions';
import { Separator } from '@/components/ui/separator';

const onboardingSchema = z.object({
  name: z.string().min(1, 'Имя обязательно.'),
  gender: z.enum(['male', 'female', 'other'], { required_error: "Пол обязателен." }),
  age: z.coerce.number().min(1, 'Возраст обязателен.'),
  weight: z.coerce.number().min(1, 'Вес обязателен.'),
  height: z.coerce.number().min(1, 'Рост обязателен.'),
  mainGoal: z.string().min(1, 'Цель обязательна.'),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push('/login'); // Redirect if not logged in
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: '',
      gender: 'male',
      age: 30,
      weight: 80,
      height: 180,
      mainGoal: 'Поддерживать форму',
    },
  });

  const onSubmit = async (values: OnboardingFormData) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Ошибка', description: 'Пользователь не найден. Пожалуйста, войдите снова.' });
        return;
    }
    setIsLoading(true);
    try {
      await completeOnboardingAction(user.uid, values);
      
      toast({
        title: 'Профиль настроен!',
        description: 'Добро пожаловать в The LighSport!',
      });
      
      router.push('/');

    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: error.message || 'Не удалось обновить профиль.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle>Завершение регистрации</CardTitle>
          <CardDescription>Расскажите нам немного о себе, чтобы мы могли персонализировать ваш опыт.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Полное имя</FormLabel>
                  <FormControl><Input placeholder="Сергей Рахманинов" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <Separator />

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={form.control} name="gender" render={({ field }) => (
                        <FormItem><FormLabel>Пол</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent><SelectItem value="male">Мужской</SelectItem><SelectItem value="female">Женский</SelectItem><SelectItem value="other">Другой</SelectItem></SelectContent>
                        </Select><FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="age" render={({ field }) => (
                        <FormItem><FormLabel>Возраст</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="weight" render={({ field }) => (
                        <FormItem><FormLabel>Вес (кг)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="height" render={({ field }) => (
                        <FormItem><FormLabel>Рост (см)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="mainGoal" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ваша основная фитнес-цель?</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
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
              </div>


              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Завершить и начать
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
