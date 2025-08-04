
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Clock, Flame, HeartPulse, MapPin, Share2, TrendingUp, BarChart, Zap, Bike, Footprints, Loader2, Bot, MessageSquare, Star, SlidersHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Sport } from '@/lib/workout-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { auth } from '@/lib/firebase';
import { useState } from 'react';
import { processWorkoutSummaryAction } from '@/app/actions';
import type { ProcessWorkoutSummaryInput, ProcessWorkoutSummaryOutput } from '@/ai/flows/process-workout-summary';
import { Textarea } from './ui/textarea';
import { Slider } from './ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { FeedbackAnalysisDisplay } from './feedback-analysis-display';

type WorkoutSummaryData = Omit<ProcessWorkoutSummaryInput['workout'], 'date'>;

type WorkoutSummaryProps = {
  summary: WorkoutSummaryData;
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
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackDifficulty, setFeedbackDifficulty] = useState(5);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [analysisResult, setAnalysisResult] = useState<ProcessWorkoutSummaryOutput | null>(null);

  const user = auth.currentUser;

  const handleDone = async () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Ошибка",
            description: "Вы должны быть авторизованы, чтобы сохранить тренировку.",
        });
        return;
    }
    setIsLoading(true);

    try {
        const workoutData: ProcessWorkoutSummaryInput['workout'] = {
            title: summary.title,
            type: summary.type,
            date: new Date().toISOString(),
            duration: summary.duration,
            calories: summary.calories,
            distance: summary.distance ?? null,
            avgPace: summary.avgPace ?? null,
            avgSpeed: summary.avgSpeed ?? null,
            avgHeartRate: summary.avgHeartRate ?? null,
            peakHeartRate: summary.peakHeartRate ?? null,
            volume: summary.volume ?? null,
            track: summary.track ?? null,
            splits: summary.splits ?? null,
            elevationGain: summary.elevationGain ?? null,
            avgCadence: summary.avgCadence ?? null,
            avgPower: summary.avgPower ?? null,
        };

        const input: ProcessWorkoutSummaryInput = {
            userId: user.uid, // Pass the user ID explicitly
            workout: workoutData,
            feedback: {
                difficulty: feedbackDifficulty,
                notes: feedbackNotes,
            }
        };

        const result = await processWorkoutSummaryAction(input);
        setAnalysisResult(result);

        toast({
            title: "Тренировка сохранена и проанализирована!",
            description: "Отличная работа! Посмотрите рекомендации от ИИ.",
        });
        // Instead of redirecting immediately, we'll let the user see the analysis in a dialog.
        // router.push('/?tab=history'); 

    } catch (error) {
        console.error("Failed to save workout:", error);
        toast({
            variant: "destructive",
            title: "Ошибка сохранения",
            description: error instanceof Error ? error.message : "Не удалось сохранить тренировку. Пожалуйста, попробуйте еще раз.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleCloseDialogAndRedirect = () => {
    setAnalysisResult(null);
    router.push('/?tab=history');
  }

  const handleShare = () => {
      navigator.clipboard.writeText(`Я только что завершил тренировку "${summary.title}" с OptimumPulse! Длительность: ${summary.duration}, Калории: ${summary.calories} ккал.`);
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
    <Dialog open={!!analysisResult} onOpenChange={(open) => !open && handleCloseDialogAndRedirect()}>
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

                <div className="space-y-4 pt-4 border-t">
                    <Label htmlFor="feedback" className="flex items-center gap-2 font-semibold">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        Как прошла тренировка?
                    </Label>
                    <div className="space-y-2">
                        <Label htmlFor="difficulty">Ощущаемая сложность: <span className="font-bold">{feedbackDifficulty}/10</span></Label>
                         <Slider
                            id="difficulty"
                            min={1}
                            max={10}
                            step={1}
                            value={[feedbackDifficulty]}
                            onValueChange={(value) => setFeedbackDifficulty(value[0])}
                            />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="notes">Заметки (необязательно)</Label>
                        <Textarea 
                            id="notes" 
                            placeholder="Например: чувствовалась усталость в ногах, было легко держать темп и т.д."
                            value={feedbackNotes}
                            onChange={(e) => setFeedbackNotes(e.target.value)}
                        />
                    </div>
                </div>

            </CardContent>
            <CardFooter className="flex justify-between gap-4 pt-6">
            <Button variant="outline" onClick={handleShare} className='w-full'>
                <Share2 className="mr-2" /> Поделиться
            </Button>
            <Button onClick={handleDone} className='w-full' disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" /> }
                Завершить и проанализировать
            </Button>
            </CardFooter>
        </Card>
        </div>
        
        <DialogContent className="max-w-2xl">
            <DialogHeader>
            <DialogTitle className='flex items-center gap-2'><SlidersHorizontal />Анализ и рекомендации ИИ</DialogTitle>
            <DialogDescription>
                На основе вашего отзыва ИИ-тренер подготовил следующие рекомендации и скорректировал ваш план.
            </DialogDescription>
            </DialogHeader>
            {analysisResult ? (
                <FeedbackAnalysisDisplay data={analysisResult} />
            ) : (
                <div className="flex items-center justify-center h-48">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            )}
            <Button onClick={handleCloseDialogAndRedirect} className="mt-4">Перейти к истории</Button>
      </DialogContent>
    </Dialog>
  );
}
