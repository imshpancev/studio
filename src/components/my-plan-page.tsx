
'use client';

import type { GenerateWorkoutPlanOutput } from '@/ai/flows/generate-workout-plan';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Bot, Pencil, CheckCircle } from 'lucide-react';
import { WorkoutPlanDisplay } from './workout-plan-display';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';


type MyPlanPageProps = {
    workoutPlan: GenerateWorkoutPlanOutput | null;
    onGeneratePlan: () => void;
    onEditPlan: () => void;
    onFinishPlan: () => void;
};

export function MyPlanPage({ workoutPlan, onGeneratePlan, onEditPlan, onFinishPlan }: MyPlanPageProps) {
    if (!workoutPlan) {
        return (
            <Card className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
                <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                        <Bot className="h-8 w-8 text-primary" />
                        У вас еще нет плана тренировок
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-muted-foreground max-w-md">
                        Давайте создадим ваш первый персонализированный план! Нажмите кнопку ниже, чтобы начать.
                    </p>
                    <Button onClick={onGeneratePlan} size="lg">
                        Создать мой первый план
                    </Button>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Ваш текущий план</h2>
                    <p className="text-muted-foreground">Вот ваш персональный план на эту неделю.</p>
                </div>
                <div className="flex gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="secondary">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Завершить неделю
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Завершить неделю?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Это действие завершит ваш текущий план тренировок. Вы сможете сгенерировать новый план на следующую неделю.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction onClick={onFinishPlan}>Завершить</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button onClick={onEditPlan} variant="outline">
                        <Pencil className="mr-2 h-4 w-4" />
                        Изменить план
                    </Button>
                </div>
            </div>
            <WorkoutPlanDisplay data={workoutPlan} />
        </div>
    );
}
