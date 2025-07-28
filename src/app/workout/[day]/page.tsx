
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dumbbell, Flame, HeartPulse, Zap, Timer, Repeat, SkipForward, Flag, Play, Pause, Square, PlayCircle, MapPin, TrendingUp, Bike } from "lucide-react";
import { useState, useEffect, useMemo } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from 'next/navigation';
import { type Exercise, Sport } from "@/lib/workout-data";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { WorkoutSummary } from "@/components/workout-summary";
import { useSearchParams } from 'next/navigation';
import { showWarmupNotification } from "@/lib/notifications";
import { WorkoutTrackingPage } from "@/components/workout-tracking-page";


export default function WorkoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  
  const day = useMemo(() => decodeURIComponent(Array.isArray(params.day) ? params.day[0] : params.day), [params.day]);
  const exercises: Exercise[] = useMemo(() => JSON.parse(searchParams.get('exercises') || '[]'), [searchParams]);
  const sport = useMemo(() => (searchParams.get('sport') as Sport) || 'Тренировка', [searchParams]);
  
  const isCardio = useMemo(() => [Sport.Running, Sport.Swimming, Sport.Cycling, Sport.Triathlon].includes(sport), [sport]);

  // Overall workout state
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false); // Start paused
  const [calories, setCalories] = useState(0);
  const [heartRate, setHeartRate] = useState(75); // Start with a resting-ish heart rate
  const [peakHeartRate, setPeakHeartRate] = useState(75);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  // For gym workouts
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [setsCompleted, setSetsCompleted] = useState(0);

  // For running/cycling workouts
  const [pace, setPace] = useState({ current: sport === Sport.Running ? 360 : 25, average: sport === Sport.Running ? 360 : 25 }); // sec/km for run, km/h for bike
  const [laps, setLaps] = useState<number[]>([]);
  const [distance, setDistance] = useState(0); // in meters

  const currentExercise = exercises[currentExerciseIndex];

  useEffect(() => {
    // Show a warmup notification when the page loads
    showWarmupNotification();
  }, []);

  // Main timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && !isFinished) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
        
        // Simulate calorie burn and heart rate changes
        const intensityFactor = isResting ? 0.5 : 1;
        let calorieRate = 0.08;
        if (sport === Sport.Running) calorieRate = 0.15;
        if (sport === Sport.Cycling) calorieRate = 0.12;

        setCalories(c => c + calorieRate * intensityFactor);

        setHeartRate(hr => {
            const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
            let baseHr = 120;
            if (sport === Sport.Running) baseHr = 145;
            if (sport === Sport.Cycling) baseHr = 135;

            const targetHr = isResting ? Math.max(100, hr - 2) : baseHr + Math.sin(time / 60) * 15;
            const newHr = Math.max(60, Math.min(190, targetHr + variation)); // Keep HR in a reasonable range
            setPeakHeartRate(p_hr => Math.max(p_hr, newHr));
            return Math.round(newHr);
        });
        
        // Simulate pace and distance changes for cardio sports
        if (isCardio && time > 0) {
            if(sport === Sport.Running) {
                const paceVariation = Math.floor(Math.random() * 11) - 5; // -5 to +5 seconds
                const newCurrentPace = Math.max(240, pace.current + paceVariation); // Max pace of 4:00/km for simulation
                const metersPerSecond = 1000 / newCurrentPace;
                setDistance(d => d + metersPerSecond);
                setPace(p => {
                    const newAverage = (p.average * (time - 1) + newCurrentPace) / time;
                    return { current: Math.round(newCurrentPace), average: Math.round(newAverage) };
                });
            } else if (sport === Sport.Cycling) {
                 const speedVariation = (Math.random() * 2) - 1; // -1 to +1 km/h
                 const newCurrentSpeed = Math.max(15, pace.current + speedVariation);
                 const metersPerSecond = newCurrentSpeed * 1000 / 3600;
                 setDistance(d => d + metersPerSecond);
                 setPace(p => {
                    const newAverage = (p.average * (time - 1) + newCurrentSpeed) / time;
                    return { current: newCurrentSpeed, average: newAverage };
                 })
            }
        }

      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, sport, isResting, isFinished, isCardio, pace.current]);


  // Rest timer effect
   useEffect(() => {
    let restInterval: NodeJS.Timeout | null = null;
    if (isResting && restTime > 0 && isActive) {
      restInterval = setInterval(() => {
        setRestTime(prev => prev - 1);
      }, 1000);
    } else if (isResting && restTime <= 0) {
      setIsResting(false);
      // Don't auto-skip, let the user decide
      // handleNextExercise();
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
      const secs = `0${Math.round(seconds % 60)}`.slice(-2);
      return `${mins}'${secs}"`;
  }
  
  const formatSpeed = (kph: number) => `${kph.toFixed(1)} км/ч`;

  const handleNextExercise = () => {
      setIsResting(false);
      setRestTime(0);
      setSetsCompleted(0);
      if (currentExerciseIndex < exercises.length - 1) {
          setCurrentExerciseIndex(i => i + 1);
      } else {
          // Last exercise finished
          finishWorkout();
      }
  }

  const handleFinishSet = () => {
      // Logic to add volume (example: 10 reps * 50kg)
      // This is a simplification. A real app would have inputs for weight/reps.
      const weight = 50;
      const reps = 12;
      setTotalVolume(v => v + (weight * reps));
      setSetsCompleted(s => s + 1);

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
          title: day,
          date: new Date().toISOString(),
          type: sport,
          duration: formatTime(time),
          calories: Math.round(calories),
          avgPace: sport === Sport.Running ? formatPace(pace.average) : undefined,
          avgSpeed: sport === Sport.Cycling ? formatSpeed(pace.average) : undefined,
          distance: isCardio ? (distance / 1000).toFixed(2) + ' км' : undefined,
          avgHeartRate: Math.round(time > 0 ? (heartRate / time) * time: heartRate), // simplified avg
          peakHeartRate: Math.round(peakHeartRate),
          volume: !isCardio ? `${totalVolume} кг` : undefined,
      };
      return <WorkoutSummary summary={summary} />;
  }

 const getIconForSport = () => {
      switch (sport) {
          case Sport.Running: return <MapPin className="h-8 w-8 text-primary" />;
          case Sport.Cycling: return <Bike className="h-8 w-8 text-primary" />;
          case Sport.Gym: return <Dumbbell className="h-8 w-8 text-primary" />;
          case Sport.Home: return <Dumbbell className="h-8 w-8 text-primary" />;
          case Sport.Swimming: return <Dumbbell className="h-8 w-8 text-primary" />;
          case Sport.Yoga: return <Dumbbell className="h-8 w-8 text-primary" />;
          case Sport.Triathlon: return <Dumbbell className="h-8 w-8 text-primary" />;
          default: return <Dumbbell className="h-8 w-8 text-primary" />;
      }
 }
  
  const renderGymWorkout = () => (
    <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg col-span-2">
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Zap /> Пульсовая зона</p>
                <p className="text-xl font-bold">{heartRateZone.name}</p>
                <div className="w-full mt-1">
                    <Progress value={heartRateZone.percentage} indicatorClassName={cn(heartRateZone.color)} />
                </div>
            </div>
        </div>

        {currentExercise && !isResting && (
                <Card className="bg-muted overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl">{currentExerciseIndex + 1} / {exercises.length}: {currentExercise.name}</CardTitle>
                        <CardDescription>{currentExercise.details} (Выполнено подходов: {setsCompleted})</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="relative group w-full aspect-video flex-shrink-0">
                            <video 
                            key={currentExercise.name}
                            className="rounded-lg object-cover w-full h-full"
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                            // In a real app, you would have a URL for each exercise video
                            src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
                        >
                        </video>
                    </div>
                    <div className="text-sm space-y-2">
                        <h4 className="font-semibold">Техника выполнения:</h4>
                        <p className="max-h-[150px] overflow-y-auto">{currentExercise.technique}</p>
                    </div>
                    </CardContent>
                </Card>
        )}

        {isResting && (
            <div className="text-center p-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg animate-pulse">
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">Время отдыха!</p>
                <p className="font-mono text-5xl mt-2">{formatTime(restTime)}</p>
                <p className="text-sm text-muted-foreground mt-2">Следующее упражнение: {currentExerciseIndex + 1 < exercises.length ? exercises[currentExerciseIndex+1].name : 'Завершение'}</p>
                <Button onClick={() => setRestTime(0)} variant="ghost" size="sm" className="mt-4">
                    Пропустить отдых <SkipForward className="ml-2 h-4 w-4" />
                </Button>
            </div>
        )}
    </>
  );

  const renderCardioWorkout = () => (
    <>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {sport === Sport.Running && (
                <>
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><TrendingUp/>Текущий темп</p>
                        <p className="text-2xl font-bold">{formatPace(pace.current)}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><MapPin/>Дистанция</p>
                        <p className="text-2xl font-bold">{(distance / 1000).toFixed(2)} км</p>
                    </div>
                </>
            )}
            {sport === Sport.Cycling && (
                    <>
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><TrendingUp/>Скорость</p>
                        <p className="text-2xl font-bold">{formatSpeed(pace.current)}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><MapPin/>Дистанция</p>
                        <p className="text-2xl font-bold">{(distance / 1000).toFixed(2)} км</p>
                    </div>
                </>
            )}
        </div>
        <WorkoutTrackingPage isMinimal={true} />
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <main className="container mx-auto px-4 py-8 md:py-12">
            <Card className="max-w-2xl mx-auto shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold">
                       {getIconForSport()}
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

                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Flame /> Калории</p>
                            <p className="text-2xl font-bold">{Math.round(calories)}</p>
                        </div>
                         <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><HeartPulse /> Пульс</p>
                            <p className="text-2xl font-bold">{heartRate}</p>
                        </div>
                    </div>
                    
                    {isCardio ? renderCardioWorkout() : renderGymWorkout() }

                    <div className="flex justify-center gap-4">
                        <Button onClick={toggleTimer} size="lg" className="w-32">
                            {isActive ? <><Pause className="mr-2"/>Пауза</> : <><Play className="mr-2"/>{time > 0 ? 'Продолжить' : 'Старт'}</>}
                        </Button>

                        {isCardio ? (
                            <Button onClick={handleAddLap} variant="outline" size="lg" disabled={!isActive}>
                                <Flag className="mr-2 h-4 w-4" /> Круг
                            </Button>
                        ) : (
                           <Button onClick={isResting ? () => handleNextExercise() : handleFinishSet} variant="outline" size="lg" disabled={!isActive} className="w-32">
                                {isResting ? <><SkipForward className="mr-2 h-4 w-4" /> Далее</> : <><Repeat className="mr-2 h-4 w-4" /> Подход</>}
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
