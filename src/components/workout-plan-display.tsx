
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { GenerateWorkoutPlanOutput } from '@/ai/flows/generate-workout-plan';
import { ScrollArea } from './ui/scroll-area';
import { PlayCircle, Info, Bot, Terminal, Forward } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { Sport } from '@/lib/workout-data';

type WorkoutPlanDisplayProps = {
  data: GenerateWorkoutPlanOutput | null;
};

function findSportForWorkout(title: string): Sport {
  if (title.toLowerCase().includes('бег') || title.toLowerCase().includes('интервальная') || title.toLowerCase().includes('темповый')) return Sport.Running;
  if (title.toLowerCase().includes('силовая') || title.toLowerCase().includes('upper body') || title.toLowerCase().includes('lower body')) return Sport.Gym;
  if (title.toLowerCase().includes('йога') || title.toLowerCase().includes('сурья')) return Sport.Yoga;
  if (title.toLowerCase().includes('плавание') || title.toLowerCase().includes('техническая')) return Sport.Swimming;
  return Sport.Home;
}


export function WorkoutPlanDisplay({ data }: WorkoutPlanDisplayProps) {
  const router = useRouter();

  if (!data) {
    // This part is now handled by the parent component (MyPlanPage)
    // but kept as a fallback.
    return (
        <Card className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
            <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
                <Bot className="h-8 w-8 text-primary" />
                Ваш план, сгенерированный ИИ
            </CardTitle>
            </CardHeader>
            <CardContent>
            <p className="text-muted-foreground">
                Ваш персональный план тренировок появится здесь после его создания.
            </p>
            </CardContent>
        </Card>
    );
  }
  
  const { workoutPlan: structuredPlan } = data;

  if (!structuredPlan || !Array.isArray(structuredPlan) || structuredPlan.length === 0) {
    return (
       <Card className="h-full">
        <CardHeader>
          <CardTitle>Ошибка генерации плана</CardTitle>
        </CardHeader>
        <CardContent>
           <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Ошибка обработки</AlertTitle>
            <AlertDescription>
              Не удалось обработать план тренировок, полученный от ИИ. Возможно, предоставленных данных было недостаточно или не настроен API-ключ. Попробуйте сгенерировать его снова с более подробной информацией.
            </AlertDescription>
          </Alert>
          <p className="mt-4 text-xs text-muted-foreground">Необработанный ответ от ИИ:</p>
          <pre className="w-full mt-2 rounded-md bg-muted p-4 text-sm overflow-x-auto">
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>
    )
  }

  const handleStartWorkout = (dayPlan: any) => {
    const sport = findSportForWorkout(dayPlan.title);
    const exercisesQuery = encodeURIComponent(JSON.stringify(dayPlan.exercises));
    router.push(`/workout/${encodeURIComponent(dayPlan.day)}?sport=${encodeURIComponent(sport)}&exercises=${exercisesQuery}`);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Ваш персональный недельный план</CardTitle>
        <CardDescription>Вот ваш индивидуальный план тренировок, созданный ИИ.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[70vh] pr-4">
          <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
            {structuredPlan.map((dayPlan, index) => (
              <AccordionItem value={`item-${index}`} key={index} className="border-b-0">
                <Card className="overflow-hidden rounded-lg">
                   <div className="flex items-center justify-between p-4 bg-muted/50 data-[state=open]:bg-muted">
                      <AccordionTrigger className="p-0 hover:no-underline flex-1">
                        <div className="text-left">
                            <p className="font-bold text-lg text-primary">{dayPlan.day}</p>
                            <p className="text-muted-foreground">{dayPlan.title}</p>
                          </div>
                      </AccordionTrigger>
                      {dayPlan.exercises && dayPlan.exercises.length > 0 && dayPlan.title !== "День отдыха" && (
                         <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleStartWorkout(dayPlan)}
                            className='ml-4' // Use margin left to space it out
                          >
                           <Forward className="mr-2 h-4 w-4" /> Начать
                         </Button>
                      )}
                  </div>
                  <AccordionContent>
                    <div className="p-4 border-t space-y-4">
                      {dayPlan.exercises && dayPlan.exercises.length === 0 || dayPlan.title === "День отдыха" ? (
                        <p className='text-muted-foreground'>Запланирован отдых. Восстановление — ключ к успеху!</p>
                      ) : dayPlan.exercises.map((exercise, exIndex) => (
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
                             <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-base">{exercise.name}</h4>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p className="font-bold">Описание</p>
                                    <p>{exercise.description}</p>
                                    <p className="font-bold mt-2">Техника выполнения</p>
                                    <p>{exercise.technique}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
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
