
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BatteryFull, Activity, Flame, ShieldCheck } from "lucide-react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

export function AnalyticsPage() {

    const readinessScore = 88;
    const trainingLoadRatio = 1.1; // Example: 1.1 means slightly overreaching
    const caloriesThisWeek = 2340;
    const recoveryHours = 28;

    const getReadinessColor = (score: number) => {
        if (score > 80) return "bg-green-500";
        if (score > 60) return "bg-yellow-500";
        return "bg-red-500";
    }

    const getTrainingLoadBadgeVariant = (ratio: number): "default" | "destructive" | "secondary" => {
        if (ratio >= 0.8 && ratio < 1.3) return "default"; // Green in shadcn default
        if (ratio >= 1.3 && ratio < 1.5) return "secondary"; // Use secondary for warning
        return "destructive"; // Red
    }
     const getTrainingLoadText = (ratio: number) => {
        if (ratio < 0.8) return "Недостаточная нагрузка";
        if (ratio < 1.3) return "Оптимальная";
        if (ratio < 1.5) return "Перегрузка";
        return "Высокий риск травмы";
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Аналитика и Состояние</CardTitle>
                    <CardDescription>
                        Ключевые показатели вашей готовности и прогресса, рассчитанные на основе последних данных.
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Готовность к тренировке</CardTitle>
                        <BatteryFull className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{readinessScore}%</div>
                        <p className="text-xs text-muted-foreground">На основе ВСР, сна и недавней нагрузки</p>
                        <Progress value={readinessScore} className="mt-4 h-2" indicatorClassName={getReadinessColor(readinessScore)} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Тренировочная нагрузка</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                             <Badge variant={getTrainingLoadBadgeVariant(trainingLoadRatio)}>{getTrainingLoadText(trainingLoadRatio)}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">Соотношение острой и хронической нагрузки: {trainingLoadRatio.toFixed(1)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Сожжено калорий</CardTitle>
                        <Flame className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{caloriesThisWeek} ккал</div>
                        <p className="text-xs text-muted-foreground">За последние 7 дней</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Время восстановления</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{recoveryHours} часов</div>
                        <p className="text-xs text-muted-foreground">Рекомендуемое время до следующей тяжелой тренировки</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
