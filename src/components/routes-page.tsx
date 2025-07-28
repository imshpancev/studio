
'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Pin, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";

// Mock data, in a real app this would come from an API or a global state manager like context/redux
const historyItems = [
    {
        id: 1, type: "Бег", title: "Вечерняя пробежка", date: "2024-07-28", duration: "45:12",
        coords: { lat: 51.505, lng: -0.09 },
        bbox: "bbox=-0.1,51.5,-0.09,51.51"
    },
    {
        id: 4, type: "Бег", title: "Интервальная тренировка", date: "2024-07-25", duration: "00:35:45",
        coords: { lat: 40.7128, lng: -74.0060 }, // New York
        bbox: "bbox=-74.01,40.71,-74.00,40.72"
    },
    {
        id: 5, type: "Велоспорт", title: "Длинная поездка", date: "2024-07-24", duration: "02:15:00",
        coords: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
        bbox: "bbox=-118.25,34.05,-118.23,34.06"
    },
];

export function RoutesPage() {
    const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState(0);

    const selectedWorkout = historyItems[selectedWorkoutIndex];

    const handlePrev = () => {
        setSelectedWorkoutIndex(prev => (prev === 0 ? historyItems.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedWorkoutIndex(prev => (prev === historyItems.length - 1 ? 0 : prev + 1));
    };
    
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?${selectedWorkout.bbox}&layer=mapnik&marker=${selectedWorkout.coords.lat},${selectedWorkout.coords.lng}`;

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
                        key={selectedWorkout.id} // Re-render iframe when workout changes
                        width="100%"
                        height="100%"
                        scrolling="no"
                        src={mapUrl}
                        style={{ border: 0 }}
                        title="Карта маршрута"
                        loading="lazy"
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
