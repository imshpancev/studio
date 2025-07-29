
'use client';

import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { HeartPulse, Activity, Moon, Ruler, Weight, Droplets, Target, LogOut, Camera, Check, Footprints, Bike, Trash2, Languages, Pencil, X, Star, Loader2 } from 'lucide-react';
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
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { UserProfile, getUserProfile, updateUserProfile } from '@/services/userService';
import { Skeleton } from './ui/skeleton';


const runningShoeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Название обязательно."),
  mileage: z.coerce.number().min(0).default(0),
  isDefault: z.boolean().default(false),
  imageUrl: z.string().optional(),
});

const bikeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Название обязательно."),
  mileage: z.coerce.number().min(0).default(0),
  isDefault: z.boolean().default(false),
  imageUrl: z.string().optional(),
});

const profileSchema = z.object({
  // This field is crucial for security rules
  uid: z.string(),

  // Basic Info
  name: z.string().min(1, 'Имя обязательно.'),
  username: z.string().min(1, 'Имя пользователя обязательно.').optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
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
  mainGoal: z.string().optional(),
  
  // Gear
  runningShoes: z.array(runningShoeSchema).optional(),
  bikes: z.array(bikeSchema).optional(),

  // Workout Plan - these are not edited here but need to be in the schema
  // to avoid being stripped out on save.
  onboardingCompleted: z.boolean().optional(),
  email: z.string().email().optional(),
  workoutPlan: z.any().optional(),
  workoutPlanInput: z.any().optional(),

  // Other analytics fields that are not directly editable in the form
  // but should be preserved.
  bodyFat: z.number().optional(),
  muscleMass: z.number().optional(),
  visceralFat: z.number().optional(),
  bmr: z.number().optional(),
  water: z.number().optional(),
  skeletalMuscle: z.number().optional(),
  sleepData: z.any().optional(),
  sleepPhases: z.any().optional(),
  readinessScore: z.number().optional(),
  trainingLoadRatio: z.number().optional(),
  stressLevel: z.number().optional(),
  bodyBattery: z.number().optional(),
  recoveryTimeHours: z.number().optional(),
  totalDistance: z.number().optional(),
  totalSteps: z.number().optional(),
  totalCalories: z.number().optional(),
});


