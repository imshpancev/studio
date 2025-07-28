
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Dumbbell, Flame, Map, Zap, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
        icon: <Map className="h-6 w-6 text-blue-500" />,
        color: "blue"
    },
    {
        id: 2,
        type: "Тренажерный зал",
        title: "Тренировка на верх тела",
        date: "2024-07-27",
        duration: "01:10:30",
        volume: "3500 кг",
        calories: 300,
        icon: <Dumbbell className="h-6 w-6 text-red-500" />,
        color: "red"
    },
    {
        id: 3,
        type: "Йога",
        title: "Утренняя виньяса",
        date: "2024-07-26",
        duration: "00:55:00",
        calories: 150,
        icon: <Zap className="h-6 w-6 text-purple-500" />,
        color: "purple"
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
        icon: <Map className="h-6 w-6 text-blue-500" />,
        color: "blue"
    },
];


export default function WorkoutHistoryPage() {
    return (
        <div className="max-w-4xl mx-auto">
             <Card>
                <CardHeader>
                  <CardTitle>История тренировок</CardTitle>
                  <CardDescription>Здесь хранятся все ваши завершенные тренировки.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {historyItems.map((item) => (
                        <Card key={item.id} className="p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors">
                            <div className={`p-3 rounded-full bg-${item.color}-100 dark:bg-${item.color}-900/30`}>
                               {item.icon}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold">{item.title}</h3>
                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> {new Date(item.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                    <Badge variant="outline">{item.type}</Badge>
                                    <div className="flex items-center gap-1"><Clock className="h-4 w-4" /> {item.duration}</div>
                                    <div className="flex items-center gap-1"><Flame className="h-4 w-4" /> {item.calories} ккал</div>
                                    {item.distance && <div className="flex items-center gap-1"><Map className="h-4 w-4" /> {item.distance}</div>}
                                    {item.avgPace && <div className="flex items-center gap-1"><Zap className="h-4 w-4" /> {item.avgPace}</div>}
                                    {item.volume && <div className="flex items-center gap-1"><Dumbbell className="h-4 w-4" /> {item.volume}</div>}
                                </div>
                            </div>
                        </Card>
                    ))}

                    {historyItems.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>У вас еще нет завершенных тренировок.</p>
                            <p>Завершите тренировку из вашего плана, и она появится здесь.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}