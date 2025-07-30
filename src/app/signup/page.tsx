
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
import { signUpAction } from '../actions';

const signupSchema = z.object({
  email: z.string().email('Неверный формат email.'),
  password: z.string().min(6, 'Пароль должен содержать не менее 6 символов.'),
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
    },
  });

  const onSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      // 1. Call server action to create user in Auth and Firestore
      await signUpAction(values.email, values.password);
      
      // 2. Sign in the user on the client to establish a session
      await signInWithEmailAndPassword(auth, values.email, values.password);

      toast({
        title: 'Аккаунт создан!',
        description: 'Теперь давайте завершим настройку вашего профиля.',
      });
      
      // 3. Redirect to the onboarding page
      router.push('/onboarding');

    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        variant: 'destructive',
        title: 'Ошибка регистрации',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 py-8">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Создать аккаунт</CardTitle>
          <CardDescription>Присоединяйтесь к The LighSport и начните свой путь к лучшей форме уже сегодня!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
