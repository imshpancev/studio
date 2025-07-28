
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useMemo, useEffect } from 'react';
import { Loader2, Check, CalendarIcon } from 'lucide-react';
import { format } from "date-fns"

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generatePlanAction } from '@/app/actions';
import type { GenerateWorkoutPlanInput, GenerateWorkoutPlanOutput } from '@/ai/flows/generate-workout-plan';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { cn } from '@/lib/utils';
import { allEquipment, allSports, Sport, sportsWithEquipment } from '@/lib/workout-data';
import { Slider } from './ui/slider';
import { Calendar } from './ui/calendar';


const formSchema = z.object({
  // User profile data (gender, age, weight, height) is now passed separately
  sportPreferences: z.array(z.string()).nonempty({ message: "Пожалуйста, выберите хотя бы один вид спорта." }),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  workoutDaysPerWeek: z.number().min(1).max(7),
  availableEquipment: z.array(z.string()),
  workoutHistory: z.string().min(1, 'История тренировок обязательна.'),
  goals: z.string().min(1, 'Пожалуйста, опишите свои фитнес-цели.'),
  
  // Optional fields
  workoutDifficultyFeedback: z.string().optional(),
  
  // Competition fields (now more structured)
  competitionGoal: z.enum(['none', '5k', '10k', 'halfMarathon', 'marathon']).optional(),
  competitionDate: z.date().optional(),

  healthDataFromWearables: z.string().optional(),
  exerciseContraindications: z.string().optional(),
}).refine(data => {
    if (data.competitionGoal && data.competitionGoal !== 'none' && !data.competitionDate) {
        return false;
    }
    return true;
}, {
    message: "Пожалуйста, выберите дату для вашего соревнования",
    path: ["competitionDate"],
});


type GeneratePlanFormProps = {
  onPlanGenerated: (data: GenerateWorkoutPlanOutput | null, input: GenerateWorkoutPlanInput | null) => void;
  existingPlanInput?: GenerateWorkoutPlanInput | null;
};

