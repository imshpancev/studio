
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dumbbell, Flame, HeartPulse, Zap } from "lucide-react";
import { useState, useEffect, useMemo } from 'react';
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

type WorkoutPageProps = {
    params: {
        day: string;
    }
}

export default function WorkoutPage({ params }: WorkoutPageProps) {
  const day = decodeURIComponent(params.day);

  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [calories, setCalories] = useState(0);
  const [heartRate, setHeartRate] = useState(75); // Start with a resting-ish heart rate

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
        // Simulate calorie burn and heart rate changes
        if (time % 10 === 0) {
            setCalories(c => c + 5);
        }
        setHeartRate(hr => {
            const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
            const newHr = hr + variation;
            return Math.min(Math.max(newHr, 60), 180); // Keep HR in a reasonable range
        });
      }, 1000);
    } else if (!isActive && time !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setTime(0); setCalories(0); setIsActive(false); };

  const formatTime = (seconds: number) => {
    const getSeconds = `0${(seconds % 60)}`.slice(-2);
    const minutes = `${Math.floor(seconds / 60)}`;
    const getMinutes = `0${parseInt(minutes, 10) % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };

  const heartRateZone = useMemo(() => {
    // Very simplified HR zones based on a max HR of 200
    if (heartRate < 100) return { name: "Очень легкая", color: "bg-gray-400", percentage: (heartRate/200)*100 };
    if (heartRate < 120) return { name: "Легкая", color: "bg-blue-400", percentage: (heartRate/200)*100 };
    if (heartRate < 140) return { name: "Аэробная", color: "bg-green-400", percentage: (heartRate/200)*100 };
    if (heartRate < 160) return { name: "Анаэробная", color: "bg-yellow-400", percentage: (heartRate/200)*100 };
    return { name: "Максимум", color: "bg-red-500", percentage: (heartRate/200)*100 };
  }, [heartRate]);

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
                        Сосредоточьтесь и выложитесь на полную!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                    
                    <div className="text-center font-mono text-6xl tracking-widest bg-muted p-4 rounded-lg">
                        {formatTime(time)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Flame /> Калории</p>
                            <p className="text-3xl font-bold">{calories}</p>
                            <p className="text-xs text-muted-foreground">ккал</p>
                        </div>
                         <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><HeartPulse /> Пульс</p>
                            <p className="text-3xl font-bold">{heartRate}</p>
                             <p className="text-xs text-muted-foreground">уд/мин</p>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1"><Zap /> Пульсовая зона</p>
                            <p className="text-xl font-bold">{heartRateZone.name}</p>
                             <div className="w-full mt-2">
                                <Progress value={heartRateZone.percentage} className="h-2 [&>div]:bg-none" style={{'--progress-color': heartRateZone.color} as React.CSSProperties} />
                             </div>
                        </div>
                    </div>
                    
                    <div className="text-center space-y-4 pt-4">
                        <p className="text-muted-foreground">
                            Здесь будет отображаться текущее упражнение и таймер отдыха.
                        </p>
                    </div>

                    <div className="flex justify-center gap-4">
                        <Button onClick={toggleTimer} size="lg" className="w-40">
                            {isActive ? 'Пауза' : 'Продолжить'}
                        </Button>
                        <Button onClick={resetTimer} variant="destructive" size="lg">
                            Завершить
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </main>
    </div>
  );
}

// A simple trick to make custom color work with tailwind's progress bar
const CustomProgress = ({ className, value, ...props }: React.ComponentProps<typeof Progress> & { style: React.CSSProperties }) => {
  return (
    <Progress
      className={cn("bg-secondary", className)}
      {...props}
      value={value}
      // @ts-ignore
      indicatorClassName={props.style['--progress-color']}
    />
  );
};
