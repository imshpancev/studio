
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Clock, Flame, Zap, Bike, Waves, Map as MapIcon, Dumbbell } from 'lucide-react';
import { historyItems } from '@/app/history/page'; // We'll use this mock data
import { RunIcon } from './icons/run-icon';

// Mock records data, in a real app this would be calculated
const recordsData = {
    general: [
        { name: 'Самая долгая тренировка', value: '02:15:00', workoutId: 5, date: '2024-07-24', icon: <Clock /> },
        { name: 'Больше всего калорий', value: '950 ккал', workoutId: 5, date: '2024-07-24', icon: <Flame /> },
    ],
    running: [
        { name: '1 км', value: '04:55', workoutId: 4, date: '2024-07-25', icon: <Trophy /> },
        { name: '5 км', value: '27:30', workoutId: 4, date: '2024-07-25', icon: <Trophy /> },
        { name: '10 км', value: '58:10', workoutId: 1, date: '2024-07-28', icon: <Trophy /> },
        { name: 'Полумарафон', value: '02:15:30', workoutId: 1, date: '2024-07-28', icon: <Trophy /> },
        { name: 'Марафон', value: 'N/A', workoutId: null, date: '-', icon: <Trophy /> },
        { name: 'Самая длинная пробежка', value: '7.5 км', workoutId: 1, date: '2024-07-28', icon: <MapIcon /> },
    ],
    cycling: [
        { name: '10 км', value: '18:30', workoutId: 5, date: '2024-07-24', icon: <Trophy /> },
        { name: '20 км', value: '40:15', workoutId: 5, date: '2024-07-24', icon: <Trophy /> },
        { name: '50 км', value: '01:50:45', workoutId: 5, date: '2024-07-24', icon: <Trophy /> },
        { name: 'Самая длинная поездка', value: '60.0 км', workoutId: 5, date: '2024-07-24', icon: <MapIcon /> },
        { name: 'Макс. мощность', value: '450 Вт', workoutId: 5, date: '2024-07-24', icon: <Zap /> },
    ],
    swimming: [
        { name: '100 м', value: '01:45', workoutId: 6, date: '2024-07-23', icon: <Trophy /> },
        { name: '400 м', value: '08:30', workoutId: 6, date: '2024-07-23', icon: <Trophy /> },
        { name: '1500 м', value: '35:10', workoutId: 6, date: '2024-07-23', icon: <Trophy /> },
        { name: 'Самый длинный заплыв', value: '2.5 км', workoutId: 6, date: '2024-07-23', icon: <MapIcon /> },
    ]
};


export function RecordsPage() {
    const router = useRouter();

    const handleRecordClick = (workoutId: number | null) => {
        if (!workoutId) return;
        const workout = historyItems.find(item => item.id === workoutId);
        if (workout) {
            const itemQuery = encodeURIComponent(JSON.stringify(workout));
            router.push(`/history/${workout.id}?data=${itemQuery}`);
        }
    };

    const renderRecordList = (records: any[]) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.map(record => (
                 <Card 
                    key={record.name}
                    className={record.workoutId ? "cursor-pointer hover:border-primary transition-colors" : "opacity-60"}
                    onClick={() => handleRecordClick(record.workoutId)}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                           {record.icon} {record.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{record.value}</div>
                        <p className="text-xs text-muted-foreground">
                            {record.date}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy />Личные рекорды</CardTitle>
                <CardDescription>
                    Ваши лучшие достижения. Нажмите на рекорд, чтобы посмотреть детали тренировки.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="running" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="general" className='gap-2'><Dumbbell />Общие</TabsTrigger>
                        <TabsTrigger value="running" className='gap-2'><RunIcon className="h-5 w-5" />Бег</TabsTrigger>
                        <TabsTrigger value="cycling" className='gap-2'><Bike />Велоспорт</TabsTrigger>
                        <TabsTrigger value="swimming" className='gap-2'><Waves />Плавание</TabsTrigger>
                    </TabsList>
                    <TabsContent value="general" className="mt-4">
                        {renderRecordList(recordsData.general)}
                    </TabsContent>
                    <TabsContent value="running" className="mt-4">
                        {renderRecordList(recordsData.running)}
                    </TabsContent>
                    <TabsContent value="cycling" className="mt-4">
                         {renderRecordList(recordsData.cycling)}
                    </TabsContent>
                    <TabsContent value="swimming" className="mt-4">
                         {renderRecordList(recordsData.swimming)}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

    