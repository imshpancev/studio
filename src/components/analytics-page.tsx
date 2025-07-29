
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BatteryFull, Activity, ShieldCheck, HeartCrack, Smile, Moon, Calendar, Clock, Zap, Footprints, Trophy, PersonStanding, Flame, Droplets, TrendingDown, TrendingUp, Loader2 } from "lucide-react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { BodyCompositionPage } from "./body-composition-page";
import { getUserWorkouts, Workout } from "@/services/workoutService";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile, UserProfile } from "@/services/userService";
import { Skeleton } from "./ui/skeleton";


const barChartConfig = {
  running: { label: 'Бег', color: 'hsl(var(--chart-1))' },
  gym: { label: 'Зал', color: 'hsl(var(--chart-2))' },
  yoga: { label: 'Йога', color: 'hsl(var(--chart-3))' },
  cycling: { label: 'Велоспорт', color: 'hsl(var(--chart-5))' },
  swimming: { label: 'Плавание', color: 'hsl(var(--chart-4))' },
  home: { label: 'Дома', color: 'hsl(var(--chart-1))' },
  triathlon: { label: 'Триатлон', color: 'hsl(var(--chart-2))' },
};


export function AnalyticsPage({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
    const router = useRouter();
    const { toast } = useToast();
    const [timePeriod, setTimePeriod] = useState('week');
    const [isLoading, setIsLoading] = useState(true);
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    const user = auth.currentUser;

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        async function fetchData() {
            setIsLoading(true);
            try {
                const [userWorkouts, profile] = await Promise.all([
                    getUserWorkouts(user!.uid),
                    getUserProfile(user!.uid, user!.email || '')
                ]);
                setWorkouts(userWorkouts);
                setUserProfile(profile);
            } catch (error) {
                 toast({
                    variant: 'destructive',
                    title: 'Ошибка',
                    description: 'Не удалось загрузить данные для аналитики.',
                });
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [user, toast]);
    
    // REAL DATA
    const readinessScore = userProfile?.readinessScore || 0;
    const trainingLoadRatio = userProfile?.trainingLoadRatio || 0;
    const stressLevel = userProfile?.stressLevel || 0;
    const bodyBattery = userProfile?.bodyBattery || 0;
    const sleepQuality = userProfile?.avgSleepDuration ? Math.round((userProfile.avgSleepDuration / 8) * 100) : 0;
    const sleepDuration = userProfile?.avgSleepDuration || 0;
    const recoveryTime = userProfile?.recoveryTimeHours || 0;
    
    // --- CALCULATIONS ---
    const calculateTotalTime = (workouts: Workout[]) => {
        return workouts.reduce((acc, workout) => {
            const parts = workout.duration.split(':').map(Number);
            const seconds = (parts[0] * 3600) + (parts[1] * 60) + parts[2];
            return acc + (seconds / 60); // time in minutes
        }, 0);
    };

    const totalTime = calculateTotalTime(workouts);
    const totalCaloriesBurned = workouts.reduce((acc, w) => acc + (w.calories || 0), 0);
    const totalCaloriesConsumed = 1850; // Mocked for now

     const generateWeeklyActivityData = (workouts: Workout[]) => {
        const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        const weeklyData = days.map(day => ({
            day, running: 0, gym: 0, yoga: 0, cycling: 0, swimming: 0, home: 0, triathlon: 0
        }));

        workouts.forEach(workout => {
            const workoutDate = new Date(workout.date);
            const dayOfWeek = workoutDate.getDay(); // 0 for Sunday, 1 for Monday...
            const dayName = days[dayOfWeek];
            
            const durationParts = workout.duration.split(':').map(Number);
            const durationInMinutes = durationParts[0] * 60 + durationParts[1] + durationParts[2] / 60;

            const key = workout.type.toLowerCase()
                .replace('тренажерный зал', 'gym')
                .replace('домашние тренировки', 'home')
            
            if (dayName && weeklyData[dayOfWeek] && key in weeklyData[dayOfWeek]) {
                (weeklyData[dayOfWeek] as any)[key] += durationInMinutes;
            }
        });
        
        // Reorder to start from Monday
        const orderedData = [...weeklyData.slice(1), weeklyData[0]];
        return orderedData;
    };
    
    const weeklyActivityData = generateWeeklyActivityData(workouts);


    const getReadinessColor = (score: number) => {
        if (score > 80) return "bg-green-500";
        if (score > 60) return "bg-yellow-500";
        return "bg-red-500";
    }

     const getTrainingLoadText = (ratio: number) => {
        if (ratio < 0.8) return "Недостаточная нагрузка";
        if (ratio < 1.3) return "Оптимальная";
        if (ratio < 1.5) return "Перегрузка";
        return "Высокий риск травмы";
    }
    
    const getTrainingLoadBadgeVariant = (ratio: number): "default" | "secondary" | "destructive" | "outline" => {
        if (ratio < 0.8) return "secondary";
        if (ratio < 1.3) return "default";
        if (ratio < 1.5) return "outline";
        return "destructive";
    }

    const handleCardClick = (metric: string) => {
        router.push(`/analytics/${metric}`);
    }
    
    const handleRecordClick = () => {
        setActiveTab('records');
    }

    if (isLoading) {
        return (
             <div className="space-y-8">
                <Skeleton className="h-10 w-1/3" />
                 <Card>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-6">
                         {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[250px] w-full" />
                    </CardContent>
                </Card>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     {[...Array(9)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
                </div>
             </div>
        )
    }

    return (
        <Tabs defaultValue="overview">
             <CardHeader className="p-0 mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Аналитика</CardTitle>
                        <CardDescription>
                            Ключевые показатели вашей готовности, прогресса и состава тела.
                        </CardDescription>
                    </div>
                     <TabsList>
                        <TabsTrigger value="overview">Ключевые показатели</TabsTrigger>
                        <TabsTrigger value="composition">Состав тела</TabsTrigger>
                    </TabsList>
                </div>
            </CardHeader>
            <TabsContent value="overview" className="space-y-8">
                 <div className="flex flex-wrap justify-between items-center gap-4">
                    <CardHeader className="p-0">
                        <CardTitle>Итоги за {timePeriod === 'week' ? 'неделю' : timePeriod === 'month' ? 'месяц' : 'год'}</CardTitle>
                        <CardDescription>Обзор вашей активности.</CardDescription>
                    </CardHeader>
                    <Select value={timePeriod} onValueChange={setTimePeriod}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Период" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">Эта неделя</SelectItem>
                            <SelectItem value="month">Этот месяц</SelectItem>
                            <SelectItem value="year">Этот год</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Card>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Общее время</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{(totalTime / 60).toFixed(1)} ч</div>
                                <p className="text-xs text-muted-foreground">
                                    Всего {workouts.length} тренировок
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">VO2 Max</CardTitle>
                                <Zap className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">45.2</div>
                                <p className="text-xs text-muted-foreground">
                                    мл/кг/мин (Хорошо)
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Шаги</CardTitle>
                                <Footprints className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{userProfile?.dailySteps?.toLocaleString() || 0}</div>
                                <p className="text-xs text-muted-foreground">
                                    Среднее за день
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="cursor-pointer hover:border-primary" onClick={handleRecordClick}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Личные рекорды</CardTitle>
                                <Trophy className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">Перейти</div>
                                <p className="text-xs text-muted-foreground">
                                Нажмите, чтобы посмотреть все рекорды
                                </p>
                            </CardContent>
                        </Card>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Calendar className="h-5 w-5" />
                            Активность за неделю
                        </CardTitle>
                        <CardDescription>Минуты тренировок по дням</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={barChartConfig} className="h-[250px] w-full">
                            <BarChart data={weeklyActivityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} unit="м" />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="running" stackId="a" fill="var(--color-running)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="gym" stackId="a" fill="var(--color-gym)" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="yoga" stackId="a" fill="var(--color-yoga)" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="cycling" stackId="a" fill="var(--color-cycling)" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="swimming" stackId="a" fill="var(--color-swimming)" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="home" stackId="a" fill="var(--color-home)" radius={[0, 0, 0, 0]} />
                                 <Bar dataKey="triathlon" stackId="a" fill="var(--color-triathlon)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>


                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Баланс калорий</CardTitle>
                            <Flame className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                             <div className="text-2xl font-bold text-green-500">{(totalCaloriesConsumed - totalCaloriesBurned).toLocaleString()} ккал</div>
                             <p className="text-xs text-muted-foreground">Потрачено: {totalCaloriesBurned.toLocaleString()}, Потреблено: {totalCaloriesConsumed.toLocaleString()}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Потреблено калорий</CardTitle>
                             <TrendingDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                             <div className="text-2xl font-bold">{totalCaloriesConsumed.toLocaleString()} / 2500 ккал</div>
                             <p className="text-xs text-muted-foreground">Факт / План</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Потрачено калорий</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                             <div className="text-2xl font-bold">{totalCaloriesBurned.toLocaleString()} ккал</div>
                             <p className="text-xs text-muted-foreground">Активные: {totalCaloriesBurned.toLocaleString()}, В покое: 1650</p>
                        </CardContent>
                    </Card>

                    <Card onClick={() => handleCardClick('readiness')} className="cursor-pointer hover:border-primary transition-colors flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Готовность к тренировке</CardTitle>
                            <Smile className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="text-2xl font-bold">{readinessScore}%</div>
                                <p className="text-xs text-muted-foreground">На основе ВСР, сна и недавней нагрузки</p>
                            </div>
                            <Progress value={readinessScore} className="mt-4 h-2" indicatorClassName={getReadinessColor(readinessScore)} />
                        </CardContent>
                    </Card>
                    <Card onClick={() => handleCardClick('sleep')} className="cursor-pointer hover:border-primary transition-colors flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Сон прошлой ночи</CardTitle>
                            <Moon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="text-2xl font-bold">{sleepDuration} ч</div>
                                <p className="text-xs text-muted-foreground">Качество: <span className={cn(sleepQuality > 80 ? "text-green-500" : "text-yellow-500")}>{sleepQuality}%</span></p>
                            </div>
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
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                <div className="h-2 w-2 rounded-full bg-green-500"></div><span>Оптимально (0.8-1.3)</span>
                                <div className="h-2 w-2 rounded-full bg-yellow-500"></div><span>Перегрузка (1.3-1.5)</span>
                                <div className="h-2 w-2 rounded-full bg-red-500"></div><span>Риск травмы (&gt;1.5)</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card onClick={() => handleCardClick('body-battery')} className="cursor-pointer hover:border-primary transition-colors flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Готовность тела</CardTitle>
                            <BatteryFull className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                            <div>
                                <div className="text-2xl font-bold">{bodyBattery}%</div>
                                <p className="text-xs text-muted-foreground">Оценка запаса энергии вашего тела</p>
                            </div>
                            <Progress value={bodyBattery} className="mt-4 h-2" indicatorClassName={getReadinessColor(bodyBattery)} />
                        </CardContent>
                    </Card>
                    <Card onClick={() => handleCardClick('recovery')} className="cursor-pointer hover:border-primary transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Время восстановления</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{recoveryTime} часов</div>
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
            </TabsContent>
            <TabsContent value="composition">
                <BodyCompositionPage />
            </TabsContent>
        </Tabs>
    );
}
