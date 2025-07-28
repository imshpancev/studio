
'use client';

import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { HeartPulse, Activity, Moon, Ruler, Weight, Droplets, Target, LogOut, Camera, Check, Footprints, Bike, Trash2, Languages, Pencil, X } from 'lucide-react';
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
import { Separator } from './ui/separator';
import { useState } from 'react';

const runningShoeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Название обязательно."),
  mileage: z.coerce.number().min(0).default(0),
});

const bikeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Название обязательно."),
  mileage: z.coerce.number().min(0).default(0),
});

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
  language: z.enum(['ru', 'en']).default('ru'),
  
  // Vitals
  restingHeartRate: z.coerce.number().optional(),
  hrv: z.coerce.number().optional(),

  // Activity
  dailySteps: z.coerce.number().optional(),
  
  // Sleep
  avgSleepDuration: z.coerce.number().optional(),
  
  // Goals
  mainGoal: z.string().min(1, "Цель обязательна."),
  
  // Gear
  runningShoes: z.array(runningShoeSchema).optional(),
  bikes: z.array(bikeSchema).optional(),
});


export function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

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
      language: 'ru',
      mainGoal: 'Поддерживать форму',
      restingHeartRate: 60,
      hrv: 45,
      dailySteps: 8000,
      avgSleepDuration: 7.5,
      runningShoes: [{ id: '1', name: 'Hoka Clifton 9', mileage: 250 }],
      bikes: [{ id: '1', name: 'Specialized Tarmac', mileage: 1500 }],
    },
  });
  
  const { fields: shoes, append: appendShoe, remove: removeShoe } = useFieldArray({
      control: form.control,
      name: "runningShoes"
  });

  const { fields: bikes, append: appendBike, remove: removeBike } = useFieldArray({
      control: form.control,
      name: "bikes"
  });


  function onSubmit(values: z.infer<typeof profileSchema>) {
    console.log(values);
    toast({
      title: 'Профиль обновлен!',
      description: 'Ваши данные были успешно сохранены.',
    });
    setIsEditing(false);
  }

  function handleCancel() {
    form.reset(); // Сбросить изменения к последним сохраненным значениям
    setIsEditing(false);
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      toast({
        title: 'Вы вышли из системы',
      });
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Ваш Профиль</CardTitle>
                  <CardDescription>Обновите вашу личную информацию и отслеживаемые показатели здоровья.</CardDescription>
                </div>
                {!isEditing && (
                  <Button type="button" variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              
              <div className="flex flex-col items-center gap-4">
                 <Avatar className="h-24 w-24">
                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704a" alt="User avatar" />
                    <AvatarFallback>SR</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button type="button" variant="outline" disabled={!isEditing}>
                      <Camera className="mr-2 h-4 w-4"/>
                      Изменить фото
                  </Button>
                )}
              </div>

               <div className="space-y-4">
                 <h3 className="text-lg font-medium text-primary">Публичная информация</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Полное имя</FormLabel>
                        <FormControl><Input placeholder="Сергей Рахманинов" {...field} disabled={!isEditing} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={form.control} name="username" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Имя пользователя</FormLabel>
                        <FormControl><Input placeholder="@sergei_rachmaninoff" {...field} disabled={!isEditing} /></FormControl>
                         <FormMessage />
                      </FormItem>
                    )} />
                 </div>
                 <FormField control={form.control} name="bio" render={({ field }) => (
                  <FormItem>
                    <FormLabel>О себе</FormLabel>
                    <FormControl><Textarea placeholder="Расскажите немного о себе..." {...field} disabled={!isEditing} /></FormControl>
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
                                disabled={!isEditing}
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

              <div className="space-y-4">
                 <h3 className="text-lg font-medium text-primary">Основная информация</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пол</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
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
                        <FormControl><Input type="number" placeholder="30" {...field} disabled={!isEditing} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="weight" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Вес (кг)</FormLabel>
                        <FormControl><Input type="number" placeholder="80" {...field} disabled={!isEditing} /></FormControl>
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="height" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Рост (см)</FormLabel>
                        <FormControl><Input type="number" placeholder="180" {...field} disabled={!isEditing} /></FormControl>
                      </FormItem>
                    )} />
                 </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-primary">Показатели здоровья</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <FormField control={form.control} name="restingHeartRate" render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'><HeartPulse className='w-4 h-4' />Пульс в покое</FormLabel>
                      <FormControl><Input type="number" placeholder="60" {...field} disabled={!isEditing} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="hrv" render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'><Droplets className='w-4 h-4' />ВСР (HRV), мс</FormLabel>
                      <FormControl><Input type="number" placeholder="45" {...field} disabled={!isEditing} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="dailySteps" render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'><Activity className='w-4 h-4' />Среднее кол-во шагов</FormLabel>
                      <FormControl><Input type="number" placeholder="8000" {...field} disabled={!isEditing} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="avgSleepDuration" render={({ field }) => (
                    <FormItem>
                      <FormLabel className='flex items-center gap-2'><Moon className='w-4 h-4' />Средний сон (часы)</FormLabel>
                      <FormControl><Input type="number" step="0.1" placeholder="7.5" {...field} disabled={!isEditing} /></FormControl>
                    </FormItem>
                  )} />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-primary">Цели и настройки</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="mainGoal" render={({ field }) => (
                    <FormItem>
                        <FormLabel className='flex items-center gap-2'><Target className='w-4 h-4' />Основная цель</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
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
                    <FormField control={form.control} name="language" render={({ field }) => (
                        <FormItem>
                            <FormLabel className='flex items-center gap-2'><Languages className='w-4 h-4' />Язык</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isEditing}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Выберите язык" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="ru">Русский</SelectItem>
                                    <SelectItem value="en">English</SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )} />
                 </div>
              </div>
              
                <Separator />

              <div className="space-y-6">
                <div>
                     <h3 className="text-lg font-medium text-primary mb-4">Мой инвентарь</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {/* Running Shoes Section */}
                        <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2"><Footprints/>Кроссовки</h4>
                            {shoes.map((shoe, index) => (
                                <div key={shoe.id} className="flex gap-2 items-end p-2 border rounded-lg">
                                    <div className='flex-1 space-y-2'>
                                        <FormField
                                            control={form.control}
                                            name={`runningShoes.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Название</FormLabel>
                                                    <FormControl><Input placeholder="Напр., Hoka Clifton 9" {...field} disabled={!isEditing} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <p className="text-xs text-muted-foreground">Пробег: {shoe.mileage} км</p>
                                    </div>
                                    {isEditing && (
                                      <Button type="button" variant="ghost" size="icon" onClick={() => removeShoe(index)}>
                                          <Trash2 className="h-4 w-4 text-destructive"/>
                                      </Button>
                                    )}
                                </div>
                            ))}
                            {isEditing && (
                              <Button type="button" variant="outline" size="sm" onClick={() => appendShoe({ id: crypto.randomUUID(), name: '', mileage: 0 })}>
                                  Добавить кроссовки
                              </Button>
                            )}
                        </div>
                        
                        {/* Bikes Section */}
                        <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2"><Bike/>Велосипеды</h4>
                             {bikes.map((bike, index) => (
                                <div key={bike.id} className="flex gap-2 items-end p-2 border rounded-lg">
                                    <div className='flex-1 space-y-2'>
                                        <FormField
                                            control={form.control}
                                            name={`bikes.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Название</FormLabel>
                                                    <FormControl><Input placeholder="Напр., Specialized Tarmac" {...field} disabled={!isEditing} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <p className="text-xs text-muted-foreground">Пробег: {bike.mileage} км</p>
                                    </div>
                                     {isEditing && (
                                      <Button type="button" variant="ghost" size="icon" onClick={() => removeBike(index)}>
                                          <Trash2 className="h-4 w-4 text-destructive"/>
                                      </Button>
                                     )}
                                </div>
                            ))}
                             {isEditing && (
                              <Button type="button" variant="outline" size="sm" onClick={() => appendBike({ id: crypto.randomUUID(), name: '', mileage: 0 })}>
                                  Добавить велосипед
                              </Button>
                             )}
                        </div>
                    </div>
                </div>
              </div>


              {isEditing && (
                <div className="flex gap-4">
                  <Button type="submit">Сохранить изменения</Button>
                  <Button type="button" variant="ghost" onClick={handleCancel}>Отмена</Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-6 mt-6">
              <Button variant="destructive" onClick={handleLogout}>
                  <LogOut className="mr-2" />
                  Выход
              </Button>
            </CardFooter>
          </form>
        </Form>
       </Card>

       <NotificationsSettings />
    </div>
  );
}
