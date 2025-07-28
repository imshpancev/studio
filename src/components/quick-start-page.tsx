

'use client';

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { allSports, Sport, workoutDatabase } from "@/lib/workout-data";
import { Dumbbell, Map, Waves, Zap, Bike, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "./ui/dialog";
import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { RunIcon } from "./icons/run-icon";

const sportIcons: Record<Sport, React.ReactNode> = {
    [Sport.Running]: <RunIcon className="h-10 w-10 text-primary" />,
    [Sport.Gym]: <Dumbbell className="h-10 w-10 text-destructive" />,
    [Sport.Swimming]: <Waves className="h-10 w-10 text-blue-500" />,
    [Sport.Yoga]: <Zap className="h-10 w-10 text-accent" />,
    [Sport.Cycling]: <Bike className="h-10 w-10 text-green-500" />,
    [Sport.Home]: <Dumbbell className="h-10 w-10 text-purple-500" />,
    [Sport.Triathlon]: <div className="flex gap-1"><RunIcon className="h-6 w-6" /><Bike className="h-6 w-6" /><Waves className="h-6 w-6" /></div>
};

// Muscle groups in Russian
const muscleGroups = [
    { id: 'chest', label: 'Грудь' },
    { id: 'back', label: 'Спина' },
    { id: 'legs', label: 'Ноги' },
    { id: 'shoulders', label: 'Плечи' },
    { id: 'biceps', label: 'Бицепс' },
    { id: 'triceps', label: 'Трицепс' },
    { id: 'core', label: 'Кор' },
];

export function QuickStartPage() {
    const router = useRouter();
    const [isGymDialogOpen, setIsGymDialogOpen] = useState(false);
    const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);

    const handleStartWorkout = (sport: Sport) => {
        if (sport === Sport.Gym) {
            setIsGymDialogOpen(true);
            return;
        }

        // For other sports, start immediately
        const workout = workoutDatabase[sport]?.workouts[0] || { exercises: [] };
        const exercisesQuery = encodeURIComponent(JSON.stringify(workout.exercises));
        const title = `Быстрая тренировка: ${sport}`;
        
        router.push(`/workout/${encodeURIComponent(title)}?sport=${encodeURIComponent(sport)}&exercises=${exercisesQuery}`);
    };

    const handleGymWorkoutStart = () => {
        const selectedExercises = workoutDatabase[Sport.Gym].workouts
            .flatMap(w => w.exercises)
            .filter(ex => selectedMuscleGroups.some(mg => ex.muscleGroups.includes(mg)));

        const exercisesQuery = encodeURIComponent(JSON.stringify(selectedExercises));
        const title = `Быстрая тренировка: ${Sport.Gym}`;
        
        router.push(`/workout/${encodeURIComponent(title)}?sport=${encodeURIComponent(Sport.Gym)}&exercises=${exercisesQuery}`);
        setIsGymDialogOpen(false);
    }
    
    const handleMuscleGroupToggle = (muscleGroupId: string) => {
        setSelectedMuscleGroups(prev => 
            prev.includes(muscleGroupId) 
                ? prev.filter(id => id !== muscleGroupId) 
                : [...prev, muscleGroupId]
        );
    }

    return (
        <>
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

             <Dialog open={isGymDialogOpen} onOpenChange={setIsGymDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Настройка тренировки в зале</DialogTitle>
                        <DialogDescription>
                            Выберите группы мышц, которые вы хотите проработать сегодня.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="grid grid-cols-2 gap-4">
                            {muscleGroups.map((group) => (
                                <div key={group.id} className="flex items-center space-x-2">
                                     <Checkbox
                                        id={group.id}
                                        checked={selectedMuscleGroups.includes(group.id)}
                                        onCheckedChange={() => handleMuscleGroupToggle(group.id)}
                                    />
                                    <Label htmlFor={group.id} className="cursor-pointer">
                                        {group.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleGymWorkoutStart} disabled={selectedMuscleGroups.length === 0}>Начать тренировку</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
