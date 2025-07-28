
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dumbbell, Flame, HeartPulse, Zap, Timer, Repeat, SkipForward, Flag, Play, Pause, Square } from "lucide-react";
import { useState, useEffect, useMemo } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from 'next/navigation';
import { type Exercise } from "@/lib/workout-data";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { WorkoutSummary } from "@/components/workout-summary";

type WorkoutPageProps = {
    params: {
        day: string;
    }
}

export default function WorkoutPage({ params }: WorkoutPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const day = decodeURIComponent(params.day);
  const exercises: Exercise[] = JSON.parse(searchParams.get('exercises') || '[]');
  const sport = searchParams.get('sport') || 'Тренировка';
  
  // Overall workout state
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [calories, setCalories] = useState(0);
  const [heartRate, setHeartRate] = useState(75); // Start with a resting-ish heart rate
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  // For gym workouts
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);

  // For running workouts
  const [pace, setPace] = useState({ current: 330, average: 330 }); // seconds per km
  const [laps, setLaps] = useState<number[]>([]);

  const currentExercise = exercises[currentExerciseIndex];

  // Main timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
        
        // Simulate calorie burn and heart rate changes
        setCalories(c => c + (sport === 'Бег' ? 0.15 : 0.08));
        setHeartRate(hr => {
            const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
            const baseHr = sport === 'Бег' ? 145 : 120;
            const targetHr = isResting ? hr - 5 : baseHr + Math.sin(time / 60) * 10;
            const newHr = Math.max(60, Math.min(180, targetHr + variation)); // Keep HR in a reasonable range
            return Math.round(newHr);
        });
        
        // Simulate pace changes for running
        if (sport === 'Бег' && time > 0 && time % 5 === 0) {
            setPace(p => {
                const paceVariation = Math.floor(Math.random() * 11) - 5; // -5 to +5 seconds
                const newCurrent = p.current + paceVariation;
                const newAverage = ((p.average * (time - 1)) + newCurrent) / time;
                return { current: Math.round(newCurrent), average: Math.round(newAverage) };
            });
        }

      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, sport, isResting]);


  // Rest timer effect
   useEffect(() => {
    let restInterval: NodeJS.Timeout | null = null;
    if (isResting && restTime > 0 && isActive) {
      restInterval = setInterval(() => {
        setRestTime(prev => prev - 1);
      }, 1000);
    } else if (isResting && restTime === 0) {
      setIsResting(false);
      // Optionally move to next exercise automatically
      handleNextExercise();
    }
    return () => {
      if (restInterval) clearInterval(restInterval);
    };
  }, [isResting, restTime, isActive]);


  const toggleTimer = () => setIsActive(!isActive);
  
  const finishWorkout = () => {
    setIsActive(false);
    setIsFinished(true);
  };

  const formatTime = (seconds: number) => {
    const s = Math.floor(seconds);
    const getSeconds = `0${(s % 60)}`.slice(-2);
    const minutes = `${Math.floor(s / 60)}`;
    const getMinutes = `0${parseInt(minutes, 10) % 60}`.slice(-2);
    const getHours = `0${Math.floor(s / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };
  
  const formatPace = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = `0${seconds % 60}`.slice(-2);
      return `${mins}'${secs}"`;
  }

  const handleNextExercise = () => {
      setIsResting(false);
      setRestTime(0);
      if (currentExerciseIndex < exercises.length - 1) {
          setCurrentExerciseIndex(i => i + 1);
      } else {
          // Last exercise finished
          finishWorkout();
      }
  }

  const handleFinishSet = () => {
      // Example rest time of 60 seconds
      setRestTime(60);
      setIsResting(true);
  }

  const handleAddLap = () => {
    setLaps(l => [...l, time]);
  }


  const heartRateZone = useMemo(() => {
    // Very simplified HR zones based on a max HR of 200
    if (heartRate < 100) return { name: "Очень легкая", color: "bg-gray-400", percentage: (heartRate/200)*100 };
    if (heartRate < 120) return { name: "Легкая", color: "bg-blue-400", percentage: (heartRate/200)*100 };
    if (heartRate < 140) return { name: "Аэробная", color: "bg-green-400", percentage: (heartRate/200)*100 };
    if (heartRate < 160) return { name: "Анаэробная", color: "bg-yellow-400", percentage: (heartRate/200)*100 };
    return { name: "Максимум", color: "bg-red-500", percentage: (heartRate/200)*100 };
  }, [heartRate]);

  if (isFinished) {
      const summary = {
          title: `Тренировка: ${day}`,
          sport: sport,
          duration: formatTime(time),
          calories: Math.round(calories),
          avgPace: sport === 'Бег' ? formatPace(pace.average) : undefined,
          distance: sport === 'Бег' ? (time / pace.average * 1000 / 1000).toFixed(2) + ' км' : undefined,
          avgHeartRate: Math.round(heartRate),
      };
      return <WorkoutSummary summary={summary} />;
  }


  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <main className="container mx-auto px-4 py-8 md:py-12">
            <Card className="max-w-2xl mx-auto shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold">
                       <Dumbbell className="h-8 w-8 text-primary" />
                        Тренировка: {day}
                    </CardTitle>
                    <CardDescription>
                        {sport} - Сосредоточьтесь и выложитесь на полную!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    
                    <div className="text-center font-mono text-6xl tracking-widest bg-muted p-4 rounded-lg">
                        {formatTime(time)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Flame /> Калории</p>
                            <p className="text-2xl font-bold">{Math.round(calories)}</p>
                        </div>
                         <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><HeartPulse /> Пульс</p>
                            <p className="text-2xl font-bold">{heartRate}</p>
                        </div>
                        {sport === 'Бег' ? (
                            <>
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">Текущий темп</p>
                                    <p className="text-2xl font-bold">{formatPace(pace.current)}</p>
                                </div>
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">Средний темп</p>
                                    <p className="text-2xl font-bold">{formatPace(pace.average)}</p>
                                </div>
                            </>
                        ) : (
                             <>
                                <div className="p-4 bg-muted rounded-lg col-span-2">
                                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Zap /> Пульсовая зона</p>
                                    <p className="text-xl font-bold">{heartRateZone.name}</p>
                                    <div className="w-full mt-1">
                                        <Progress value={heartRateZone.percentage} className={cn("h-2", heartRateZone.color)} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    
                    {/* Dynamic section based on sport */}
                    {sport !== 'Бег' && currentExercise && !isResting && (
                         <Card className="bg-muted">
                            <CardHeader>
                                <CardTitle className="text-xl">{currentExerciseIndex + 1} / {exercises.length}: {currentExercise.name}</CardTitle>
                                <CardDescription>{currentExercise.details}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm">{currentExercise.technique}</p>
                            </CardContent>
                         </Card>
                    )}

                    {isResting && (
                        <div className="text-center p-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">Время отдыха!</p>
                            <p className="font-mono text-5xl mt-2">{formatTime(restTime)}</p>
                            <Button onClick={() => handleNextExercise()} variant="ghost" size="sm" className="mt-4">
                                Пропустить отдых <SkipForward className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    )}


                    <div className="flex justify-center gap-4">
                        <Button onClick={toggleTimer} size="lg" className="w-28" variant="secondary">
                            {isActive ? <><Pause className="mr-2"/>Пауза</> : <><Play className="mr-2"/>Старт</>}
                        </Button>

                        {sport === 'Бег' ? (
                            <Button onClick={handleAddLap} variant="outline" size="lg">
                                <Flag className="mr-2 h-4 w-4" /> Круг
                            </Button>
                        ) : (
                           <Button onClick={isResting ? () => handleNextExercise() : handleFinishSet} variant="outline" size="lg" disabled={!isActive}>
                                {isResting ? <SkipForward className="mr-2 h-4 w-4" /> : <Repeat className="mr-2 h-4 w-4" />}
                                {isResting ? 'Пропустить' : 'Подход'}
                           </Button>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="lg">
                                <Square className="mr-2"/>Завершить
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы действительно хотите завершить тренировку? Это действие нельзя будет отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction onClick={finishWorkout}>Завершить</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                    </div>

                </CardContent>
            </Card>
        </main>
    </div>
  );
}
