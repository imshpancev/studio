

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, Calendar, Filter, Dumbbell, Clock, Footprints, Target, Zap, TrendingDown, Bike, Waves, BarChart2, Flame, Trophy } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, BarChart, Line, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, PieChart, Area, AreaChart } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allSports, Sport } from "@/lib/workout-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { historyItems } from '@/app/history/page';
import { RunIcon } from './icons/run-icon';


const weeklyActivityData = [
  { day: 'Пн', running: 30, gym: 45, yoga: 0, cycling: 0, swimming: 0, home: 20 },
  { day: 'Вт', running: 0, gym: 60, yoga: 0, cycling: 75, swimming: 30, home: 0 },
  { day: 'Ср', running: 45, gym: 0, yoga: 30, cycling: 0, swimming: 0, home: 0 },
  { day: 'Чт', running: 0, gym: 55, yoga: 0, cycling: 0, swimming: 45, home: 25 },
  { day: 'Пт', running: 60, gym: 0, yoga: 0, cycling: 90, swimming: 0, home: 0 },
  { day: 'Сб', running: 90, gym: 0, yoga: 60, cycling: 120, swimming: 60, home: 0 },
  { day: 'Вс', running: 0, gym: 0, yoga: 0, cycling: 0, swimming: 0, home: 0 },
];

const progressData = [
  { month: 'Янв', weight: 85, endurance: 5.0 },
  { month: 'Фев', weight: 84, endurance: 5.5 },
  { month: 'Мар', weight: 83, endurance: 6.0 },
  { month: 'Апр', weight: 82.5, endurance: 6.2 },
  { month: 'Май', weight: 81, endurance: 6.8 },
  { month: 'Июн', weight: 80, endurance: 7.5 },
];

const allPieChartData = [
    { name: Sport.Running, value: 450, fill: 'var(--color-running)' },
    { name: Sport.Gym, value: 300, fill: 'var(--color-gym)' },
    { name: Sport.Yoga, value: 150, fill: 'var(--color-yoga)' },
    { name: Sport.Swimming, value: 100, fill: 'var(--color-swimming)' },
    { name: Sport.Cycling, value: 280, fill: 'var(--color-cycling)' },
    { name: Sport.Home, value: 120, fill: 'var(--color-home)'},
];

const pieChartConfig = {
    [Sport.Running]: { label: Sport.Running, color: 'hsl(var(--chart-1))' },
    [Sport.Gym]: { label: Sport.Gym, color: 'hsl(var(--chart-2))' },
    [Sport.Yoga]: { label: Sport.Yoga, color: 'hsl(var(--chart-3))' },
    [Sport.Swimming]: { label: Sport.Swimming, color: 'hsl(var(--chart-4))' },
    [Sport.Cycling]: { label: Sport.Cycling, color: 'hsl(var(--chart-5))' },
    [Sport.Home]: { label: Sport.Home, color: 'hsl(var(--chart-1))' },
    [Sport.Triathlon]: { label: Sport.Triathlon, color: 'hsl(var(--chart-2))' },
};

const barChartConfig = {
  running: { label: 'Бег', color: 'hsl(var(--chart-1))' },
  gym: { label: 'Зал', color: 'hsl(var(--chart-2))' },
  yoga: { label: 'Йога', color: 'hsl(var(--chart-3))' },
  cycling: { label: 'Велоспорт', color: 'hsl(var(--chart-5))' },
  swimming: { label: 'Плавание', color: 'hsl(var(--chart-4))' },
  home: { label: 'Дома', color: 'hsl(var(--chart-1))' },
};

const lineChartConfig = {
    weight: { label: 'Вес (кг)', color: 'hsl(var(--chart-1))' },
    endurance: { label: 'Выносливость (км)', color: 'hsl(var(--chart-2))' },
}

