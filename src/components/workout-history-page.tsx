

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Dumbbell, Flame, Map, Zap, Calendar, History, HeartPulse, TrendingUp, BarChart, Bike, Waves } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { RunIcon } from "./icons/run-icon";

// Mock data for workout history
const historyItems = [
    {
        id: 1,
        type: "Бег",
        title: "Вечерняя пробежка",
        date: "2024-07-28",
        duration: "45:12",
        distance: "7.5 км",
        avgPace: "6'01\"/км",
        calories: 450,
        avgHeartRate: 155,
        icon: <RunIcon className="h-6 w-6 text-primary" />,
    },
    {
        id: 2,
        type: "Тренажерный зал",
        title: "Тренировка на верх тела",
        date: "2024-07-27",
        duration: "01:10:30",
        volume: "3500 кг",
        calories: 300,
        avgHeartRate: 130,
        icon: <Dumbbell className="h-6 w-6 text-destructive" />,
    },
    {
        id: 3,
        type: "Йога",
        title: "Утренняя виньяса",
        date: "2024-07-26",
        duration: "00:55:00",
        calories: 150,
        avgHeartRate: 105,
        icon: <Zap className="h-6 w-6 text-accent" />,
    },
    {
        id: 4,
        type: "Бег",
        title: "Интервальная тренировка",
        date: "2024-07-25",
        duration: "00:35:45",
        distance: "5.0 км",
        avgPace: "5'30\"/км",
        calories: 380,
        avgHeartRate: 168,
        icon: <RunIcon className="h-6 w-6 text-primary" />,
    },
];

const getSportIcon = (type: string) => {
    switch (type) {
        case 'Бег': return <RunIcon className="h-6 w-6 text-primary" />;
        case 'Тренажерный зал': return <Dumbbell className="h-6 w-6 text-destructive" />;
        case 'Йога': return <Zap className="h-6 w-6 text-accent" />;
        case 'Велоспорт': return <Bike className="h-6 w-6 text-green-500" />;
        case 'Плавание': return <Waves className="h-6 w-6 text-blue-500" />;
        default: return <History className="h-6 w-6" />;
    }
}


export function WorkoutHistoryPage() {
    const router = useRouter();

    const handleViewDetails = (item: any) => {
        const itemQuery = encodeURIComponent(JSON.stringify(item));
        router.push(`/history/${item.id}?data=${itemQuery}`);
    };

    return (
         <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><History className="w-6 h-6" />История тренировок</CardTitle>
              <CardDescription>Здесь хранятся все ваши завершенные тренировки. Нажмите на тренировку, чтобы просмотреть детали.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {historyItems.map((item) => (
                    <Card 
                        key={item.id} 
                        className="p-4 flex flex-col sm:flex-row items-start gap-4 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handleViewDetails(item)}
                    >
                        <div className="p-3 rounded-full bg-muted">
                           {getSportIcon(item.type)}
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold">{item.title}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> {new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <Badge variant="outline" className="hidden sm:inline-flex">{item.type}</Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2 border-t mt-2">
                                <div className="flex items-center gap-1" title="Длительность"><Clock className="h-4 w-4" /> {item.duration}</div>
                                <div className="flex items-center gap-1" title="Сожжено калорий"><Flame className="h-4 w-4" /> {item.calories} ккал</div>
                                <div className="flex items-center gap-1" title="Средний пульс"><HeartPulse className="h-4 w-4" /> {item.avgHeartRate} уд/мин</div>
                                {item.distance && <div className="flex items-center gap-1" title="Дистанция"><Map className="h-4 w-4" /> {item.distance}</div>}
                                {item.avgPace && <div className="flex items-center gap-1" title="Средний темп"><TrendingUp className="h-4 w-4" /> {item.avgPace}</div>}
                                {item.volume && <div className="flex items-center gap-1" title="Объем тренировки"><BarChart className="h-4 w-4" /> {item.volume}</div>}
                            </div>
                        </div>
                    </Card>
                ))}

                {historyItems.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <History className="h-12 w-12 mx-auto mb-4" />
                        <p className="font-semibold">История пуста</p>
                        <p>Завершите тренировку из вашего плана, и она появится здесь.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