export function ProfilePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const user = auth.currentUser;

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
        uid: '',
        name: '',
        username: '',
        bio: '',
        avatar: '',
        favoriteSports: [],
        gender: 'other',
        age: 0,
        weight: 0,
        height: 0,
        language: 'ru',
        mainGoal: '',
        restingHeartRate: 0,
        hrv: 0,
        dailySteps: 0,
        avgSleepDuration: 0,
        runningShoes: [],
        bikes: [],
    },
  });
  
  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const userProfile = await getUserProfile(user.uid, user.email || '');
        setProfile(userProfile);
        form.reset(userProfile);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        toast({
          variant: 'destructive',
          title: 'Ошибка загрузки профиля',
          description: 'Не удалось загрузить ваши данные. Попробуйте обновить страницу.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, [user, form, toast]);


  const { fields: shoes, append: appendShoe, remove: removeShoe, update: updateShoe } = useFieldArray({
      control: form.control,
      name: "runningShoes"
  });

  const { fields: bikes, append: appendBike, remove: removeBike, update: updateBike } = useFieldArray({
      control: form.control,
      name: "bikes"
  });

  const setDefaultShoe = (index: number) => {
    shoes.forEach((shoe, i) => {
        updateShoe(i, { ...shoe, isDefault: i === index });
    });
  }

  const setDefaultBike = (index: number) => {
    bikes.forEach((bike, i) => {
        updateBike(i, { ...bike, isDefault: i === index });
    });
  }


  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!user) return;
    setIsSaving(true);
    try {
        await updateUserProfile(user.uid, values);
        setProfile(prev => prev ? { ...prev, ...values } : null);
        toast({
            title: 'Профиль обновлен!',
            description: 'Ваши данные были успешно сохранены.',
        });
        setIsEditing(false);
    } catch (error) {
        console.error("Failed to update profile:", error);
        toast({
            variant: "destructive",
            title: "Ошибка сохранения",
            description: "Не удалось сохранить изменения. Попробуйте еще раз."
        });
    } finally {
        setIsSaving(false);
    }
  }

  function handleCancel() {
    if(profile) form.reset(profile); 
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
  
  if (isLoading) {
      return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="flex flex-col items-center gap-4">
                        <Skeleton className="h-24 w-24 rounded-full" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-1/4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-20 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
      )
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
                    <AvatarImage src={profile?.avatar} alt="User avatar" />
                    <AvatarFallback>{profile?.name?.charAt(0)}</AvatarFallback>
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
                        <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
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
                        <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
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
                            <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
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
                                <Card key={shoe.id} className="p-4 flex gap-4 items-start">
                                    <div className="relative w-24 h-24 flex-shrink-0">
                                         <Image src={shoe.imageUrl || "https://placehold.co/100x100.png"} alt={shoe.name} width={100} height={100} className="rounded-md object-cover"/>
                                         {isEditing && (
                                            <Button size="icon" variant="secondary" className="absolute -top-2 -right-2 h-7 w-7">
                                                 <Camera className="h-4 w-4"/>
                                            </Button>
                                         )}
                                    </div>
                                    <div className="flex-grow space-y-2">
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
                                        <p className="text-sm text-muted-foreground">Пробег: {shoe.mileage} км</p>
                                        {isEditing && (
                                           <div className="flex gap-2 items-center">
                                                <Button type="button" variant={shoe.isDefault ? "default" : "outline"} size="sm" onClick={() => setDefaultShoe(index)}>
                                                    <Star className={cn("h-4 w-4", shoe.isDefault && "mr-2")}/>
                                                    {shoe.isDefault && "По умолч."}
                                                </Button>
                                                <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeShoe(index)}>
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                           </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                            {isEditing && (
                              <Button type="button" variant="outline" size="sm" onClick={() => appendShoe({ id: crypto.randomUUID(), name: '', mileage: 0, isDefault: false, imageUrl: 'https://placehold.co/100x100.png' })}>
                                  Добавить кроссовки
                              </Button>
                            )}
                        </div>
                        
                        {/* Bikes Section */}
                        <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2"><Bike/>Велосипеды</h4>
                             {bikes.map((bike, index) => (
                                <Card key={bike.id} className="p-4 flex gap-4 items-start">
                                    <div className="relative w-24 h-24 flex-shrink-0">
                                        <Image src={bike.imageUrl || "https://placehold.co/100x100.png"} alt={bike.name} width={100} height={100} className="rounded-md object-cover"/>
                                        {isEditing && (
                                            <Button size="icon" variant="secondary" className="absolute -top-2 -right-2 h-7 w-7">
                                                    <Camera className="h-4 w-4"/>
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex-grow space-y-2">
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
                                        <p className="text-sm text-muted-foreground">Пробег: {bike.mileage} км</p>
                                        {isEditing && (
                                            <div className="flex gap-2 items-center">
                                                <Button type="button" variant={bike.isDefault ? "default" : "outline"} size="sm" onClick={() => setDefaultBike(index)}>
                                                    <Star className={cn("h-4 w-4", bike.isDefault && "mr-2")}/>
                                                    {bike.isDefault && "По умолч."}
                                                </Button>
                                                <Button type="button" variant="ghost" size="icon" className="text-destructive" onClick={() => removeBike(index)}>
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                           </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                             {isEditing && (
                              <Button type="button" variant="outline" size="sm" onClick={() => appendBike({ id: crypto.randomUUID(), name: '', mileage: 0, isDefault: false, imageUrl: 'https://placehold.co/100x100.png' })}>
                                  Добавить велосипед
                              </Button>
                             )}
                        </div>
                    </div>
                </div>
              </div>


              {isEditing && (
                <div className="flex gap-4">
                  <Button type="submit" disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Сохранить изменения
                  </Button>
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
