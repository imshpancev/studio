
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { GenerateWorkoutPlanOutput } from '@/ai/flows/generate-workout-plan';
import { ScrollArea } from './ui/scroll-area';
import { PlayCircle, Info, Bot, Terminal, Forward, Calendar, Target, ChevronLeft, ChevronRight, CheckCircle, Lock, Eye } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { Sport } from '@/lib/workout-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


type WorkoutPlanDisplayProps = {
  data: GenerateWorkoutPlanOutput | null;
  onFinishPlan: () => void;
};

function findSportForWorkout(title: string): Sport {
  if (title.toLowerCase().includes('бег') || title.toLowerCase().includes('интервальная') || title.toLowerCase().includes('темповый')) return Sport.Running;
  if (title.toLowerCase().includes('силовая') || title.toLowerCase().includes('upper body') || title.toLowerCase().includes('lower body')) return Sport.Gym;
  if (title.toLowerCase().includes('йога') || title.toLowerCase().includes('сурья')) return Sport.Yoga;
  if (title.toLowerCase().includes('плавание') || title.toLowerCase().includes('техническая')) return Sport.Swimming;
  if (title.toLowerCase().includes('вело') || title.toLowerCase().includes('велосипед')) return Sport.Cycling;
  if (title.toLowerCase().includes('брик') || title.toLowerCase().includes('триатлон')) return Sport.Triathlon;
  return Sport.Home;
}

export function WorkoutPlanDisplay({ data, onFinishPlan }: WorkoutPlanDisplayProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeWeek, setActiveWeek] = useState(0);
  const [viewedWeek, setViewedWeek] = useState(0);

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

  const handleStartWorkout = (dayPlan: any, weekIndex: number) => {
    if (weekIndex !== activeWeek) {
        toast({
            variant: "destructive",
            title: "Неверная неделя",
            description: "Вы можете начинать тренировки только из текущей активной недели.",
        });
        return;
    }
    const sport = findSportForWorkout(dayPlan.title);
    const exercisesQuery = encodeURIComponent(JSON.stringify(dayPlan.exercises));
    router.push(`/workout/${encodeURIComponent(dayPlan.day)}?sport=${encodeURIComponent(sport)}&exercises=${exercisesQuery}`);
  };

  const handleFinishWeek = () => {
    if (activeWeek < structuredPlan.length - 1) {
        setActiveWeek(w => w + 1);
        setViewedWeek(w => w + 1);
        toast({
            title: `Неделя ${activeWeek + 1} завершена!`,
            description: "Отличная работа! Теперь доступна следующая неделя.",
        });
    } else {
        toast({
            title: "Весь план завершен!",
            description: "Поздравляем с завершением всего тренировочного плана!",
        });
        onFinishPlan();
    }
  }
  
  const isWeekLocked = (weekIndex: number) => weekIndex > activeWeek;
  
  const weekForDisplay = structuredPlan[viewedWeek];

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
                     <Button variant="secondary">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Завершить неделю
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Завершить текущую неделю?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Вы уверены, что хотите завершить эту неделю и перейти к следующей? Это действие нельзя будет отменить.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={handleFinishWeek}>Да, завершить</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={String(viewedWeek)} onValueChange={(val) => setViewedWeek(Number(val))} className="w-full">
          <div className="flex justify-center items-center mb-4">
            <TabsList>
                {structuredPlan.map((week, index) => (
                    <TabsTrigger key={index} value={String(index)}>
                        {isWeekLocked(index) ? <Eye className='mr-2'/> : (index < activeWeek ? <CheckCircle className='mr-2 text-green-500'/> : <PlayCircle className='mr-2 text-primary' />)}
                        Неделя {week.week}
                    </TabsTrigger>
                ))}
            </TabsList>
          </div>
            
            {weekForDisplay ? (
                <>
                    <div className="my-4 p-4 border rounded-lg bg-muted/50">
                        <h3 className="font-semibold flex items-center gap-2"><Target className="h-5 w-5 text-primary"/>Цель на неделю:</h3>
                        <p className="text-muted-foreground">{weekForDisplay.weekGoal}</p>
                    </div>

                    <ScrollArea className="h-[60vh] pr-4">
                      <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
                        {weekForDisplay.days && weekForDisplay.days.map((dayPlan, index) => (
                          <AccordionItem value={`item-${index}`} key={index} className="border-b-0">
                            <Card className={cn("overflow-hidden rounded-lg", isWeekLocked(viewedWeek) && "opacity-70")}>
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
                                        onClick={() => handleStartWorkout(dayPlan, viewedWeek)}
                                        className='w-full'
                                        disabled={isWeekLocked(viewedWeek)}
                                      >
                                       {isWeekLocked(viewedWeek) ? <Lock className="mr-2 h-4 w-4" /> : <Forward className="mr-2 h-4 w-4" />}
                                       {isWeekLocked(viewedWeek) ? 'Неделя заблокирована' : 'Начать тренировку'}
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
