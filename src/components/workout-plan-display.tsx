'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { GenerateWorkoutPlanOutput } from '@/ai/flows/generate-workout-plan';
import { ScrollArea } from './ui/scroll-area';
import { PlayCircle } from 'lucide-react';

type WorkoutPlanDisplayProps = {
  data: GenerateWorkoutPlanOutput;
};

interface Exercise {
  name: string;
  details: string;
}

interface DayPlan {
  day: string;
  title: string;
  exercises: Exercise[];
}

const parseWorkoutPlan = (plan: string): DayPlan[] => {
  const daySections = plan.split(/\*\*(День \d+:.*?)\*\*/).filter(Boolean);
  const structuredPlan: DayPlan[] = [];

  for (let i = 0; i < daySections.length; i += 2) {
    const header = daySections[i];
    const content = daySections[i + 1];

    if (header && content) {
      const dayMatch = header.match(/День \d+/);
      const day = dayMatch ? dayMatch[0] : `День ${structuredPlan.length + 1}`;
      const title = header.replace(/День \d+:/, '').trim();

      const exerciseItems = content.split('* ').filter(item => item.trim() !== '');
      const exercises: Exercise[] = exerciseItems.map(item => {
        const parts = item.split(':');
        const name = parts[0]?.trim() || 'Упражнение';
        const details = parts.slice(1).join(':').trim();
        return { name, details };
      });

      structuredPlan.push({ day, title, exercises });
    }
  }

  if (structuredPlan.length === 0 && plan.length > 0) {
    return [{ day: 'Полный план', title: 'Ваш план тренировок', exercises: [{ name: 'Детали', details: plan }] }];
  }

  return structuredPlan;
};

export function WorkoutPlanDisplay({ data }: WorkoutPlanDisplayProps) {
  const structuredPlan = parseWorkoutPlan(data.workoutPlan);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Ваш персональный план</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[70vh] pr-4">
          <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
            {structuredPlan.map((dayPlan, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border-b-0">
                <Card className="overflow-hidden rounded-lg">
                  <AccordionTrigger className="p-4 hover:no-underline bg-muted/50 data-[state=open]:bg-muted">
                    <div className="text-left">
                      <p className="font-bold text-lg text-primary">{dayPlan.day}</p>
                      <p className="text-muted-foreground">{dayPlan.title}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 border-t space-y-4">
                      {dayPlan.exercises.map((exercise, exIndex) => (
                        <div key={exIndex} className="flex gap-4 items-start">
                          <div className="relative group w-[100px] h-[100px] flex-shrink-0">
                            <Image
                              src={`https://placehold.co/100x100.png`}
                              data-ai-hint="exercise fitness"
                              alt={exercise.name}
                              width={100}
                              height={100}
                              className="rounded-lg object-cover w-full h-full"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                              <PlayCircle className="h-8 w-8 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-base">{exercise.name}</h4>
                            <p className="text-muted-foreground text-sm">{exercise.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
