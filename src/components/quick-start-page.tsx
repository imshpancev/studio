
'use client';

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { allSports, Sport, workoutDatabase } from "@/lib/workout-data";
import { Dumbbell, Map, Waves, Zap, Bike } from "lucide-react";

const sportIcons: Record<Sport, React.ReactNode> = {
    [Sport.Running]: <Map className="h-10 w-10 text-primary" />,
    [Sport.Gym]: <Dumbbell className="h-10 w-10 text-destructive" />,
    [Sport.Swimming]: <Waves className="h-10 w-10 text-blue-500" />,
    [Sport.Yoga]: <Zap className="h-10 w-10 text-accent" />,
    [Sport.Cycling]: <Bike className="h-10 w-10 text-green-500" />,
    [Sport.Home]: <Dumbbell className="h-10 w-10 text-purple-500" />,
    [Sport.Triathlon]: <div className="flex gap-1"><Map/><Bike/><Waves/></div>
};


export function QuickStartPage() {
    const router = useRouter();

    const handleStartWorkout = (sport: Sport) => {
        // For quick start, we can use a generic title and the first available workout's exercises
        const workout = workoutDatabase[sport]?.workouts[0] || { exercises: [] };
        const exercisesQuery = encodeURIComponent(JSON.stringify(workout.exercises));
        const title = `Быстрая тренировка: ${sport}`;
        
        router.push(`/workout/${encodeURIComponent(title)}?sport=${encodeURIComponent(sport)}&exercises=${exercisesQuery}`);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Быстрый старт</CardTitle>
                <CardDescription>
                    Нет времени на планирование? Выберите вид активности и начните тренировку прямо сейчас.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allSports.map((sport) => (
                         <Card 
                            key={sport}
                            className="flex flex-col items-center justify-center p-6 text-center hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handleStartWorkout(sport)}
                        >
                            {sportIcons[sport] || <Dumbbell className="h-10 w-10" />}
                            <h3 className="mt-4 font-semibold text-lg">{sport}</h3>
                            <Button variant="ghost" className="mt-2">Начать</Button>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

