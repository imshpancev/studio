
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Smile, Activity, Moon, HeartPulse } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

// TODO: Replace with real data from a service (e.g., fetching daily readiness history)
const chartData = [
  { date: '2024-07-22', readiness: 75 },
  { date: '2024-07-23', readiness: 82 },
  { date: '2024-07-24', readiness: 78 },
  { date: '2024-07-25', readiness: 65 },
  { date: '2024-07-26', readiness: 88 },
  { date: '2024-07-27', readiness: 92 },
  { date: '2024-07-28', readiness: 85 },
];

const chartConfig = {
  readiness: {
    label: 'Готовность',
    color: 'hsl(var(--chart-2))',
  },
};

export default function ReadinessDetailPage() {
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
                <Smile className="h-8 w-8 text-primary" />
            </div>
            <div>
                 <CardTitle className="text-3xl">Готовность к тренировке</CardTitle>
                 <CardDescription className="text-lg text-primary font-bold">88%</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-muted-foreground">
                Этот показатель оценивает, насколько ваше тело готово к нагрузкам сегодня. Он рассчитывается на основе комбинации ключевых факторов: качества вашего сна, вариабельности сердечного ритма (ВСР) и недавней тренировочной нагрузки. Высокий показатель готовности означает, что вы хорошо восстановились и можете провести интенсивную тренировку. Низкий — сигнализирует о необходимости легкой нагрузки или дополнительного отдыха.
            </p>

             <Card>
                <CardHeader>
                    <CardTitle>Динамика за неделю</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <AreaChart
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                            >
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => new Date(value).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                            />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                            <Area
                                dataKey="readiness"
                                type="natural"
                                fill="var(--color-readiness)"
                                fillOpacity={0.4}
                                stroke="var(--color-readiness)"
                            />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div>
                <h3 className="font-semibold mb-2">Ключевые факторы:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 bg-muted/50">
                        <div className="flex items-center gap-3">
                            <Moon className="h-6 w-6 text-blue-500" />
                            <div>
                                <p className="font-bold">Сон</p>
                                <p className="text-sm">7.5 часов (Качество: 85%)</p>
                            </div>
                        </div>
                    </Card>
                     <Card className="p-4 bg-muted/50">
                        <div className="flex items-center gap-3">
                           <HeartPulse className="h-6 w-6 text-red-500" />
                            <div>
                                <p className="font-bold">ВСР (HRV)</p>
                                <p className="text-sm">45 мс (Стабильно)</p>
                            </div>
                        </div>
                    </Card>
                     <Card className="p-4 bg-muted/50">
                        <div className="flex items-center gap-3">
                           <Activity className="h-6 w-6 text-orange-500" />
                            <div>
                                <p className="font-bold">Нагрузка</p>
                                <p className="text-sm">Оптимальная</p>
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

    
