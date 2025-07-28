

'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Dumbbell, Flame, Map, Zap, Calendar, TrendingUp, Bike, Waves, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { RunIcon } from "@/components/icons/run-icon";

// Mock data for workout history
export const historyItems = [
    {
        id: 1,
        type: "Бег",
        title: "Вечерняя пробежка",
        date: "2024-07-28",
        duration: "45:12",
        distance: "7.5 км",
        avgPace: "6'01\"/км",
        calories: 450,
        avgHeartRate: 156,
        elevationGain: "22 м",
        avgCadence: "165 SPM",
        avgPower: "210 Вт",
        coords: { lat: 55.7558, lng: 37.6176 },
        bbox: "37.60,55.75,37.63,55.76",
        track: [ { lat: 55.7558, lng: 37.6176 }, { lat: 55.7568, lng: 37.6186 }, { lat: 55.7550, lng: 37.6200 } ],
        splits: [
            { pace: "6'10\"/км", heartRate: "150 BPM" },
            { pace: "6'05\"/км", heartRate: "155 BPM" },
            { pace: "6'00\"/км", heartRate: "158 BPM" },
            { pace: "5'55\"/км", heartRate: "162 BPM" },
            { pace: "5'50\"/км", heartRate: "165 BPM" },
            { pace: "6'05\"/км", heartRate: "160 BPM" },
            { pace: "6'15\"/км", heartRate: "154 BPM" },
        ]
    },
    {
        id: 2,
        type: "Тренажерный зал",
        title: "Тренировка на верх тела",
        date: "2024-07-27",
        duration: "01:10:30",
        volume: "3500 кг",
        calories: 300,
        avgHeartRate: 135,
    },
    {
        id: 3,
        type: "Йога",
        title: "Утренняя виньяса",
        date: "2024-07-26",
        duration: "00:55:00",
        calories: 150,
        avgHeartRate: 110,
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
        elevationGain: "15 м",
        avgCadence: "175 SPM",
        avgPower: "250 Вт",
        coords: { lat: 40.7128, lng: -74.0060 }, // New York
        bbox: "-74.01,40.71,-74.00,40.72",
        track: [ { lat: 40.7128, lng: -74.0060 }, { lat: 40.7138, lng: -74.0050 }, { lat: 40.7120, lng: -74.0030 } ],
        splits: [
            { pace: "5'40\"/км", heartRate: "160 BPM" },
            { pace: "5'30\"/км", heartRate: "165 BPM" },
            { pace: "5'20\"/км", heartRate: "172 BPM" },
            { pace: "5'25\"/км", heartRate: "175 BPM" },
            { pace: "5'35\"/км", heartRate: "170 BPM" },
        ]
    },
     {
        id: 5,
        type: "Велоспорт",
        title: "Длинная поездка",
        date: "2024-07-24",
        duration: "02:15:00",
        distance: "60.0 км",
        avgSpeed: "26.7 км/ч",
        calories: 950,
        avgHeartRate: 145,
        elevationGain: "350 м",
        avgPower: "180 Вт",
        coords: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
        bbox: "-118.25,34.05,-118.23,34.06",
        track: [ { lat: 34.0522, lng: -118.2437 }, { lat: 34.0532, lng: -118.2427 }, { lat: 34.0512, lng: -118.2400 } ],
        splits: [
            { pace: "27.0 км/ч", heartRate: "140 BPM" },
            { pace: "26.5 км/ч", heartRate: "142 BPM" },
            { pace: "26.8 км/ч", heartRate: "148 BPM" },
            { pace: "27.2 км/ч", heartRate: "150 BPM" },
        ]
    },
     {
        id: 6,
        type: "Плавание",
        title: "Тренировка в бассейне",
        date: "2024-07-23",
        duration: "01:05:00",
        distance: "2.5 км",
        avgPace: "2'30\"/100м",
        calories: 500,
        avgHeartRate: 140,
    },
];

const getIcon = (type: string) => {
    switch (type) {
        case 'Бег': return <RunIcon className="h-6 w-6 text-primary" />;
        case 'Тренажерный зал': return <Dumbbell className="h-6 w-6 text-destructive" />;
        case 'Йога': return <Zap className="h-6 w-6 text-accent" />;
        case 'Велоспорт': return <Bike className="h-6 w-6 text-green-500" />;
        case 'Плавание': return <Waves className="h-6 w-6 text-blue-500" />;
        default: return <History className="h-6 w-6" />;
    }
}

export default function WorkoutHistoryPage() {
    const router = useRouter();

    const handleCardClick = (item: typeof historyItems[0]) => {
        const itemQuery = encodeURIComponent(JSON.stringify(item));
        router.push(`/history/${item.id}?data=${itemQuery}`);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
             <Card>
                <CardHeader>
                  <CardTitle>История тренировок</CardTitle>
                  <CardDescription>Здесь хранятся все ваши завершенные тренировки. Нажмите, чтобы посмотреть детали.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {historyItems.map((item) => (
                        <Card key={item.id} className="p-4 flex items-start gap-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => handleCardClick(item)}>
                            <div className={`p-3 rounded-full bg-muted`}>
                               {getIcon(item.type)}
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
                                    {item.avgPace && <div className="flex items-center gap-1"><TrendingUp className="h-4 w-4" /> {item.avgPace}</div>}
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