export function GeneratePlanForm({ onPlanGenerated, existingPlanInput }: GeneratePlanFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  // In a real app, you'd fetch this from a user context or API
  const userProfile = {
      gender: 'male',
      age: 30,
      weight: 80,
      height: 180,
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sportPreferences: [Sport.Gym],
      fitnessLevel: 'intermediate',
      workoutDaysPerWeek: 3,
      availableEquipment: [],
      workoutHistory: 'Тренируюсь 3-4 раза в неделю в течение последнего года. В основном силовые тренировки.',
      goals: 'Нарастить мышечную массу',
      workoutDifficultyFeedback: '',
      competitionGoal: 'none',
      competitionDate: undefined,
      healthDataFromWearables: 'Средний пульс в покое: 60 ударов в минуту, Средний сон: 7 часов',
      exerciseContraindications: '',
    },
  });

  // Populate form with existing plan data if available
  useEffect(() => {
    if (existingPlanInput) {
        const sportPrefs = existingPlanInput.sportPreferences.split(',').map(s => s.trim());
        
        let competitionData: any = {};
        if (existingPlanInput.upcomingCompetitionReference) {
            const competitionString = existingPlanInput.upcomingCompetitionReference.toLowerCase();
            if (competitionString.includes("5к")) competitionData.competitionGoal = "5k";
            else if (competitionString.includes("10к")) competitionData.competitionGoal = "10k";
            else if (competitionString.includes("полумарафон")) competitionData.competitionGoal = "halfMarathon";
            else if (competitionString.includes("марафон")) competitionData.competitionGoal = "marathon";
            // A more robust date parsing would be needed for production
            // This is a simple example
            const dateMatch = existingPlanInput.upcomingCompetitionReference.match(/(\d{4}-\d{2}-\d{2})/);
            if (dateMatch) {
                competitionData.competitionDate = new Date(dateMatch[1]);
            }
        }

        form.reset({
            ...existingPlanInput,
            sportPreferences: sportPrefs, // Ensure it's an array for the form
            ...competitionData
        });
    }
  }, [existingPlanInput, form]);


  const sportPreferences = form.watch('sportPreferences');
  const showEquipmentSelector = useMemo(() => {
    if (!sportPreferences) return false;
    return sportPreferences.some(sport => sportsWithEquipment.includes(sport as Sport))
  }, [sportPreferences]);
  const showCompetitionFields = useMemo(() => {
    if (!sportPreferences) return false;
    return sportPreferences.includes(Sport.Running);
  }, [sportPreferences]);
  const daysPerWeek = form.watch('workoutDaysPerWeek');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onPlanGenerated(null, null); // Clear previous plan
    try {

      let upcomingCompetitionReference: string | undefined = undefined;
      if (values.competitionGoal && values.competitionGoal !== 'none' && values.competitionDate) {
          const goalMap = {
              '5k': '5к',
              '10k': '10к',
              'halfMarathon': 'полумарафон',
              'marathon': 'марафон'
          }
          upcomingCompetitionReference = `Хочу подготовиться к соревнованию: ${goalMap[values.competitionGoal]} Дата: ${format(values.competitionDate, "yyyy-MM-dd")}.`;
      }

      // Merge form values with the static user profile data
      const fullInput: GenerateWorkoutPlanInput = {
        ...userProfile,
        ...values,
        sportPreferences: values.sportPreferences.join(', '), // Convert array to string for the flow
        upcomingCompetitionReference: upcomingCompetitionReference,
      };

      const result = await generatePlanAction(fullInput);
      onPlanGenerated(result, fullInput);
      toast({
        title: 'Успех!',
        description: 'Ваш новый план тренировок был сгенерирован.',
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Не удалось сгенерировать план тренировок. Пожалуйста, попробуйте еще раз.';
      toast({
        variant: 'destructive',
        title: 'Произошла ошибка.',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <p className="font-medium text-sm">Предпочтения и цели</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
                control={form.control}
                name="sportPreferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Предпочтения в спорте</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value?.length && "text-muted-foreground"
                            )}
                          >
                            {field.value?.length > 0
                              ? field.value.join(", ")
                              : "Выберите виды спорта"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                        <Command>
                          <CommandInput placeholder="Поиск..." />
                          <CommandList>
                            <CommandEmpty>Ничего не найдено.</CommandEmpty>
                            <CommandGroup>
                              {allSports.map((sport) => (
                                <CommandItem
                                  key={sport}
                                  onSelect={() => {
                                    const currentValue = field.value || [];
                                    const newValue = currentValue.includes(sport)
                                      ? currentValue.filter((s) => s !== sport)
                                      : [...currentValue, sport];
                                    field.onChange(newValue);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value?.includes(sport)
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {sport}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="fitnessLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Уровень подготовки</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите ваш уровень подготовки" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Начинающий</SelectItem>
                      <SelectItem value="intermediate">Средний</SelectItem>
                      <SelectItem value="advanced">Продвинутый</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="goals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Основные цели</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите вашу основную цель" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Похудеть">Похудеть</SelectItem>
                      <SelectItem value="Нарастить мышечную массу">Нарастить мышечную массу</SelectItem>
                      <SelectItem value="Улучшить выносливость">Улучшить выносливость</SelectItem>
                      <SelectItem value="Поддерживать форму">Поддерживать форму</SelectItem>
                      <SelectItem value="Подготовиться к соревнованиям">Подготовиться к соревнованиям</SelectItem>
                      <SelectItem value="Другое">Другое (уточните ниже)</SelectItem>
                    </SelectContent>
                  </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
            control={form.control}
            name="workoutDaysPerWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Количество тренировок в неделю: <span className="text-primary font-bold">{daysPerWeek}</span></FormLabel>
                <FormControl>
                   <Slider
                      min={1}
                      max={7}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        {showEquipmentSelector && (
           <Controller
            control={form.control}
            name="availableEquipment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Доступное оборудование</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value?.length && "text-muted-foreground"
                        )}
                      >
                        {field.value?.length > 0
                          ? field.value.join(", ")
                          : "Выберите оборудование"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                    <Command>
                      <CommandInput placeholder="Поиск оборудования..." />
                      <CommandList>
                        <CommandEmpty>Ничего не найдено.</CommandEmpty>
                        <CommandGroup>
                          {allEquipment.map((equipment) => (
                            <CommandItem
                              key={equipment.id}
                              onSelect={() => {
                                const currentValue = field.value || [];
                                const newValue = currentValue.includes(equipment.label)
                                  ? currentValue.filter((id) => id !== equipment.label)
                                  : [...currentValue, equipment.label];
                                field.onChange(newValue);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value?.includes(equipment.label)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {equipment.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Выберите все оборудование, которое у вас есть.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="workoutHistory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>История тренировок</FormLabel>
              <FormControl>
                <Textarea placeholder="Опишите ваш опыт тренировок: как часто, как долго, какие упражнения вы делали." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="advanced-options" className='border-b-0'>
            <AccordionTrigger className="hover:no-underline text-sm">
              Дополнительные детали (необязательно)
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-6 pt-4'>
                {showCompetitionFields && (
                    <div className="space-y-4 p-4 border rounded-lg">
                         <p className="font-medium text-sm">Цель соревнований (для бега)</p>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="competitionGoal"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Соревнование</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите дистанцию" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="none">Нет цели</SelectItem>
                                            <SelectItem value="5k">5 км</SelectItem>
                                            <SelectItem value="10k">10 км</SelectItem>
                                            <SelectItem value="halfMarathon">Полумарафон (21.1 км)</SelectItem>
                                            <SelectItem value="marathon">Марафон (42.2 км)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="competitionDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Дата соревнования</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Выберите дату</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                         </div>
                    </div>
                )}
                 <FormField
                  control={form.control}
                  name="healthDataFromWearables"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сводка данных о здоровье</FormLabel>
                      <FormControl>
                         <Textarea placeholder="e.g. Средний пульс в покое: 60 ударов в минуту, Средний сон: 7 часов" {...field} />
                      </FormControl>
                      <FormDescription>Любые данные с носимых устройств, которые могут быть полезны.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="workoutDifficultyFeedback"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Отзывы о сложности предыдущих тренировок</FormLabel>
                      <FormControl>
                        <Textarea placeholder="например, Предыдущие программы казались слишком легкими/сложными в некоторых областях." {...field} />
                      </FormControl>
                      <FormDescription>Отзывы о сложности прошлых тренировок.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="exerciseContraindications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Противопоказания к упражнениям</FormLabel>
                      <FormControl>
                        <Textarea placeholder="например, 'приседания' из-за боли в колене. Перечислите через запятую." {...field} />
                      </FormControl>
                      <FormDescription>Перечислите все упражнения, которых вам следует избегать.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? 'Создание плана...' : existingPlanInput ? 'Обновить мой план' : 'Создать план тренировок' }
        </Button>
      </form>
    </Form>
  );
}
