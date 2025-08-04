
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Flame, Brain, Dumbbell, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect, useState } from 'react';
import { getUserProfile } from '@/services/userService';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function BmrPage() {
  const router = useRouter();
  const { toast } = useToast();
  const user = auth.currentUser;
  const [bmr, setBmr] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        return;
    }
    async function fetchData() {
        try {
            const profile = await getUserProfile(user.uid);
            setBmr(profile?.bmr || null);
        } catch (e) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить данные о СООВ.' });
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [user, toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Button variant="ghost" onClick={() => router.push('/?tab=analytics')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к Аналитике
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-red-500/10">
                <Flame className="h-8 w-8 text-red-500" />
            </div>
            <div>
                 <CardTitle className="text-3xl">Базальный метаболизм (СООВ)</CardTitle>
                 <CardDescription className="text-lg text-red-500 font-bold">{bmr ?? 'N/A'} ккал/день</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-muted-foreground">
                Скорость основного обмена веществ (СООВ) или базальный метаболизм (BMR) — это количество калорий, которое ваше тело сжигает в состоянии полного покоя для поддержания базовых жизненных функций, таких как дыхание, кровообращение и работа мозга.
            </p>

             <Alert>
                <Brain className="h-4 w-4"/>
                <AlertTitle>Это не ваш общий расход калорий!</AlertTitle>
                <AlertDescription>
                    Ваш общий дневной расход энергии (TDEE) выше, так как он включает СООВ плюс калории, сожженные во время любой физической активности.
                </AlertDescription>
            </Alert>

             <div>
                <h3 className="font-semibold mb-2">Как увеличить СООВ:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li><span className='font-bold text-foreground flex items-center gap-2'><Dumbbell />Наращивание мышечной массы:</span> Мышцы сжигают больше калорий в состоянии покоя, чем жир.</li>
                    <li><span className='font-bold text-foreground'>Регулярные тренировки:</span> Особенно высокоинтенсивные интервальные тренировки (HIIT).</li>
                     <li><span className='font-bold text-foreground'>Достаточное потребление белка:</span> На переваривание белка тратится больше энергии.</li>
                </ul>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
