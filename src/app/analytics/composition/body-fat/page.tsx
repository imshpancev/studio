
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Percent, TrendingUp, TrendingDown, Info, ShieldAlert } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const chartData = [
  { date: '2024-07-22', value: 28.2 },
  { date: '2024-07-23', value: 28.1 },
  { date: '2024-07-24', value: 28.0 },
  { date: '2024-07-25', value: 27.9 },
  { date: '2024-07-26', value: 27.8 },
  { date: '2024-07-27', value: 27.9 },
  { date: '2024-07-28', value: 27.8 },
];

const chartConfig = {
  value: {
    label: 'Жир (%)',
    color: 'hsl(var(--chart-3))',
  },
};

export default function BodyFatPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Button variant="ghost" onClick={() => router.push('/#analytics')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к Аналитике
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-orange-500/10">
                <Percent className="h-8 w-8 text-orange-500" />
            </div>
            <div>
                 <CardTitle className="text-3xl">Процент телесного жира</CardTitle>
                 <CardDescription className="text-lg text-orange-500 font-bold">27.8% (Высокий)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-muted-foreground">
                Процент жира в организме — это более точный показатель здоровья и физической формы, чем просто вес. Он показывает соотношение жировой массы ко всей массе тела. Снижение этого показателя при сохранении мышечной массы является ключевой целью для многих.
            </p>

             <Card>
                <CardHeader>
                    <CardTitle>Динамика за неделю</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <AreaChart data={chartData} margin={{ left: 0, right: 20 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                            />
                            <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tickLine={false} axisLine={false} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Area
                                dataKey="value"
                                type="natural"
                                fill="var(--color-value)"
                                fillOpacity={0.4}
                                stroke="var(--color-value)"
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>

             <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4"/>
                <AlertTitle>Рекомендация</AlertTitle>
                <AlertDescription>
                    Ваш процент жира выше нормы. Рекомендуется сочетать силовые тренировки для роста мышц с кардио-нагрузками и сбалансированной диетой для эффективного сжигания жира.
                </AlertDescription>
            </Alert>

             <div>
                <h3 className="font-semibold mb-2">Нормы для мужчин (возраст 20-39):</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li><span className='font-bold text-foreground'>Спортивный:</span> 8-14%</li>
                    <li><span className='font-bold text-foreground'>В форме:</span> 14-20%</li>
                    <li><span className='font-bold text-foreground'>Средний:</span> 20-25%</li>
                    <li><span className='font-bold text-foreground'>Ожирение:</span> >25%</li>
                </ul>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