export function DashboardPage({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
    const router = useRouter();
    const [activeSport, setActiveSport] = useState('all');
    const [timePeriod, setTimePeriod] = useState('week');

    const filteredPieData = activeSport === 'all' 
        ? allPieChartData
        : allPieChartData.filter(item => item.name === activeSport);
    
    const totalTime = weeklyActivityData.reduce((acc, day) => acc + day.running + day.gym + day.yoga + day.cycling + day.swimming + day.home, 0);

    const handleRecordClick = () => {
        setActiveTab('records');
    }


    return (
        <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Дашборд</h2>
                 <Select value={timePeriod} onValueChange={setTimePeriod}>
                    <SelectTrigger className="w-[180px]">
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
                <CardHeader>
                    <CardTitle>Итоги за {timePeriod === 'week' ? 'неделю' : timePeriod === 'month' ? 'месяц' : 'год'}</CardTitle>
                    <CardDescription>Обзор вашей активности.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Общее время</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{(totalTime / 60).toFixed(1)} ч</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-500">+15%</span> по сравнению с прошлым периодом
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
                            <div className="text-2xl font-bold">56,432</div>
                            <p className="text-xs text-muted-foreground">
                                Среднее: 8,061/день
                            </p>
                        </CardContent>
                    </Card>
                     <Card className="cursor-pointer hover:border-primary" onClick={handleRecordClick}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Личные рекорды</CardTitle>
                            <Trophy className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                             <div className="text-2xl font-bold">5 новых</div>
                            <p className="text-xs text-muted-foreground">
                               Нажмите, чтобы посмотреть все рекорды
                            </p>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>

             <Tabs defaultValue="running" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="running" className='gap-2'><RunIcon className="h-5 w-5" />Бег</TabsTrigger>
                    <TabsTrigger value="cycling" className='gap-2'><Bike className="h-5 w-5" />Велоспорт</TabsTrigger>
                    <TabsTrigger value="swimming" className='gap-2'><Waves className="h-5 w-5" />Плавание</TabsTrigger>
                </TabsList>
                <TabsContent value="running">
                    <Card className='mt-2'>
                         <CardHeader>
                            <CardTitle>Аналитика по бегу ({timePeriod === 'week' ? 'Неделя' : timePeriod === 'month' ? 'Месяц' : 'Год'})</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <div><span className='font-bold'>Дистанция:</span> 25.5 км <span className='text-sm text-green-500'>(+3 км)</span></div>
                             <div><span className='font-bold'>Средний темп:</span> 6:05 мин/км <span className='text-sm text-green-500'>(-10с)</span></div>
                            <div><span className='font-bold'>Средний пульс:</span> 158 уд/мин <span className='text-sm text-red-500'>(+2)</span></div>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="cycling">
                    <Card className='mt-2'>
                        <CardHeader>
                            <CardTitle>Аналитика по велоспорту ({timePeriod === 'week' ? 'Неделя' : timePeriod === 'month' ? 'Месяц' : 'Год'})</CardTitle>
                        </CardHeader>
                         <CardContent className="grid gap-4 md:grid-cols-3">
                            <div><span className='font-bold'>Дистанция:</span> 80.2 км <span className='text-sm text-green-500'>(+10 км)</span></div>
                            <div><span className='font-bold'>Средняя скорость:</span> 28.5 км/ч <span className='text-sm text-green-500'>(+1.2 км/ч)</span></div>
                            <div><span className='font-bold'>Средний пульс:</span> 145 уд/мин <span className='text-sm text-gray-500'>(-1)</span></div>
                        </CardContent>
                    </Card>
                </TabsContent>
                 <TabsContent value="swimming">
                    <Card className='mt-2'>
                         <CardHeader>
                            <CardTitle>Аналитика по плаванию ({timePeriod === 'week' ? 'Неделя' : timePeriod === 'month' ? 'Месяц' : 'Год'})</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-3">
                            <div><span className='font-bold'>Дистанция:</span> 3.5 км <span className='text-sm text-red-500'>(-0.5 км)</span></div>
                            <div><span className='font-bold'>Средний темп:</span> 2:15/100м <span className='text-sm text-red-500'>(+5с)</span></div>
                            <div><span className='font-bold'>Средний пульс:</span> 138 уд/мин <span className='text-sm text-gray-500'>(+0)</span></div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                 <Card className="lg:col-span-3">
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
                                <YAxis tickLine={false} axisLine={false} />
                                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                <ChartLegend content={<ChartLegendContent />} />
                                <Bar dataKey="running" stackId="a" fill="var(--color-running)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="gym" stackId="a" fill="var(--color-gym)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="yoga" stackId="a" fill="var(--color-yoga)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="cycling" stackId="a" fill="var(--color-cycling)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="swimming" stackId="a" fill="var(--color-swimming)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="home" stackId="a" fill="var(--color-home)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                 <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Activity className="h-5 w-5" />
                                Виды активностей
                            </CardTitle>
                            <CardDescription>Соотношение времени</CardDescription>
                        </div>
                         <Select value={activeSport} onValueChange={setActiveSport}>
                            <SelectTrigger className="w-[160px] text-xs">
                                <SelectValue placeholder="Фильтр по спорту" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Все виды</SelectItem>
                                {allSports.map(sport => (
                                    <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </CardHeader>
                    <CardContent className="h-[250px] flex flex-col items-center justify-center">
                       <ChartContainer config={pieChartConfig} className="mx-auto aspect-square h-full">
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                <Pie data={filteredPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} labelLine={false} paddingAngle={2}>
                                    {filteredPieData.map((entry) => (
                                        <Cell key={`cell-${entry.name}`} fill={pieChartConfig[entry.name as Sport]?.color || '#8884d8'} />
                                    ))}
                                </Pie>
                                <ChartLegend
                                    content={<ChartLegendContent nameKey="name" className="flex-wrap" />}
                                    />
                            </PieChart>
                       </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
