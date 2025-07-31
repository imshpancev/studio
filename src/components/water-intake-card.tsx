
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, Minus, Plus, Loader2 } from 'lucide-react';
import { Progress } from './ui/progress';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { getWaterIntake, updateWaterIntake } from '@/services/nutritionService';

export function WaterIntakeCard({ date, disabled = false }: { date: string, disabled?: boolean }) {
  const [consumed, setConsumed] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(2700);
  const [isLoading, setIsLoading] = useState(true);
  const user = auth.currentUser;
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        return;
    };
    async function fetchData() {
        setIsLoading(true);
        try {
            const data = await getWaterIntake(user.uid, date);
            setConsumed(data.consumed);
            setDailyGoal(data.goal);
        } catch(e) {
            // It's fine if it doesn't exist, will be created on update
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [user, date]);


  const progress = (consumed / dailyGoal) * 100;

  const handleAddWater = async (amount: number) => {
    if (!user || disabled) return;
    const newConsumed = Math.max(0, consumed + amount);
    setConsumed(newConsumed); // Optimistic update
    try {
        await updateWaterIntake(user.uid, date, newConsumed, dailyGoal);
        if (amount > 0) {
            toast({
                title: `+${amount} мл воды добавлено!`,
                description: `Выпито: ${newConsumed} / ${dailyGoal} мл`,
            });
        }
    } catch(e) {
        toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось сохранить данные о воде.' });
        setConsumed(c => c - amount); // Revert on failure
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Потребление воды</CardTitle>
        <Droplets className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        {isLoading ? (
            <div className='flex items-center justify-center py-8'>
                <Loader2 className="h-6 w-6 animate-spin"/>
            </div>
        ) : (
            <>
                <div>
                  <div className="text-2xl font-bold">{(consumed / 1000).toFixed(2)} л</div>
                  <p className="text-xs text-muted-foreground">
                    Цель: {(dailyGoal / 1000).toFixed(2)} л в день
                  </p>
                </div>
                <div className="mt-4 space-y-4">
                    <Progress value={progress} className="h-3" />
                    <div className="flex justify-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleAddWater(-250)} disabled={disabled}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" onClick={() => handleAddWater(250)} disabled={disabled}>+250 мл</Button>
                        <Button variant="outline" onClick={() => handleAddWater(500)} disabled={disabled}>+500 мл</Button>
                        <Button variant="outline" size="icon" onClick={() => handleAddWater(250)} disabled={disabled}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </>
        )}
      </CardContent>
    </Card>
  );
}
