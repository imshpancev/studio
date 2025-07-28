
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Dumbbell, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const chartData = [
  { date: '2024-07-22', value: 68.1 },
  { date: '2024-07-23', value: 68.2 },
  { date: '2024-07-24', value: 68.2 },
  { date: '2024-07-25', value: 68.3 },
  { date: '2024-07-26', value: 68.4 },
  { date: '2024-07-27', value: 68.3 },
  { date: '2024-07-28', value: 68.4 },
];

const chartConfig = {
  value: {
    label: 'Мышцы (%)',
    color: 'hsl(var(--chart-2))',
  },
};

export default function MuscleMassPage() {
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
            <div className="p-3 rounded-full bg-green-500/10">
                <Dumbbell className="h-8 w-8 text-green-500" />
            </div>
            <div>
                 <CardTitle className="text-3xl">Мышечная масса</CardTitle>
                 <CardDescription className="text-lg text-green-500 font-bold">68.4% (Норма)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-muted-foreground">
                Мышечная масса включает в себя скелетные мышцы, гладкие мышцы (например, сердечную и пищеварительную) и воду, содержащуюся в них. Увеличение мышечной массы ускоряет метаболизм, что помогает сжигать больше калорий даже в состоянии покоя.
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

             <Alert>
                <Info className="h-4 w-4"/>
                <AlertTitle>Совет</AlertTitle>
                <AlertDescription>
                    Для набора мышечной массы сосредоточьтесь на силовых тренировках и потребляйте достаточное количество белка (около 1.6-2.2 г на кг веса тела).
                </AlertDescription>
            </Alert>

             <div>
                <h3 className="font-semibold mb-2">Нормы для мужчин:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li><span className='font-bold text-foreground'>Низкая:</span> &lt;65%</li>
                    <li><span className='font-bold text-foreground'>Нормальная:</span> 65 - 85%</li>
                    <li><span className='font-bold text-foreground'>Высокая:</span> >85%</li>
                </ul>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
