
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity, TrendingUp, Calendar, Filter, Dumbbell } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, BarChart, Line, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, PieChart } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allSports, Sport } from "@/lib/workout-data";

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

export function DashboardPage() {
    const [activeSport, setActiveSport] = useState('all');

    const filteredPieData = activeSport === 'all' 
        ? allPieChartData
        : allPieChartData.filter(item => item.name === activeSport);

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Дашборд</h2>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select defaultValue="last_7_days">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Фильтр периода" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="last_7_days">Последние 7 дней</SelectItem>
                            <SelectItem value="last_30_days">Последние 30 дней</SelectItem>
                            <SelectItem value="last_3_months">Последние 3 месяца</SelectItem>
                            <SelectItem value="all_time">За все время</SelectItem>
                        </SelectContent>
                    </Select>
                     <Select value={activeSport} onValueChange={setActiveSport}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Фильтр по спорту" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Все виды спорта</SelectItem>
                            {allSports.map(sport => (
                                <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Calendar className="h-5 w-5" />
                            Активность за неделю
                        </CardTitle>
                        <CardDescription>Минуты тренировок по дням</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={barChartConfig} className="h-[200px] w-full">
                            <ResponsiveContainer>
                                <BarChart data={weeklyActivityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="day" tickLine={false} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Bar dataKey="running" stackId="a" fill="var(--color-running)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="gym" stackId="a" fill="var(--color-gym)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="yoga" stackId="a" fill="var(--color-yoga)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="cycling" stackId="a" fill="var(--color-cycling)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="swimming" stackId="a" fill="var(--color-swimming)" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="home" stackId="a" fill="var(--color-home)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <TrendingUp className="h-5 w-5" />
                            Прогресс
                        </CardTitle>
                        <CardDescription>Динамика веса и выносливости</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={lineChartConfig} className="h-[200px] w-full">
                             <ResponsiveContainer>
                                <LineChart data={progressData} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="left" tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} />
                                    <Tooltip content={<ChartTooltipContent hideLabel />} />
                                    <ChartLegend content={<ChartLegendContent />} />
                                    <Line type="monotone" dataKey="weight" stroke="var(--color-weight)" yAxisId="left" />
                                    <Line type="monotone" dataKey="endurance" stroke="var(--color-endurance)" yAxisId="right" />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Activity className="h-5 w-5" />
                            Виды активностей
                        </CardTitle>
                        <CardDescription>Соотношение времени по видам спорта</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[240px] flex flex-col items-center justify-center">
                        <ChartContainer config={pieChartConfig} className="mx-auto aspect-square h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip content={<ChartTooltipContent nameKey="name" />} />
                                    <Pie data={filteredPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} labelLine={false} paddingAngle={2}>
                                        {filteredPieData.map((entry) => (
                                            <Cell key={`cell-${entry.name}`} fill={pieChartConfig[entry.name as Sport]?.color || '#8884d8'} />
                                        ))}
                                    </Pie>
                                    <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    
