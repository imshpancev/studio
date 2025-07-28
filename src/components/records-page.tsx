
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Clock, Flame, Zap, Bike, Waves, Map as MapIcon, Dumbbell, Footprints } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { getUserRecords, UserRecords } from '@/services/recordsService';
import { Skeleton } from './ui/skeleton';
import { Sport } from '@/lib/workout-data';


const TriathlonIcon = () => (
    <div className="flex gap-1 items-center">
        <Footprints className="h-3 w-3" />
        <Bike className="h-3 w-3" />
        <Waves className="h-3 w-3" />
    </div>
)


export function RecordsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const user = auth.currentUser;

    const [records, setRecords] = useState<UserRecords | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        async function fetchRecords() {
            try {
                const userRecords = await getUserRecords(user.uid);
                setRecords(userRecords);
            } catch (error) {
                 toast({
                    variant: 'destructive',
                    title: 'Ошибка',
                    description: 'Не удалось загрузить личные рекорды.',
                });
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchRecords();

    }, [user, toast]);


    const handleRecordClick = (workoutId?: string) => {
        if (!workoutId) return;
        router.push(`/history/${workoutId}`);
    };

    const renderRecordList = (records: any[], sport: Sport | 'general') => {
        const sportRecords = records?.find(r => r.sport === sport)?.records || [];
        
        if (isLoading) {
             return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
                </div>
            )
        }
        
        if (sportRecords.length === 0) {
            return (
                <div className="text-center py-12 text-muted-foreground">
                    <p>Нет рекордов в этой категории.</p>
                    <p>Завершите тренировку, чтобы установить свой первый рекорд!</p>
                </div>
            )
        }
        
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sportRecords.map((record: any) => (
                     <Card 
                        key={record.name}
                        className={record.workoutId ? "cursor-pointer hover:border-primary transition-colors" : "opacity-60"}
                        onClick={() => handleRecordClick(record.workoutId)}
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                               <Trophy/> {record.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{record.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {record.date ? new Date(record.date).toLocaleDateString('ru-RU') : '-'}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy />Личные рекорды</CardTitle>
                <CardDescription>
                    Ваши лучшие достижения, рассчитанные на основе истории тренировок.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="running" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
                        <TabsTrigger value="general" className='gap-2'><Dumbbell />Общие</TabsTrigger>
                        <TabsTrigger value="running" className='gap-2'><Footprints />Бег</TabsTrigger>
                        <TabsTrigger value="cycling" className='gap-2'><Bike />Велоспорт</TabsTrigger>
                        <TabsTrigger value="swimming" className='gap-2'><Waves />Плавание</TabsTrigger>
                        <TabsTrigger value="triathlon" className='gap-2'><TriathlonIcon />Триатлон</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general" className="mt-4">
                        {renderRecordList(records?.sports || [], 'general')}
                    </TabsContent>
                    <TabsContent value="running" className="mt-4">
                        {renderRecordList(records?.sports || [], Sport.Running)}
                    </TabsContent>
                    <TabsContent value="cycling" className="mt-4">
                         {renderRecordList(records?.sports || [], Sport.Cycling)}
                    </TabsContent>
                    <TabsContent value="swimming" className="mt-4">
                         {renderRecordList(records?.sports || [], Sport.Swimming)}
                    </TabsContent>
                    <TabsContent value="triathlon" className="mt-4">
                         {renderRecordList(records?.sports || [], Sport.Triathlon)}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
