
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { Separator } from '@/components/ui/separator';
import { createUserProfileAction } from '@/app/actions'; // Импортируем новый Server Action

const signupSchema = z.object({
  // Auth fields
  email: z.string().email('Неверный формат email.'),
  password: z.string().min(6, 'Пароль должен содержать не менее 6 символов.'),
  confirmPassword: z.string(),
  
  // Profile fields
  name: z.string().min(1, 'Имя обязательно.'),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Пожалуйста, выберите пол.' }),
  age: z.coerce.number().min(1, 'Возраст обязателен.'),
  weight: z.coerce.number().min(1, 'Вес обязателен.'),
  height: z.coerce.number().min(1, 'Рост обязателен.'),
  mainGoal: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
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
      confirmPassword: '',
      name: '',
      gender: undefined,
      age: 18,
      weight: 70,
      height: 175,
      mainGoal: 'Поддерживать форму',
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      // 1. Создаем пользователя в Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // 2. Вызываем Server Action для создания профиля в Firestore
      await createUserProfileAction(user.uid, {
          name: values.name,
          gender: values.gender,
          age: values.age,
          weight: values.weight,
          height: values.height,
          mainGoal: values.mainGoal,
      });
      
      toast({
        title: 'Аккаунт создан!',
        description: 'Добро пожаловать в OptimumPulse!',
      });
      router.push('/'); // Перенаправляем на главную страницу
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = 'Произошла ошибка при регистрации.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Этот email уже используется.';
      } else if (error.message.includes('Failed to create user profile')) {
        errorMessage = 'Не удалось сохранить данные профиля. Пожалуйста, попробуйте войти.';
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
              
              <div className="space-y-2">
                <h3 className="font-medium">Данные для входа</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                   <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Подтвердите пароль</FormLabel>
                        <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                  )} />
                </div>
              </div>
              
              <Separator />

              <div className="space-y-2">
                 <h3 className="font-medium">Информация о профиле</h3>
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Полное имя</FormLabel>
                      <FormControl><Input placeholder="Сергей Рахманинов" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
