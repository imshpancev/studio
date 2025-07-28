
'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Pin, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { historyItems } from "@/app/history/page";

const workoutsWithRoutes = historyItems.filter(item => item.coords);

export function RoutesPage() {
    const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState(0);

    if (workoutsWithRoutes.length === 0) {
        return (
             <Card className="h-full w-full flex flex-col items-center justify-center">
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
    
    // Constructing a simple polyline for the track
    const trackString = selectedWorkout.track?.map(p => `${p.lng},${p.lat}`).join(';') || '';
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${selectedWorkout.bbox}&layer=mapnik`;
    // Note: OpenStreetMap's embeddable iframe has limited support for complex features like drawing tracks directly.
    // For a real application, a library like Leaflet or Mapbox GL JS would be used to draw the GeoJSON track on the map.
    // This is a simplified representation. A single marker is placed as a fallback.
    const finalMapUrl = `${mapUrl}&marker=${selectedWorkout.coords.lat},${selectedWorkout.coords.lng}`;


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
                        src={finalMapUrl}
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
