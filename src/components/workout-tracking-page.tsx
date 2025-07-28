
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from './ui/button';
import { LocateFixed, MapPinned, Compass } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type WorkoutTrackingPageProps = {
    isMinimal?: boolean;
}

export function WorkoutTrackingPage({ isMinimal = false }: WorkoutTrackingPageProps) {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setError('Геолокация не поддерживается вашим браузером.');
            if (!isMinimal) toast({
                variant: 'destructive',
                title: 'Ошибка геолокации',
                description: 'Ваш браузер не поддерживает эту функцию.',
            });
            return;
        }
        
        if (!isMinimal) toast({
            title: 'Запрос местоположения...',
            description: 'Пожалуйста, разрешите доступ к вашему местоположению.',
        });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setError(null);
                 if (!isMinimal) toast({
                    title: 'Местоположение определено!',
                    description: 'Карта теперь отцентрирована по вашему местоположению.',
                });
            },
            (err) => {
                let errorMessage = `Ошибка при получении местоположения: ${err.message}`;
                if (err.code === err.PERMISSION_DENIED) {
                    errorMessage = 'Доступ к геолокации запрещен. Пожалуйста, проверьте разрешения в настройках браузера.';
                }
                setError(errorMessage);
                 if (!isMinimal) toast({
                    variant: 'destructive',
                    title: 'Ошибка геолокации',
                    description: 'Не удалось получить доступ к вашему местоположению.',
                });
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };
    
    // Request location on component mount if not already set
    useEffect(() => {
        if (!location) {
             handleGetLocation();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const mapUrl = location 
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${location.lng-0.01},${location.lat-0.01},${location.lng+0.01},${location.lat+0.01}&layer=mapnik&marker=${location.lat},${location.lng}`
        : `https://www.openstreetmap.org/export/embed.html?bbox=-0.1,51.5,-0.09,51.51&layer=mapnik`; // Default to London

    if (isMinimal) {
        return (
             <div className="aspect-video w-full rounded-lg overflow-hidden border">
                <iframe
                    width="100%"
                    height="100%"
                    scrolling="no"
                    src={mapUrl}
                    style={{ border: 0 }}
                    title="Карта активности"
                    loading="lazy"
                ></iframe>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <MapPinned className="h-6 w-6" />
                    Трекинг Активности
                </CardTitle>
                <CardDescription>
                    Отслеживайте свои пробежки и другие тренировки на свежем воздухе. Карта будет отцентрирована после получения доступа к геолокации.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && (
                     <Alert variant="destructive">
                      <Compass className='h-4 w-4' />
                      <AlertTitle>Ошибка геолокации</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="aspect-video w-full rounded-lg overflow-hidden border">
                    <iframe
                        width="100%"
                        height="100%"
                        scrolling="no"
                        src={mapUrl}
                        style={{ border: 0 }}
                        title="Карта активности"
                        loading="lazy"
                    ></iframe>
                </div>
                 <Button onClick={handleGetLocation} variant="outline" className='w-full'>
                    <LocateFixed className='mr-2' />
                    { location ? 'Обновить мое местоположение' : 'Найти меня'}
                </Button>
            </CardContent>
        </Card>
    );
}
