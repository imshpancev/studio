
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { HeartPulse, Activity, Moon, Ruler, Weight, Droplets, Target, LogOut, Camera, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { NotificationsSettings } from './notifications-settings';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import { allSports } from '@/lib/workout-data';
import { cn } from '@/lib/utils';

const profileSchema = z.object({
  // Basic Info
  name: z.string().min(1, 'Имя обязательно.'),
  username: z.string().min(1, 'Имя пользователя обязательно.'),
  bio: z.string().optional(),
  favoriteSports: z.array(z.string()).optional(),
  gender: z.enum(['male', 'female', 'other']),
  age: z.coerce.number().min(1, 'Возраст обязателен.'),
  weight: z.coerce.number().min(1, 'Вес обязателен.'),
  height: z.coerce.number().min(1, 'Рост обязателен.'),
  
  // Vitals
  restingHeartRate: z.coerce.number().optional(),
  hrv: z.coerce.number().optional(),

  // Activity
  dailySteps: z.coerce.number().optional(),
  
  // Sleep
  avgSleepDuration: z.coerce.number().optional(),
  
  // Goals
  mainGoal: z.string().min(1, "Цель обязательна."),
});


export function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'Сергей Рахманинов',
      username: '@sergei_rachmaninoff',
      bio: 'Композитор, пианист и просто хороший человек. Люблю долгие прогулки и умеренные тренировки.',
      favoriteSports: ['Бег', 'Йога'],
      gender: 'male',
      age: 30,
      weight: 80,
      height: 180,
      mainGoal: 'Поддерживать форму',
      restingHeartRate: 60,
      hrv: 45,
      dailySteps: 8000,
      avgSleepDuration: 7.5,
    },
  });

  function onSubmit(values: z.infer<typeof profileSchema>) {
    console.log(values);
    // Here you would typically save the data to your database (e.g., Firestore)
    toast({
      title: 'Профиль обновлен!',
      description: 'Ваши данные были успешно сохранены.',
    });
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      toast({
        title: 'Вы вышли из системы',
      });
      // This will trigger the auth listener on the main page to redirect
      // and clear local state.
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Ошибка выхода',
        description: 'Не удалось выйти из системы. Попробуйте еще раз.',
      });
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <Card>
        <CardHeader>
          <CardTitle>Ваш Профиль</CardTitle>
          <CardDescription>Обновите вашу личную информацию и отслеживаемые показатели здоровья. Эти данные помогут нам точнее адаптировать ваши планы.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="flex flex-col items-center gap-4">
                 <Avatar className="h-24 w-24">
                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704a" alt="User avatar" />
                    <AvatarFallback>SR</AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline">
                    <Camera className="mr-2 h-4 w-4"/>
                    Изменить фото
                </Button>
              </div>

               <div className="space-y-4">
                 <h3 className="text-lg font-medium text-primary">Публичная информация</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Полное имя</FormLabel>
                        <FormControl><Input placeholder="Сергей Рахманинов" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name="username" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имя пользователя</FormLabel>
                        <FormControl><Input placeholder="@sergei_rachmaninoff" {...field} /></FormControl>
                         <FormMessage />
                      </FormItem>
                    )} />
                 </div>
                 <FormField control={form.control} name="bio" render={({ field }) => (
                  <FormItem>
                    <FormLabel>О себе</FormLabel>
                    <FormControl><Textarea placeholder="Расскажите немного о себе..." {...field} /></FormControl>
                     <FormMessage />
                  </FormItem>
                )} />
                 <Controller
                    control={form.control}
                    name="favoriteSports"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Любимые виды спорта</FormLabel>
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
                                    value={sport}
                                    onSelect={(currentValue) => {
                                        const currentValueArray = field.value || [];
                                        const isSelected = currentValueArray.includes(currentValue);
                                        const newValue = isSelected
                                        ? currentValueArray.filter((s) => s !== currentValue)
                                        : [...currentValueArray, currentValue];
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
              </div>

              {/* Personal Info Section */}
              <div className="space-y-4">
                 <h3 className="text-lg font-medium text-primary">Основная информация</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пол</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Пол" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="male">Мужской</SelectItem>
                            <SelectItem value="female">Женский</SelectItem>
                            <SelectItem value="other">Другой</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="age" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Возраст</FormLabel>
                        <FormControl><Input type="number" placeholder="30" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="weight" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Вес (кг)</FormLabel>
                        <FormControl><Input type="number" placeholder="80" {...field} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="height" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Рост (см)</FormLabel>
                        <FormControl><Input type="number" placeholder="180" {...field} /></FormControl>
                      </FormItem>
                    )} />
                 </div>
              </div>

              {/* Health Metrics Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-primary">Показатели здоровья</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField control={form.control} name="restingHeartRate" render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'><HeartPulse className='w-4 h-4' />Пульс в покое</FormLabel>
                      <FormControl><Input type="number" placeholder="60" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="hrv" render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'><Droplets className='w-4 h-4' />ВСР (HRV), мс</FormLabel>
                      <FormControl><Input type="number" placeholder="45" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="dailySteps" render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'><Activity className='w-4 h-4' />Среднее кол-во шагов</FormLabel>
                      <FormControl><Input type="number" placeholder="8000" {...field} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="avgSleepDuration" render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'><Moon className='w-4 h-4' />Средний сон (часы)</FormLabel>
                      <FormControl><Input type="number" step="0.1" placeholder="7.5" {...field} /></FormControl>
                    </FormItem>
                  )} />
                </div>
              </div>

              {/* Goals Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-primary">Цели</h3>
                 <FormField control={form.control} name="mainGoal" render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-2'><Target className='w-4 h-4' />Основная цель</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Выберите вашу основную цель" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Похудеть">Похудеть</SelectItem>
                          <SelectItem value="Нарастить мышечную массу">Нарастить мышечную массу</SelectItem>
                          <SelectItem value="Улучшить выносливость">Улучшить выносливость</SelectItem>
                          <SelectItem value="Поддерживать форму">Поддерживать форму</SelectItem>
                          <SelectItem value="Подготовиться к соревнованиям">Подготовиться к соревнованиям</SelectItem>
                        </SelectContent>
                      </Select>
                  </FormItem>
                )} />
              </div>

              <Button type="submit">Сохранить изменения</Button>
            </form>
          </Form>
        </CardContent>
         <CardFooter className="border-t pt-6 mt-6">
            <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2" />
                Выход
            </Button>
         </CardFooter>
       </Card>

       <NotificationsSettings />
    </div>
  );
}

    