
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { registerUserAction } from '../actions';
import { Separator } from '@/components/ui/separator';

const signupSchema = z.object({
  email: z.string().email('Неверный формат email.'),
  password: z.string().min(6, 'Пароль должен содержать не менее 6 символов.'),
  name: z.string().min(1, 'Имя обязательно.'),
  gender: z.enum(['male', 'female', 'other']),
  age: z.coerce.number().min(1, 'Возраст обязателен.'),
  weight: z.coerce.number().min(1, 'Вес обязателен.'),
  height: z.coerce.number().min(1, 'Рост обязателен.'),
  mainGoal: z.string().min(1, 'Цель обязательна.'),
});


export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      gender: 'male',
      age: 30,
      weight: 80,
      height: 180,
      mainGoal: 'Поддерживать форму',
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      // 1. Call the server action to handle registration
      await registerUserAction(values);

      // 2. If successful, sign the user in on the client
      await signInWithEmailAndPassword(auth, values.email, values.password);
      
      toast({
        title: 'Аккаунт создан!',
        description: 'Добро пожаловать в OptimumPulse!',
      });
      
      // 3. Redirect to the main app page
      router.push('/');

    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = 'Произошла ошибка при регистрации.';
       // Check for specific backend errors, e.g., from Firebase Admin SDK
      if (error.message.includes('auth/email-already-exists')) {
        errorMessage = 'Этот email уже используется.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      toast({
        variant: 'destructive',
        title: 'Ошибка регистрации',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 py-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle>Создать аккаунт</CardTitle>
          <CardDescription>Присоединяйтесь к OptimumPulse и начните свой путь к лучшей форме уже сегодня!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="space-y-4">
                 <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Полное имя</FormLabel>
                    <FormControl><Input placeholder="Сергей Рахманинов" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )} />
              </div>
              
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
                Зарегистрироваться
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-4">
            <div className="text-sm text-muted-foreground">
              Уже есть аккаунт?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Войти
              </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
