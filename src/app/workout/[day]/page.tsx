
'use client';

// This is a placeholder page for workout tracking.
// In a real application, this page would receive the workout details
// and guide the user through the session.

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Flag, Dumbbell } from "lucide-react";

type WorkoutPageProps = {
    params: {
        day: string;
    }
}

export default function WorkoutPage({ params }: WorkoutPageProps) {
  const day = decodeURIComponent(params.day);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <main className="container mx-auto px-4 py-8 md:py-12">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                       <Dumbbell className="h-8 w-8 text-primary" />
                        Тренировка: {day}
                    </CardTitle>
                    <CardDescription>
                        Режим отслеживания тренировки. Этот функционал находится в разработке.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-around text-center p-4 bg-muted rounded-lg">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Время</p>
                            <p className="text-3xl font-bold">00:00:00</p>
                        </div>
                         <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Пульс</p>
                            <p className="text-3xl font-bold">-- <span className="text-base">уд/мин</span></p>
                        </div>
                    </div>
                    <div className="text-center space-y-4">
                        <p className="text-muted-foreground">
                            Здесь будет отображаться список упражнений для выполнения, таймеры отдыха и другая информация.
                        </p>
                        <Flag className="h-12 w-12 mx-auto text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}
