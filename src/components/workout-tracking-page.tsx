
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from './ui/button';
import { LocateFixed, MapPinned } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export function WorkoutTrackingPage() {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        // Automatically request location on component mount
        handleGetLocation();
    }, []);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setError('Геолокация не поддерживается вашим браузером.');
            toast({
                variant: 'destructive',
                title: 'Ошибка геолокации',
                description: 'Ваш браузер не поддерживает эту функцию.',
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                setError(null);
                 toast({
                    title: 'Местоположение определено!',
                    description: 'Карта теперь отцентрирована по вашему местоположению.',
                });
            },
            (err) => {
                setError(`Ошибка при получении местоположения: ${err.message}`);
                 toast({
                    variant: 'destructive',
                    title: 'Ошибка геолокации',
                    description: 'Не удалось получить доступ к вашему местоположению. Проверьте разрешения в браузере.',
                });
            }
        );
    };

    const mapUrl = location 
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${location.lng-0.01},${location.lat-0.01},${location.lng+0.01},${location.lat+0.01}&layer=mapnik&marker=${location.lat},${location.lng}`
        : `https://www.openstreetmap.org/export/embed.html?bbox=-122.44,37.75,-122.4,37.78&layer=mapnik`;


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
                      <AlertTitle>Ошибка</AlertTitle>
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
                    ></iframe>
                </div>
                 <Button onClick={handleGetLocation} variant="outline" className='w-full'>
                    <LocateFixed className='mr-2' />
                    Обновить мое местоположение
                </Button>
            </CardContent>
        </Card>
    );
}

