

'use client';

import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Dumbbell, Flame, Map, Zap, Calendar, Share2, Trash2, HeartPulse, TrendingUp, BarChart, Mountain, Footprints, Repeat, Bike, Waves } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getMapEmbedUrl } from '@/lib/map-utils';
import { useEffect, useState } from 'react';
import { Workout, deleteWorkout, getWorkoutById } from '@/services/workoutService';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


export default function HistoryDetailPage() {
    const router = useRouter();
    const params = useParams();
    const workoutId = params.id as string;
    const { toast } = useToast();

    const [item, setItem] = useState<Workout | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        if (!workoutId) return;
        
        async function fetchWorkout() {
            try {
                const workoutData = await getWorkoutById(workoutId);
                if (workoutData) {
                    setItem(workoutData);
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'Ошибка',
                        description: 'Тренировка не найдена.',
                    });
                     router.push('/history');
                }
            } catch (error) {
                 toast({
                    variant: 'destructive',
                    title: 'Ошибка',
                    description: 'Не удалось загрузить данные о тренировке.',
                });
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchWorkout();
    }, [workoutId, router, toast]);

    const handleDelete = async () => {
        if (!item?.id) return;
        try {
            await deleteWorkout(item.id);
            toast({
                title: 'Тренировка удалена',
                description: 'Запись о тренировке была успешно удалена.',
            });
            router.push('/#history');
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Ошибка удаления',
                description: 'Не удалось удалить тренировку.',
            });
        }
    }
    
    if (isLoading) {
        return (
            <div className="min-h-screen bg-muted/40 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                     <Skeleton className="h-10 w-32 mb-4" />
                     <Card>
                         <CardHeader><Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-1/4 mt-2" /></CardHeader>
                         <CardContent className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                            <Skeleton className="h-64 w-full" />
                         </CardContent>
                     </Card>
                </div>
            </div>
        )
    }

    if (!item) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Тренировка не найдена.</p>
            </div>
        );
    }
    
    const mapUrl = item.track && item.track.length > 0 ? getMapEmbedUrl(item.track) : null;

    const getIcon = (type: string) => {
        if (type === 'Бег') return <Footprints className="h-8 w-8 text-primary" />;
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
                        
                        {mapUrl && (
                             <div className="space-y-2">
                                <h3 className="font-semibold">Карта маршрута</h3>
                                <div className="aspect-video w-full rounded-lg overflow-hidden border">
                                    <iframe
                                        src={mapUrl}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={false}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={`Карта маршрута для ${item.title}`}
                                    ></iframe>
                                </div>
                            </div>
                        )}
                        
                        {(item.type === 'Бег' || item.type === 'Велоспорт') && item.splits && item.splits.length > 0 && (
                             <div>
                                <h3 className="font-semibold mb-2 flex items-center gap-2"><Repeat /> Сплиты</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">{item.type === 'Бег' ? 'Км' : 'Отрезок'}</TableHead>
                                            <TableHead>{item.type === 'Бег' ? 'Темп' : 'Скорость'}</TableHead>
                                            <TableHead>Пульс</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {item.splits?.map((split: any, index: number) => (
                                             <TableRow key={index}>
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell>{split.pace || split.speed}</TableCell>
                                                <TableCell>{split.heartRate}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}


                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t pt-6">
                        <Button variant="outline"><Share2 className="mr-2 h-4 w-4"/> Поделиться</Button>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4"/> Удалить</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Это действие навсегда удалит вашу тренировку из истории. Это действие нельзя будет отменить.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className='bg-destructive hover:bg-destructive/90'>Удалить</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
