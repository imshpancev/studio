
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Clock, Flame, HeartPulse, MapPin, Share2, TrendingUp, BarChart, Zap, Bike, Footprints } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Sport } from '@/lib/workout-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';

type WorkoutSummaryProps = {
  summary: {
    title: string;
    type: Sport;
    date: string;
    duration: string;
    calories: number;
    distance?: string;
    avgPace?: string;
    avgSpeed?: string;
    avgHeartRate?: number;
    peakHeartRate?: number;
    volume?: string;
  };
};

// Mock data, in a real app this would come from the user's profile
const userGear = {
    shoes: [
        { id: '1', name: 'Hoka Clifton 9' },
        { id: '2', name: 'Nike Vaporfly 3' },
    ],
    bikes: [
        { id: '1', name: 'Specialized Tarmac' },
        { id: '2', name: 'Canyon Aeroad' },
    ]
}


export function WorkoutSummary({ summary }: WorkoutSummaryProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleDone = () => {
    // In a real app, you would save the workout to your database here.
    toast({
        title: "Тренировка сохранена!",
        description: "Отличная работа! Ваши результаты добавлены в историю.",
    });
    router.push('/?tab=history'); // Redirect to history tab
  };

  const handleShare = () => {
      navigator.clipboard.writeText(`Я только что завершил тренировку "${summary.title}" с LighSport! Длительность: ${summary.duration}, Калории: ${summary.calories} ккал.`);
      toast({
          title: "Скопировано!",
          description: "Результаты тренировки скопированы в буфер обмена.",
      });
  }
  
  const renderGearSelector = () => {
      if (summary.type === Sport.Running) {
          return (
              <div className='space-y-2'>
                <Label htmlFor="shoes" className='flex items-center gap-2'><Footprints /> Кроссовки</Label>
                <Select>
                    <SelectTrigger id="shoes">
                        <SelectValue placeholder="Выберите кроссовки" />
                    </SelectTrigger>
                    <SelectContent>
                        {userGear.shoes.map(shoe => (
                             <SelectItem key={shoe.id} value={shoe.id}>{shoe.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
          )
      }
      if (summary.type === Sport.Cycling) {
           return (
              <div className='space-y-2'>
                <Label htmlFor="bike" className='flex items-center gap-2'><Bike /> Велосипед</Label>
                <Select>
                    <SelectTrigger id="bike">
                        <SelectValue placeholder="Выберите велосипед" />
                    </SelectTrigger>
                    <SelectContent>
                        {userGear.bikes.map(bike => (
                             <SelectItem key={bike.id} value={bike.id}>{bike.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
          )
      }
      return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <CardTitle className="mt-4 text-2xl">Отличная работа!</CardTitle>
          <CardDescription>Вы завершили тренировку: {summary.title}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <dl className="grid grid-cols-2 gap-4 text-center">
                <div className="rounded-lg bg-muted p-4">
                    <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Clock/>Время</dt>
                    <dd className="mt-1 text-2xl font-semibold">{summary.duration}</dd>
                </div>
                <div className="rounded-lg bg-muted p-4">
                    <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Flame/>Калории</dt>
                    <dd className="mt-1 text-2xl font-semibold">{summary.calories} ккал</dd>
                </div>
                {summary.avgHeartRate && (
                    <div className="rounded-lg bg-muted p-4">
                        <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><HeartPulse/>Сред. пульс</dt>
                        <dd className="mt-1 text-2xl font-semibold">{summary.avgHeartRate} уд/мин</dd>
                    </div>
                )}
                 {summary.peakHeartRate && (
                    <div className="rounded-lg bg-muted p-4">
                        <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Zap/>Пик. пульс</dt>
                        <dd className="mt-1 text-2xl font-semibold">{summary.peakHeartRate} уд/мин</dd>
                    </div>
                )}
                {summary.distance && (
                    <div className="rounded-lg bg-muted p-4">
                        <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><MapPin/>Дистанция</dt>
                        <dd className="mt-1 text-2xl font-semibold">{summary.distance}</dd>
                    </div>
                )}
                {summary.avgPace && (
                    <div className="rounded-lg bg-muted p-4">
                        <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><TrendingUp/>Сред. темп</dt>
                        <dd className="mt-1 text-2xl font-semibold">{summary.avgPace}</dd>
                    </div>
                )}
                 {summary.avgSpeed && (
                    <div className="rounded-lg bg-muted p-4">
                        <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Bike/>Сред. скорость</dt>
                        <dd className="mt-1 text-2xl font-semibold">{summary.avgSpeed}</dd>
                    </div>
                )}
                {summary.volume && (
                    <div className="rounded-lg bg-muted p-4 col-span-2">
                        <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><BarChart/>Объем</dt>
                        <dd className="mt-1 text-2xl font-semibold">{summary.volume}</dd>
                    </div>
                )}
            </dl>
            {renderGearSelector()}
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
