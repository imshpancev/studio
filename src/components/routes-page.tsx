
'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { getMapEmbedUrl } from "@/lib/map-utils";
import { Workout } from "@/services/workoutService";


interface RoutesPageProps {
    workouts: Workout[];
}

export function RoutesPage({ workouts }: RoutesPageProps) {
    const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState(0);

    const workoutsWithRoutes = workouts.filter(item => item.track && item.track.length > 0);

    if (workoutsWithRoutes.length === 0) {
        return (
             <Card className="h-full w-full flex flex-col items-center justify-center min-h-[400px]">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center gap-2">
                        <Map className="h-6 w-6" />
                        Мои Маршруты
                    </CardTitle>
                    <CardDescription>
                        У вас еще нет тренировок с записанными маршрутами.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Завершите тренировку на открытом воздухе, и она появится здесь.</p>
                </CardContent>
            </Card>
        )
    }

    const selectedWorkout = workoutsWithRoutes[selectedWorkoutIndex];

    const handlePrev = () => {
        setSelectedWorkoutIndex(prev => (prev === 0 ? workoutsWithRoutes.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedWorkoutIndex(prev => (prev === workoutsWithRoutes.length - 1 ? 0 : prev + 1));
    };
    
    const mapUrl = selectedWorkout.track ? getMapEmbedUrl(selectedWorkout.track) : '';


    return (
        <Card className="h-full w-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Map className="h-6 w-6" />
                    Мои Маршруты
                </CardTitle>
                <CardDescription>
                    Просматривайте треки ваших тренировок на карте. Используйте стрелки для навигации.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                 <div className="aspect-video w-full rounded-lg overflow-hidden border">
                    <iframe
                        key={selectedWorkout.id}
                        src={mapUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Карта маршрута для ${selectedWorkout.title}`}
                    ></iframe>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                    <Button onClick={handlePrev} variant="outline" size="icon">
                        <ChevronLeft />
                    </Button>
                    <div className="text-center">
                        <h3 className="font-semibold text-lg">{selectedWorkout.title}</h3>
                        <div className="text-sm text-muted-foreground flex items-center gap-4 justify-center mt-1">
                            <span className="flex items-center gap-1"><Calendar className="h-4 w-4"/> {new Date(selectedWorkout.date).toLocaleDateString('ru-RU')}</span>
                            <span className="flex items-center gap-1"><Clock className="h-4 w-4"/> {selectedWorkout.duration}</span>
                        </div>
                    </div>
                    <Button onClick={handleNext} variant="outline" size="icon">
                        <ChevronRight />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
