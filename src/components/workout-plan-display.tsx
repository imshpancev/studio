
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { GenerateWorkoutPlanOutput } from '@/ai/flows/generate-workout-plan';
import { ScrollArea } from './ui/scroll-area';
import { PlayCircle, Info, Bot, Terminal, Forward, Calendar, Target, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { Sport } from '@/lib/workout-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Skeleton } from './ui/skeleton';


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

const handleFinishPlan = () => {
  // This would typically involve a state update in the parent component
  // For now, we can just log it and potentially clear it from localStorage
  console.log("Plan finished");
  localStorage.removeItem('workoutPlan');
  localStorage.removeItem('workoutPlanInput');
  // In a real app, you'd probably call a prop function like onFinishPlan()
  window.location.reload(); // Simple way to reset state for demo
};


export function WorkoutPlanDisplay({ data }: WorkoutPlanDisplayProps) {
  const router = useRouter();
  const [currentWeek, setCurrentWeek] = useState(0);

  if (!data) {
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
  
  const { planTitle, workoutPlan: structuredPlan } = data;

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

  const selectedWeek = structuredPlan[currentWeek];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                 <CardTitle>{planTitle}</CardTitle>
                <CardDescription>Ваш персональный многонедельный план тренировок.</CardDescription>
            </div>
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Завершить план
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Завершить весь план?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Это действие завершит и удалит ваш текущий план тренировок. Вы сможете сгенерировать новый.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={handleFinishPlan}>Завершить план</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={String(currentWeek)} onValueChange={(val) => setCurrentWeek(Number(val))} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <Button onClick={() => setCurrentWeek(w => w - 1)} disabled={currentWeek === 0} variant="outline" size="icon"><ChevronLeft/></Button>
            <TabsList>
                {structuredPlan.map((week, index) => (
                    <TabsTrigger key={index} value={String(index)}>Неделя {week.week}</TabsTrigger>
                ))}
            </TabsList>
             <Button onClick={() => setCurrentWeek(w => w + 1)} disabled={currentWeek === structuredPlan.length - 1} variant="outline" size="icon"><ChevronRight/></Button>
          </div>
            
            {selectedWeek ? (
                <>
                    <div className="my-4 p-4 border rounded-lg bg-muted/50">
                        <h3 className="font-semibold flex items-center gap-2"><Target className="h-5 w-5 text-primary"/>Цель на неделю:</h3>
                        <p className="text-muted-foreground">{selectedWeek.weekGoal}</p>
                    </div>

                    <ScrollArea className="h-[60vh] pr-4">
                      <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
                        {selectedWeek.days && selectedWeek.days.map((dayPlan, index) => (
                          <AccordionItem value={`item-${index}`} key={index} className="border-b-0">
                            <Card className="overflow-hidden rounded-lg">
                               <AccordionTrigger className="p-4 hover:no-underline flex justify-between items-center w-full bg-muted/50 data-[state=open]:bg-muted">
                                    <div className="text-left">
                                        <p className="font-bold text-lg text-primary">{dayPlan.day}</p>
                                        <p className="text-muted-foreground">{dayPlan.title}</p>
                                    </div>
                               </AccordionTrigger>
                              <AccordionContent>
                                <div className="p-4 border-t space-y-4">
                                    {dayPlan.description && (
                                         <Alert>
                                            <AlertDescription>{dayPlan.description}</AlertDescription>
                                        </Alert>
                                    )}

                                  {(dayPlan.exercises && dayPlan.exercises.length === 0) || dayPlan.title === "День отдыха" ? (
                                    <p className='text-muted-foreground'>Запланирован отдых. Восстановление — ключ к успеху!</p>
                                  ) : (
                                    <>
                                    <Button 
                                        variant="default" 
                                        size="sm" 
                                        onClick={() => handleStartWorkout(dayPlan)}
                                        className='w-full'
                                      >
                                       <Forward className="mr-2 h-4 w-4" /> Начать тренировку
                                     </Button>
                                    {dayPlan.exercises && dayPlan.exercises.map((exercise, exIndex) => (
                                    <div key={exIndex} className="flex gap-4 items-start pt-4 border-t">
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
                                    </>
                                  )}
                                </div>
                              </AccordionContent>
                            </Card>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </ScrollArea>
                </>
            ) : (
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
