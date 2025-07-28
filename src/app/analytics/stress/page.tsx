
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HeartCrack, TrendingDown, Coffee, Moon } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartData = [
  { time: '09:00', value: 30 },
  { time: '10:00', value: 45, event: 'Встреча' },
  { time: '11:00', value: 40 },
  { time: '12:00', value: 25 },
  { time: '13:00', value: 20 },
  { time: '14:00', value: 55, event: 'Дедлайн' },
  { time: '15:00', value: 35 },
  { time: '16:00', value: 25 },
  { time: '17:00', value: 15 },
];

const chartConfig = {
  value: {
    label: 'Стресс',
    color: 'hsl(var(--chart-5))',
  },
};

export default function StressPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к Аналитике
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-orange-500/10">
                <HeartCrack className="h-8 w-8 text-orange-500" />
            </div>
            <div>
                 <CardTitle className="text-3xl">Уровень стресса</CardTitle>
                 <CardDescription className="text-lg text-orange-500 font-bold">Текущий: 25 / 100</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-muted-foreground">
                Уровень стресса измеряется на основе анализа вариабельности сердечного ритма (ВСР). Высокая ВСР обычно указывает на низкий уровень стресса и хорошую готовность к нагрузкам, в то время как низкая ВСР может сигнализировать о физическом или психологическом стрессе.
            </p>

             <Card>
                <CardHeader>
                    <CardTitle>Динамика за день</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="time"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Line
                                dataKey="value"
                                type="monotone"
                                stroke="var(--color-value)"
                                strokeWidth={2}
                                dot={true}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div>
                <h3 className="font-semibold mb-2">Факторы, влияющие на стресс:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 bg-muted/50">
                        <div className="flex items-center gap-3">
                            <TrendingDown className="h-6 w-6 text-green-500" />
                            <div>
                                <p className="font-bold">Снижают стресс</p>
                                <p className="text-sm">Отдых, медитация, хороший сон, легкая активность.</p>
                            </div>
                        </div>
                    </Card>
                     <Card className="p-4 bg-muted/50">
                        <div className="flex items-center gap-3">
                           <Coffee className="h-6 w-6 text-red-500" />
                            <div>
                                <p className="font-bold">Повышают стресс</p>
                                <p className="text-sm">Тренировки, кофеин, алкоголь, психологическое напряжение.</p>
                            </div>
                        </div>
                    </Card>
                     <Card className="p-4 bg-muted/50">
                        <div className="flex items-center gap-3">
                           <Moon className="h-6 w-6 text-blue-500" />
                            <div>
                                <p className="font-bold">Ночной стресс</p>
                                <p className="text-sm">Поздние тренировки или прием пищи могут повысить стресс во сне.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

             <div>
                <h3 className="font-semibold mb-2">Шкала уровня стресса:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li><span className='font-bold text-foreground'>0-25 (Отдых):</span> Состояние покоя.</li>
                    <li><span className='font-bold text-foreground'>26-50 (Низкий):</span> Нормальное состояние без значительных нагрузок.</li>
                    <li><span className='font-bold text-foreground'>51-75 (Средний):</span> Умеренная нагрузка или стресс.</li>
                    <li><span className='font-bold text-foreground'>76-100 (Высокий):</span> Сильный стресс, необходим отдых.</li>
                </ul>
            </div>

        </CardContent>
      </Card>
    </div>
  );
}
