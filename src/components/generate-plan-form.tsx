
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useMemo } from 'react';
import { Loader2, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { generatePlanAction } from '@/app/actions';
import type { GenerateWorkoutPlanOutput } from '@/ai/flows/generate-workout-plan';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { cn } from '@/lib/utils';
import { allEquipment, Sport, sportsWithEquipment } from '@/lib/workout-data';
import { Slider } from './ui/slider';


const formSchema = z.object({
  gender: z.enum(['male', 'female', 'other'], { required_error: "Пожалуйста, выберите пол." }),
  age: z.coerce.number().min(1, 'Возраст обязателен.'),
  weight: z.coerce.number().min(1, 'Вес обязателен.'),
  height: z.coerce.number().min(1, 'Рост обязателен.'),
  sportPreferences: z.string().min(1, 'Предпочтения в спорте обязательны.'),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  workoutDaysPerWeek: z.number().min(1).max(7),
  availableEquipment: z.array(z.string()),
  workoutHistory: z.string().min(1, 'История тренировок обязательна.'),
  goals: z.string().min(1, 'Пожалуйста, опишите свои фитнес-цели.'),
  workoutDifficultyFeedback: z.string().optional(),
  upcomingCompetitionReference: z.string().optional(),
  healthDataFromWearables: z.string().optional(),
  exerciseContraindications: z.string().optional(),
});

type GeneratePlanFormProps = {
  onPlanGenerated: (data: GenerateWorkoutPlanOutput | null) => void;
};

export function GeneratePlanForm({ onPlanGenerated }: GeneratePlanFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: 'male',
      age: 30,
      weight: 80,
      height: 180,
      sportPreferences: Sport.Gym,
      fitnessLevel: 'intermediate',
      workoutDaysPerWeek: 3,
      availableEquipment: [],
      workoutHistory: 'Тренируюсь 3-4 раза в неделю в течение последнего года. В основном силовые тренировки.',
      goals: 'Нарастить мышечную массу',
      workoutDifficultyFeedback: '',
      upcomingCompetitionReference: '',
      healthDataFromWearables: 'Средний пульс в покое: 60 ударов в минуту, Средний сон: 7 часов',
      exerciseContraindications: '',
    },
  });

  const sportPreference = form.watch('sportPreferences');
  const showEquipmentSelector = useMemo(() => sportsWithEquipment.includes(sportPreference as Sport), [sportPreference]);
  const daysPerWeek = form.watch('workoutDaysPerWeek');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onPlanGenerated(null); // Clear previous plan
    try {
      const result = await generatePlanAction(values);
      onPlanGenerated(result);
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
          <p className="font-medium text-sm">Основная информация</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пол</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Пол" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Мужской</SelectItem>
                        <SelectItem value="female">Женский</SelectItem>
                        <SelectItem value="other">Другой</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="age" render={({ field }) => (
                  <FormItem>
                      <FormLabel>Возраст</FormLabel>
                      <FormControl><Input type="number" placeholder="30" {...field} /></FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
              <FormField control={form.control} name="weight" render={({ field }) => (
                  <FormItem>
                      <FormLabel>Вес (кг)</FormLabel>
                      <FormControl><Input type="number" placeholder="80" {...field} /></FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
              <FormField control={form.control} name="height" render={({ field }) => (
                  <FormItem>
                      <FormLabel>Рост (см)</FormLabel>
                      <FormControl><Input type="number" placeholder="180" {...field} /></FormControl>
                      <FormMessage />
                  </FormItem>
              )} />
          </div>
        </div>


        <div className="space-y-4">
          <p className="font-medium text-sm">Предпочтения и цели</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="sportPreferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Предпочтения в спорте</FormLabel>
                  <Select onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue('availableEquipment', []); // Reset equipment on sport change
                    }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите ваш вид спорта" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Sport.Gym}>Тренажерный зал</SelectItem>
                      <SelectItem value={Sport.Running}>Бег</SelectItem>
                      <SelectItem value={Sport.Home}>Домашние тренировки</SelectItem>
                      <SelectItem value={Sport.Swimming}>Плавание</SelectItem>
                      <SelectItem value={Sport.Yoga}>Йога</SelectItem>
                    </SelectContent>
                  </Select>
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
                <FormField
                  control={form.control}
                  name="upcomingCompetitionReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Предстоящие соревнования</FormLabel>
                      <FormControl>
                        <Input placeholder="например, Марафон 10 октября 2025 г." {...field} />
                      </FormControl>
                      <FormDescription>Расскажите нам о любых предстоящих событиях, к которым вы готовитесь.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
          {isLoading ? 'Создание плана...' : 'Создать план тренировок'}
        </Button>
      </form>
    </Form>
  );
}
