
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, Line, Pie, Cell, ResponsiveContainer } from 'recharts';

const chartData = [
  { month: 'Январь', desktop: 186, mobile: 80 },
  { month: 'Февраль', desktop: 305, mobile: 200 },
  { month: 'Март', desktop: 237, mobile: 120 },
  { month: 'Апрель', desktop: 73, mobile: 190 },
  { month: 'Май', desktop: 209, mobile: 130 },
  { month: 'Июнь', desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: 'Силовые',
    color: 'hsl(var(--chart-1))',
  },
  mobile: {
    label: 'Кардио',
    color: 'hsl(var(--chart-2))',
  },
};

const pieChartData = [
    { name: 'Бег', value: 400, fill: 'var(--color-running)' },
    { name: 'Зал', value: 300, fill: 'var(--color-gym)' },
    { name: 'Йога', value: 300, fill: 'var(--color-yoga)' },
    { name: 'Плавание', value: 200, fill: 'var(--color-swimming)' },
];
const pieChartConfig = {
    running: { label: 'Бег', color: 'hsl(var(--chart-1))' },
    gym: { label: 'Зал', color: 'hsl(var(--chart-2))' },
    yoga: { label: 'Йога', color: 'hsl(var(--chart-3))' },
    swimming: { label: 'Плавание', color: 'hsl(var(--chart-4))' },
}

export function DashboardPage() {
    return (
        <div className="grid gap-8 md:grid-cols-2">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BarChart className="h-6 w-6" />
                        Минуты тренировок за месяц
                    </CardTitle>
                    <CardDescription>Сравнение силовых и кардио тренировок.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart accessibilityLayer data={chartData}>
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend />
                                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-6 w-6" />
                        Динамика среднего пульса
                    </CardTitle>
                    <CardDescription>Средний пульс во время тренировок за последние 6 месяцев.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <ChartLegend />
                                <Line type="monotone" dataKey="desktop" stroke="var(--color-desktop)" strokeWidth={2} />
                                <Line type="monotone" dataKey="mobile" stroke="var(--color-mobile)" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-6 w-6" />
                        Распределение активностей
                    </CardTitle>
                    <CardDescription>Соотношение различных видов тренировок.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                    <ChartContainer config={pieChartConfig} className="h-[250px]">
                        <ResponsiveContainer width={250} height={250}>
                            <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>

             <Card className="flex flex-col items-center justify-center text-center p-8">
                 <CardHeader>
                    <CardTitle>Скоро здесь будет больше аналитики!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Мы работаем над добавлением новых виджетов и отчетов.
                    </p>
                </CardContent>
            </Card>

        </div>
    );
}
