
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Dumbbell, Flame, Map, Zap, Calendar, TrendingUp, Bike, Waves, Footprints, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoutesPage } from "@/components/routes-page";
import { historyItems } from "@/lib/mock-data";


const getIcon = (type: string) => {
    switch (type) {
        case 'Бег': return <Footprints className="h-6 w-6 text-primary" />;
        case 'Тренажерный зал': return <Dumbbell className="h-6 w-6 text-destructive" />;
        case 'Йога': return <Zap className="h-6 w-6 text-accent" />;
        case 'Велоспорт': return <Bike className="h-6 w-6 text-green-500" />;
        case 'Плавание': return <Waves className="h-6 w-6 text-blue-500" />;
        default: return <Dumbbell className="h-6 w-6" />;
    }
}

export default function WorkoutHistoryPage() {
    const router = useRouter();

    const handleCardClick = (item: typeof historyItems[0]) => {
        const itemQuery = encodeURIComponent(JSON.stringify(item));
        router.push(`/history/${item.id}?data=${itemQuery}`);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>История тренировок</CardTitle>
                <CardDescription>Здесь хранятся все ваши завершенные тренировки. Нажмите, чтобы посмотреть детали.</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="list" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="list" className="gap-2"><History />Список</TabsTrigger>
                        <TabsTrigger value="routes" className="gap-2"><Map />Карта маршрутов</TabsTrigger>
                    </TabsList>
                    <TabsContent value="list" className="mt-4">
                        <div className="space-y-4">
                            {historyItems.map((item) => (
                                <Card key={item.id} className="p-4 flex flex-col sm:flex-row items-start gap-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => handleCardClick(item)}>
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
                        </div>
                    </TabsContent>
                    <TabsContent value="routes" className="mt-4">
                        <RoutesPage />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
