
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Dumbbell, Flame, Map, Zap, Calendar, Share2, Trash2 } from 'lucide-react';

export default function HistoryDetailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dataString = searchParams.get('data');
    
    if (!dataString) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Не удалось загрузить данные о тренировке.</p>
            </div>
        );
    }
    
    const item = JSON.parse(dataString);
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=-0.1,51.5,-0.09,51.51&layer=mapnik&marker=51.505,-0.095`;

    return (
        <div className="min-h-screen bg-muted/40 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                 <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Назад к истории
                </Button>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                             <div>
                                <CardTitle className="text-2xl md:text-3xl">{item.title}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-2">
                                     <Calendar className="h-4 w-4" />
                                     {new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </CardDescription>
                             </div>
                             <div className="p-3 rounded-full bg-muted hidden sm:block">
                                 {/* This is a hack because we can't pass JSX elements as query params */}
                                 {item.type === 'Бег' && <Map className="h-8 w-8 text-blue-500" />}
                                 {item.type === 'Тренажерный зал' && <Dumbbell className="h-8 w-8 text-red-500" />}
                                 {item.type === 'Йога' && <Zap className="h-8 w-8 text-purple-500" />}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div className="rounded-lg bg-muted p-4">
                                <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Clock/>Время</dt>
                                <dd className="mt-1 text-xl font-semibold">{item.duration}</dd>
                            </div>
                            <div className="rounded-lg bg-muted p-4">
                                <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Flame/>Калории</dt>
                                <dd className="mt-1 text-xl font-semibold">{item.calories} ккал</dd>
                            </div>
                            {item.distance && (
                                <div className="rounded-lg bg-muted p-4">
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Map/>Дистанция</dt>
                                    <dd className="mt-1 text-xl font-semibold">{item.distance}</dd>
                                </div>
                            )}
                            {item.avgPace && (
                                <div className="rounded-lg bg-muted p-4">
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Zap/>Сред. темп</dt>
                                    <dd className="mt-1 text-xl font-semibold">{item.avgPace}</dd>
                                </div>
                            )}
                             {item.volume && (
                                <div className="rounded-lg bg-muted p-4 col-span-2 md:col-span-1">
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Dumbbell/>Объем</dt>
                                    <dd className="mt-1 text-xl font-semibold">{item.volume}</dd>
                                </div>
                            )}
                        </div>
                        
                        {item.type === 'Бег' && (
                            <div>
                                <h3 className="font-semibold mb-2">Карта маршрута</h3>
                                <div className="aspect-video w-full rounded-lg overflow-hidden border">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        scrolling="no"
                                        src={mapUrl}
                                        style={{ border: 0 }}
                                        title="Карта маршрута"
                                    ></iframe>
                                </div>
                            </div>
                        )}

                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-6">
                        <Button variant="outline"><Share2 className="mr-2 h-4 w-4"/> Поделиться</Button>
                        <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4"/> Удалить</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
