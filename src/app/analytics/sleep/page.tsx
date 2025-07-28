
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Moon, Bed, TrendingUp, Loader2 } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { getUserProfile, UserProfile } from '@/services/userService';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';


const chartConfig = {
  duration: {
    label: 'Длительность (ч)',
    color: 'hsl(var(--chart-1))',
  },
  quality: {
    label: 'Качество (%)',
    color: 'hsl(var(--chart-2))',
  }
};

export default function SleepDetailPage() {
  const router = useRouter();
  const { toast } = useToast();
  const user = auth.currentUser;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        return;
    }
    async function fetchData() {
        try {
            const userProfile = await getUserProfile(user!.uid, user!.email || '');
            setProfile(userProfile);
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Ошибка',
                description: 'Не удалось загрузить данные о сне.',
            });
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [user, toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const sleepData = profile?.sleepData || [];
  const sleepPhases = profile?.sleepPhases || { deep: 0, light: 0, rem: 0 };
  const avgSleepDuration = profile?.avgSleepDuration || 0;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к Аналитике
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-blue-500/10">
                <Moon className="h-8 w-8 text-blue-500" />
            </div>
            <div>
                 <CardTitle className="text-3xl">Анализ Сна</CardTitle>
                 <CardDescription className="text-lg">Среднее за неделю: <span className="text-primary font-bold">{avgSleepDuration} часов</span></CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-muted-foreground">
                Качественный сон — один из важнейших факторов восстановления и прогресса в тренировках. На этом экране вы можете отслеживать продолжительность и качество вашего сна. Система анализирует фазы сна (легкий, глубокий, быстрый) и вашу активность ночью, чтобы дать комплексную оценку.
            </p>

             <Card>
                <CardHeader>
                    <CardTitle>Динамика за неделю</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                       <BarChart data={sleepData} margin={{ top: 20 }}>
                           <CartesianGrid vertical={false} />
                           <XAxis dataKey="date" tickLine={false} axisLine={false} />
                           <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tickLine={false} axisLine={false} label={{ value: 'Часы', angle: -90, position: 'insideLeft' }} />
                           <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tickLine={false} axisLine={false} label={{ value: 'Качество (%)', angle: -90, position: 'insideRight' }} />
                           <ChartTooltip content={<ChartTooltipContent />} />
                           <Bar dataKey="duration" fill="var(--color-duration)" yAxisId="left" radius={[4, 4, 0, 0]} />
                           <Bar dataKey="quality" fill="var(--color-quality)" yAxisId="right" radius={[4, 4, 0, 0]} />
                       </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div>
                <h3 className="font-semibold mb-2">Фазы сна (среднее за ночь):</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Глубокий сон</span>
                            <span className="text-sm font-medium text-muted-foreground">{(avgSleepDuration * (sleepPhases.deep / 100)).toFixed(1)} ч ({sleepPhases.deep}%)</span>
                        </div>
                        <Progress value={sleepPhases.deep} indicatorClassName="bg-indigo-500" />
                    </div>
                     <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Легкий сон</span>
                            <span className="text-sm font-medium text-muted-foreground">{(avgSleepDuration * (sleepPhases.light / 100)).toFixed(1)} ч ({sleepPhases.light}%)</span>
                        </div>
                        <Progress value={sleepPhases.light} indicatorClassName="bg-blue-500" />
                    </div>
                     <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Быстрый сон (REM)</span>
                            <span className="text-sm font-medium text-muted-foreground">{(avgSleepDuration * (sleepPhases.rem / 100)).toFixed(1)} ч ({sleepPhases.rem}%)</span>
                        </div>
                        <Progress value={sleepPhases.rem} indicatorClassName="bg-purple-500" />
                    </div>

                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
