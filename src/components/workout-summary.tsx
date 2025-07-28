
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Clock, Flame, HeartPulse, MapPin, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type WorkoutSummaryProps = {
  summary: {
    title: string;
    sport: string;
    duration: string;
    calories: number;
    distance?: string;
    avgPace?: string;
    avgHeartRate?: number;
  };
};

export function WorkoutSummary({ summary }: WorkoutSummaryProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleDone = () => {
    // In a real app, you would save the workout to your database here.
    toast({
        title: "Тренировка сохранена!",
        description: "Отличная работа! Ваши результаты добавлены в историю.",
    });
    router.push('/');
  };

  const handleShare = () => {
      navigator.clipboard.writeText(`Я только что завершил тренировку "${summary.title}" с LighSport! Длительность: ${summary.duration}, Калории: ${summary.calories} ккал.`);
      toast({
          title: "Скопировано!",
          description: "Результаты тренировки скопированы в буфер обмена.",
      });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <CardTitle className="mt-4 text-2xl">Отличная работа!</CardTitle>
          <CardDescription>Вы завершили тренировку: {summary.title}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-lg bg-muted p-4">
                <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Clock/>Время</dt>
                <dd className="mt-1 text-2xl font-semibold">{summary.duration}</dd>
            </div>
             <div className="rounded-lg bg-muted p-4">
                <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Flame/>Калории</dt>
                <dd className="mt-1 text-2xl font-semibold">{summary.calories} ккал</dd>
            </div>
            {summary.distance && (
                 <div className="rounded-lg bg-muted p-4">
                    <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><MapPin/>Дистанция</dt>
                    <dd className="mt-1 text-2xl font-semibold">{summary.distance}</dd>
                </div>
            )}
            {summary.avgPace && (
                 <div className="rounded-lg bg-muted p-4">
                    <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Clock/>Сред. темп</dt>
                    <dd className="mt-1 text-2xl font-semibold">{summary.avgPace}</dd>
                </div>
            )}
            {summary.avgHeartRate && (
                 <div className="rounded-lg bg-muted p-4 col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><HeartPulse/>Сред. пульс</dt>
                    <dd className="mt-1 text-2xl font-semibold">{summary.avgHeartRate} уд/мин</dd>
                </div>
            )}
        </CardContent>
        <CardFooter className="flex justify-between gap-4 pt-6">
          <Button variant="outline" onClick={handleShare} className='w-full'>
            <Share2 className="mr-2" /> Поделиться
          </Button>
          <Button onClick={handleDone} className='w-full'>
            Готово
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
