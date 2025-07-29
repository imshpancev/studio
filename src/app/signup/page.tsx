
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { Separator } from '@/components/ui/separator';
import { createInitialUserProfile } from '@/services/userService';

const signupSchema = z.object({
  email: z.string().email('Неверный формат email.'),
  password: z.string().min(6, 'Пароль должен содержать не менее 6 символов.'),
  confirmPassword: z.string(),
  name: z.string().min(1, 'Имя обязательно.'),
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
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      // 1. Create user in Firebase Auth.
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      // 2. Update the new user's Auth profile with their name.
      await updateProfile(user, {
        displayName: values.name,
      });

      // 3. Create the initial, minimal profile in Firestore with onboardingCompleted: false
      await createInitialUserProfile(user.uid, values.email, values.name);

      toast({
        title: 'Аккаунт создан!',
        description: 'Теперь давайте заполним ваш профиль.',
      });
      
      // 4. Redirect to the onboarding page to collect the rest of the data.
      router.push('/onboarding');

    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = 'Произошла ошибка при регистрации.';
      if (error.code === 'auth/email-already-in-use') {
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
