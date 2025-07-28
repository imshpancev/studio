
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function RecoveryPage() {
  const router = useRouter();
  const recoveryTimeHours = 28;
  const totalRecommendedTime = 48; // Example total
  const recoveryProgress = (1 - (recoveryTimeHours / totalRecommendedTime)) * 100;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к Аналитике
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-blue-500/10">
                <ShieldCheck className="h-8 w-8 text-blue-500" />
            </div>
            <div>
                 <CardTitle className="text-3xl">Время восстановления</CardTitle>
                 <CardDescription className="text-lg text-blue-500 font-bold">Осталось {recoveryTimeHours} часов</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-muted-foreground">
                Этот показатель оценивает, сколько времени вашему телу требуется для полного восстановления после последней тренировки перед следующей высокоинтенсивной нагрузкой. Он учитывает интенсивность тренировки, вашу общую тренировочную нагрузку и уровень стресса.
            </p>

            <div className='text-center'>
                <p className='text-sm text-muted-foreground'>Прогресс восстановления</p>
                <Progress value={recoveryProgress} className="h-4 mt-2" />
                <p className='text-xs mt-1'>{Math.round(recoveryProgress)}% восстановлено</p>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4 bg-muted/50">
                    <CardHeader className='p-2'>
                        <CardTitle className='text-lg flex items-center gap-2'><Clock />Когда следующая тяжелая тренировка?</CardTitle>
                    </CardHeader>
                    <CardContent className='p-2'>
                        <p>Следующую высокоинтенсивную тренировку (например, интервалы или силовую с большими весами) рекомендуется провести не ранее, чем через {recoveryTimeHours} часов. Это позволит мышцам восстановиться и снизит риск травм.</p>
                    </CardContent>
                </Card>
                 <Card className="p-4 bg-muted/50">
                    <CardHeader className='p-2'>
                        <CardTitle className='text-lg flex items-center gap-2'><CheckCircle />Что делать сейчас?</CardTitle>
                    </CardHeader>
                    <CardContent className='p-2'>
                        <p>В период восстановления вы можете выполнять легкие активности, такие как прогулка, растяжка, йога или легкий бег трусцой. Это может ускорить восстановление. Главное — прислушиваться к своему телу.</p>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Как интерпретировать время восстановления:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li><span className='font-bold text-foreground'>0-24 часа:</span> После легкой или умеренной тренировки.</li>
                    <li><span className='font-bold text-foreground'>24-36 часов:</span> После интенсивной тренировки.</li>
                    <li><span className='font-bold text-foreground'>36+ часов:</span> После очень тяжелой или продолжительной нагрузки.</li>
                </ul>
            </div>

        </CardContent>
      </Card>
    </div>
  );
}
