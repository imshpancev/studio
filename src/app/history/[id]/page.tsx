
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Dumbbell, Flame, Map, Zap, Calendar, Share2, Trash2, HeartPulse, TrendingUp, BarChart, Mountain, Footprints, Repeat, Bike, Waves } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

    const getIcon = (type: string) => {
        if (type === 'Бег') return <Map className="h-8 w-8 text-primary" />;
        if (type === 'Тренажерный зал') return <Dumbbell className="h-8 w-8 text-destructive" />;
        if (type === 'Йога') return <Zap className="h-8 w-8 text-accent" />;
        if (type === 'Велоспорт') return <Bike className="h-8 w-8 text-green-500" />;
        if (type === 'Плавание') return <Waves className="h-8 w-8 text-blue-500" />;
        return <Dumbbell className="h-8 w-8 text-primary" />;
    }

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
                                 {getIcon(item.type)}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                            <div className="rounded-lg bg-muted p-4">
                                <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Clock/>Время</dt>
                                <dd className="mt-1 text-xl font-semibold">{item.duration}</dd>
                            </div>
                            <div className="rounded-lg bg-muted p-4">
                                <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Flame/>Калории</dt>
                                <dd className="mt-1 text-xl font-semibold">{item.calories} ккал</dd>
                            </div>
                            <div className="rounded-lg bg-muted p-4">
                                <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><HeartPulse/>Средний пульс</dt>
                                <dd className="mt-1 text-xl font-semibold">{item.avgHeartRate || 'N/A'} уд/мин</dd>
                            </div>

                            {item.distance && (
                                <div className="rounded-lg bg-muted p-4">
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Map/>Дистанция</dt>
                                    <dd className="mt-1 text-xl font-semibold">{item.distance}</dd>
                                </div>
                            )}
                            {item.avgPace && (
                                <div className="rounded-lg bg-muted p-4">
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><TrendingUp/>Сред. темп</dt>
                                    <dd className="mt-1 text-xl font-semibold">{item.avgPace}</dd>
                                </div>
                            )}
                             {item.elevationGain && (
                                <div className="rounded-lg bg-muted p-4">
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Mountain/>Набор высоты</dt>
                                    <dd className="mt-1 text-xl font-semibold">{item.elevationGain}</dd>
                                </div>
                            )}
                             {item.avgCadence && (
                                <div className="rounded-lg bg-muted p-4">
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Footprints/>Сред. каденс</dt>
                                    <dd className="mt-1 text-xl font-semibold">{item.avgCadence}</dd>
                                </div>
                            )}
                            {item.avgPower && (
                                <div className="rounded-lg bg-muted p-4">
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><Zap/>Сред. мощность</dt>
                                    <dd className="mt-1 text-xl font-semibold">{item.avgPower}</dd>
                                </div>
                            )}
                             {item.volume && (
                                <div className="rounded-lg bg-muted p-4">
                                    <dt className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2"><BarChart/>Объем</dt>
                                    <dd className="mt-1 text-xl font-semibold">{item.volume}</dd>
                                </div>
                            )}
                        </dl>
                        
                        {(item.type === 'Бег' || item.type === 'Велоспорт') && (
                            <div className="space-y-4">
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
                                 <div>
                                    <h3 className="font-semibold mb-2 flex items-center gap-2"><Repeat /> Сплиты</h3>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Км</TableHead>
                                                <TableHead>Темп</TableHead>
                                                <TableHead>Пульс</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {item.splits?.map((split: any, index: number) => (
                                                 <TableRow key={index}>
                                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                                    <TableCell>{split.pace}</TableCell>
                                                    <TableCell>{split.heartRate}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
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

    
