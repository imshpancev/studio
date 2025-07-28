
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BatteryFull, Activity, Flame, ShieldCheck, HeartCrack, Smile, Moon } from "lucide-react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function AnalyticsPage() {
    const router = useRouter();

    const readinessScore = 88;
    const trainingLoadRatio = 1.1; // Example: 1.1 means slightly overreaching
    const caloriesThisWeek = 2340;
    const recoveryHours = 28;
    const stressLevel = 25; // Example: out of 100
    const bodyBattery = 78; // Example: out of 100
    const sleepQuality = 85;
    const sleepDuration = 7.5;

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

    const handleCardClick = (metric: string) => {
        router.push(`/analytics/${metric}`);
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Аналитика и Состояние</CardTitle>
                    <CardDescription>
                        Ключевые показатели вашей готовности и прогресса, рассчитанные на основе последних данных. Нажмите на карточку, чтобы узнать больше.
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card onClick={() => handleCardClick('readiness')} className="cursor-pointer hover:border-primary transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Готовность к тренировке</CardTitle>
                        <Smile className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{readinessScore}%</div>
                        <p className="text-xs text-muted-foreground">На основе ВСР, сна и недавней нагрузки</p>
                        <Progress value={readinessScore} className="mt-4 h-2" indicatorClassName={getReadinessColor(readinessScore)} />
                    </CardContent>
                </Card>
                 <Card onClick={() => handleCardClick('sleep')} className="cursor-pointer hover:border-primary transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Сон прошлой ночи</CardTitle>
                        <Moon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sleepDuration} ч</div>
                        <p className="text-xs text-muted-foreground">Качество: <span className={cn(sleepQuality > 80 ? "text-green-500" : "text-yellow-500")}>{sleepQuality}%</span></p>
                         <Progress value={sleepQuality} className="mt-4 h-2" indicatorClassName={getReadinessColor(sleepQuality)} />
                    </CardContent>
                </Card>
                <Card onClick={() => handleCardClick('training-load')} className="cursor-pointer hover:border-primary transition-colors">
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
                 <Card onClick={() => handleCardClick('body-battery')} className="cursor-pointer hover:border-primary transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Готовность тела</CardTitle>
                        <BatteryFull className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bodyBattery}%</div>
                        <p className="text-xs text-muted-foreground">Оценка запаса энергии вашего тела</p>
                        <Progress value={bodyBattery} className="mt-4 h-2" indicatorClassName={getReadinessColor(bodyBattery)} />
                    </CardContent>
                </Card>
                <Card onClick={() => handleCardClick('calories')} className="cursor-pointer hover:border-primary transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Сожжено калорий</CardTitle>
                        <Flame className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{caloriesThisWeek} ккал</div>
                        <p className="text-xs text-muted-foreground">За последние 7 дней</p>
                    </CardContent>
                </Card>
                <Card onClick={() => handleCardClick('recovery')} className="cursor-pointer hover:border-primary transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Время восстановления</CardTitle>
                        <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{recoveryHours} часов</div>
                        <p className="text-xs text-muted-foreground">Рекомендуемое время до следующей тяжелой тренировки</p>
                    </CardContent>
                </Card>
                 <Card onClick={() => handleCardClick('stress')} className="cursor-pointer hover:border-primary transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Уровень стресса</CardTitle>
                        <HeartCrack className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stressLevel} / 100</div>
                        <p className="text-xs text-muted-foreground">На основе вариабельности сердечного ритма</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    