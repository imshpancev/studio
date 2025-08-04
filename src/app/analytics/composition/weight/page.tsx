
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scale, TrendingUp, TrendingDown, Info, Loader2 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect, useState } from 'react';
import { getUserProfile } from '@/services/userService';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';


const chartData = [
  { date: '2024-07-22', value: 99.8 },
  { date: '2024-07-23', value: 99.6 },
  { date: '2024-07-24', value: 99.7 },
  { date: '2024-07-25', value: 99.5 },
  { date: '2024-07-26', value: 99.4 },
  { date: '2024-07-27', value: 99.3 },
  { date: '2024-07-28', value: 99.3 },
];

const chartConfig = {
  value: {
    label: 'Вес (кг)',
    color: 'hsl(var(--chart-1))',
  },
};

export default function WeightPage() {
  const router = useRouter();
  const { toast } = useToast();
  const user = auth.currentUser;
  const [weight, setWeight] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        return;
    }
    async function fetchData() {
        try {
            const profile = await getUserProfile(user.uid);
            setWeight(profile?.weight || null);
        } catch (e) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить данные о весе.' });
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [user, toast]);
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Button variant="ghost" onClick={() => router.push('/?tab=analytics')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к Аналитике
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
                <Scale className="h-8 w-8 text-primary" />
            </div>
            <div>
                 <CardTitle className="text-3xl">Вес тела</CardTitle>
                 <CardDescription className="text-lg text-primary font-bold">{weight ?? 'N/A'} кг</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-muted-foreground">
                Отслеживание веса является одним из основных способов контроля за физической формой. Регулярные измерения помогают понять, как диета и тренировки влияют на ваше тело. Важно обращать внимание на долгосрочные тенденции, а не на ежедневные колебания.
            </p>

             <Card>
                <CardHeader>
                    <CardTitle>Динамика за неделю</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[200px] w-full">
                        <AreaChart
                            data={chartData}
                            margin={{ left: 0, right: 20 }}
                            >
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
                    Взвешивайтесь утром, натощак и после посещения туалета, чтобы получать наиболее точные и сопоставимые данные.
                </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
