
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Activity, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from 'recharts';
import { Badge } from '@/components/ui/badge';

const chartData = [
  { date: 'Неделя -3', acute: 250, chronic: 200, ratio: 1.25 },
  { date: 'Неделя -2', acute: 300, chronic: 225, ratio: 1.33 },
  { date: 'Неделя -1', acute: 280, chronic: 250, ratio: 1.12 },
  { date: 'Эта неделя', acute: 350, chronic: 275, ratio: 1.27 },
];

const chartConfig = {
  acute: {
    label: 'Острая нагрузка',
    color: 'hsl(var(--chart-2))',
  },
  chronic: {
    label: 'Хроническая нагрузка',
    color: 'hsl(var(--chart-1))',
  },
};

export default function TrainingLoadPage() {
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
            <div className="p-3 rounded-full bg-primary/10">
                <Activity className="h-8 w-8 text-primary" />
            </div>
            <div>
                 <CardTitle className="text-3xl">Тренировочная нагрузка</CardTitle>
                 <CardDescription className="text-lg">Соотношение острой/хронической нагрузки: <Badge variant="default" className='text-lg'>1.27 (Оптимально)</Badge></CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-muted-foreground">
                Этот показатель помогает сбалансировать вашу нагрузку, чтобы максимизировать прогресс и минимизировать риск травм. Он сравнивает вашу недавнюю (острую) нагрузку за 7 дней с долгосрочной (хронической) нагрузкой за 28 дней.
            </p>

             <Card>
                <CardHeader>
                    <CardTitle>Динамика за 4 недели</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                       <BarChart data={chartData} margin={{ top: 20 }}>
                           <CartesianGrid vertical={false} />
                           <XAxis dataKey="date" tickLine={false} axisLine={false} />
                           <YAxis tickLine={false} axisLine={false} />
                           <ChartTooltip content={<ChartTooltipContent />} />
                           <Bar dataKey="chronic" fill="var(--color-chronic)" radius={[4, 4, 0, 0]} />
                           <Bar dataKey="acute" fill="var(--color-acute)" radius={[4, 4, 0, 0]} />
                       </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div>
                <h3 className="font-semibold mb-2">Ключевые зоны:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 bg-muted/50">
                        <div className="flex items-center gap-3">
                            <TrendingDown className="h-6 w-6 text-gray-500" />
                            <div>
                                <p className="font-bold">Недотренированность (&lt;0.8)</p>
                                <p className="text-sm">Вы теряете форму. Повысьте нагрузку, чтобы стимулировать рост.</p>
                            </div>
                        </div>
                    </Card>
                     <Card className="p-4 bg-green-500/10">
                        <div className="flex items-center gap-3">
                           <Target className="h-6 w-6 text-green-500" />
                            <div>
                                <p className="font-bold">Оптимальная зона (0.8 - 1.3)</p>
                                <p className="text-sm">Идеальный баланс между нагрузкой и восстановлением для максимального прогресса.</p>
                            </div>
                        </div>
                    </Card>
                     <Card className="p-4 bg-red-500/10">
                        <div className="flex items-center gap-3">
                           <TrendingUp className="h-6 w-6 text-red-500" />
                            <div>
                                <p className="font-bold">Перегрузка (&gt;1.3)</p>
                                <p className="text-sm">Высокий риск травмы. Убедитесь, что даете телу достаточно времени на восстановление.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
