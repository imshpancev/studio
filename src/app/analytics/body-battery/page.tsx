
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BatteryFull, PlusCircle, MinusCircle } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartData = [
  { time: '00:00', value: 80 },
  { time: '03:00', value: 95 },
  { time: '06:00', value: 100 },
  { time: '09:00', value: 85, event: 'Тренировка' },
  { time: '12:00', value: 70 },
  { time: '15:00', value: 65 },
  { time: '18:00', value: 50, event: 'Стресс' },
  { time: '21:00', value: 60, event: 'Отдых' },
  { time: '24:00', value: 78 },
];

const chartConfig = {
  value: {
    label: 'Заряд',
    color: 'hsl(var(--chart-2))',
  },
};

export default function BodyBatteryPage() {
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
            <div className="p-3 rounded-full bg-green-500/10">
                <BatteryFull className="h-8 w-8 text-green-500" />
            </div>
            <div>
                 <CardTitle className="text-3xl">Готовность тела (Body Battery)</CardTitle>
                 <CardDescription className="text-lg text-green-500 font-bold">78%</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-muted-foreground">
                Показатель Body Battery оценивает ваш запас энергии в течение дня по шкале от 0 до 100. Он помогает понять, когда вы готовы к нагрузкам, а когда лучше отдохнуть. Высокие значения означают большой запас энергии, низкие — истощение.
            </p>

             <Card>
                <CardHeader>
                    <CardTitle>Динамика за день</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <AreaChart data={chartData} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="time"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                            />
                            <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
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

            <div>
                <h3 className="font-semibold mb-2">Основные факторы:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-muted/50">
                        <div className="flex items-center gap-3">
                            <PlusCircle className="h-6 w-6 text-green-500" />
                            <div>
                                <p className="font-bold">Что заряжает:</p>
                                <p className="text-sm">Качественный сон, периоды отдыха и релаксации, медитация.</p>
                            </div>
                        </div>
                    </Card>
                     <Card className="p-4 bg-muted/50">
                        <div className="flex items-center gap-3">
                           <MinusCircle className="h-6 w-6 text-red-500" />
                            <div>
                                <p className="font-bold">Что разряжает:</p>
                                <p className="text-sm">Физические нагрузки, стресс, умственная работа, плохое самочувствие.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

             <div>
                <h3 className="font-semibold mb-2">Как интерпретировать:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li><span className='font-bold text-foreground'>80-100:</span> Отличный запас энергии. Идеально для тяжелых тренировок.</li>
                    <li><span className='font-bold text-foreground'>50-79:</span> Хороший уровень. Подходит для умеренных и большинства тяжелых нагрузок.</li>
                    <li><span className='font-bold text-foreground'>25-49:</span> Низкий уровень. Рекомендуется легкая тренировка или отдых.</li>
                    <li><span className='font-bold text-foreground'>0-24:</span> Истощение. Необходимо восстановление и сон.</li>
                </ul>
            </div>

        </CardContent>
      </Card>
    </div>
  );
}
