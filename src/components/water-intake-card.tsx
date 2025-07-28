
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Droplets, Minus, Plus } from 'lucide-react';
import { Progress } from './ui/progress';
import { useToast } from '@/hooks/use-toast';

export function WaterIntakeCard() {
  const [consumed, setConsumed] = useState(1250); // in ml
  const dailyGoal = 2700; // in ml, could be calculated based on user data
  const { toast } = useToast();

  const progress = (consumed / dailyGoal) * 100;

  const handleAddWater = (amount: number) => {
    const newConsumed = Math.max(0, consumed + amount);
    setConsumed(newConsumed);
    if (amount > 0) {
        toast({
            title: `+${amount} мл воды добавлено!`,
            description: `Выпито: ${newConsumed} / ${dailyGoal} мл`,
        });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Потребление воды</CardTitle>
        <Droplets className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div>
          <div className="text-2xl font-bold">{(consumed / 1000).toFixed(2)} л</div>
          <p className="text-xs text-muted-foreground">
            Цель: {(dailyGoal / 1000).toFixed(2)} л в день
          </p>
        </div>
        <div className="mt-4 space-y-4">
            <Progress value={progress} className="h-3" />
            <div className="flex justify-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleAddWater(-250)}>
                    <Minus className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={() => handleAddWater(250)}>+250 мл</Button>
                <Button variant="outline" onClick={() => handleAddWater(500)}>+500 мл</Button>
                <Button variant="outline" size="icon" onClick={() => handleAddWater(250)}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
