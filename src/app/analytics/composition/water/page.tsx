
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Droplets, Droplet } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { WaterIntakeCard } from '@/components/water-intake-card';

export default function WaterPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Button variant="ghost" onClick={() => router.push('/?tab=analytics')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к Аналитике
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-blue-500/10">
                <Droplets className="h-8 w-8 text-blue-500" />
            </div>
            <div>
                 <CardTitle className="text-3xl">Вода в организме</CardTitle>
                 <CardDescription className="text-lg text-blue-500 font-bold">48.6% (Низкий)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-muted-foreground">
                Этот показатель отражает общее количество жидкости в организме в процентах от его общей массы. Адекватная гидратация крайне важна для здоровья, спортивных результатов, когнитивных функций и метаболизма.
            </p>

            <Alert variant="destructive">
                <Droplet className="h-4 w-4"/>
                <AlertTitle>Рекомендация</AlertTitle>
                <AlertDescription>
                    Ваш уровень гидратации ниже оптимального. Увеличьте потребление воды в течение дня, особенно до, во время и после тренировок.
                </AlertDescription>
            </Alert>
            
            <WaterIntakeCard />

             <div>
                <h3 className="font-semibold mb-2">Оптимальные диапазоны:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li><span className='font-bold text-foreground'>Мужчины:</span> 50% - 65%</li>
                    <li><span className='font-bold text-foreground'>Женщины:</span> 45% - 60%</li>
                </ul>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
