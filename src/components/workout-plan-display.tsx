'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { GenerateWorkoutPlanOutput } from '@/ai/flows/generate-workout-plan';
import { ScrollArea } from './ui/scroll-area';
import { PlayCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Terminal } from 'lucide-react';

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

const parseWorkoutPlan = (plan: string): DayPlan[] | null => {
  try {
    const parsed = JSON.parse(plan);
    // Basic validation to ensure it's an array of objects with expected keys.
    if (Array.isArray(parsed) && parsed.every(day => day.day && day.title && Array.isArray(day.exercises))) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.error("Failed to parse workout plan JSON:", error);
    return null;
  }
};

export function WorkoutPlanDisplay({ data }: WorkoutPlanDisplayProps) {
  const structuredPlan = parseWorkoutPlan(data.workoutPlan);

  if (!structuredPlan) {
    return (
       <Card className="h-full">
        <CardHeader>
          <CardTitle>Ваш персональный план</CardTitle>
        </CardHeader>
        <CardContent>
           <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Ошибка обработки</AlertTitle>
            <AlertDescription>
              Не удалось обработать план тренировок, полученный от ИИ. Попробуйте сгенерировать его снова.
            </AlertDescription>
          </Alert>
          <p className="mt-4 text-xs text-muted-foreground">Необработанный ответ:</p>
          <pre className="w-full mt-2 rounded-md bg-muted p-4 text-sm overflow-x-auto">
            <code>{data.workoutPlan}</code>
          </pre>
        </CardContent>
      </Card>
    )
  }

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
