
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Flame, PlusCircle, Camera, History, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { WaterIntakeCard } from './water-intake-card';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { addMeal, getDailyNutrition, NutritionData, Meal, updateCalorieGoal } from '@/services/nutritionService';
import { format, subDays, addDays } from 'date-fns';

const MealCard = ({ title, meals, onAddMeal, date, disabled }: { title: Meal['type'], meals: Meal[], onAddMeal: (meal: Omit<Meal, 'id'>) => void, date: string, disabled: boolean }) => {
    const [mealName, setMealName] = useState('');
    const [calories, setCalories] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const { toast } = useToast();

    const handleAdd = async () => {
        if (!mealName || !calories) return;
        setIsAdding(true);
        try {
            await onAddMeal({ name: mealName, calories: parseInt(calories), photo, type: title, date });
            setMealName('');
            setCalories('');
            setPhoto(null);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Ошибка",
                description: "Не удалось добавить прием пищи."
            })
        } finally {
            setIsAdding(false);
        }
    }
    
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPhoto(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {meals.filter(m => m.type === title).map((meal, index) => (
                    <div key={index} className="flex items-center gap-4 p-2 rounded-md bg-muted/50">
                        {meal.photo && (
                            <Image src={meal.photo} alt={meal.name} width={60} height={60} className="rounded-md object-cover" />
                        )}
                        <div className="flex-1">
                            <p className="font-semibold">{meal.name}</p>
                            <p className="text-sm text-muted-foreground">{meal.calories} ккал</p>
                        </div>
                    </div>
                ))}
                 <div className="flex flex-col gap-2 pt-4 border-t">
                    <Input placeholder="Название блюда" value={mealName} onChange={(e) => setMealName(e.target.value)} disabled={disabled} />
                    <Input type="number" placeholder="Калории" value={calories} onChange={(e) => setCalories(e.target.value)} disabled={disabled}/>
                    <Button variant="outline" asChild className="relative" disabled={disabled}>
                        <label htmlFor={`photo-upload-${title}`}>
                            <Camera className="mr-2" />
                            {photo ? "Фото добавлено" : "Добавить фото"}
                            <input id={`photo-upload-${title}`} type="file" accept="image/*" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" onChange={handlePhotoUpload} disabled={disabled}/>
                        </label>
                    </Button>
                    <Button onClick={handleAdd} disabled={!mealName || !calories || isAdding || disabled}>
                        {isAdding ? <Loader2 className="mr-2 animate-spin"/> : <PlusCircle className="mr-2"/>}
                        Добавить
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export function NutritionDiaryPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const user = auth.currentUser;
    const { toast } = useToast();

    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        async function fetchNutritionData() {
            setIsLoading(true);
            try {
                const data = await getDailyNutrition(user.uid, formattedDate);
                setNutritionData(data);
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: "Ошибка",
                    description: "Не удалось загрузить дневник питания."
                });
            } finally {
                setIsLoading(false);
            }
        }
        fetchNutritionData();
    }, [user, formattedDate, toast]);
    
    const handleAddMeal = async (meal: Omit<Meal, 'id'>) => {
        if (!user) return;
        const newMeal = await addMeal(user.uid, meal);
        setNutritionData(prev => {
            if (!prev) return prev;
            return { ...prev, meals: [...prev.meals, newMeal] };
        });
    }

    const handleUpdateGoal = async () => {
        if (!user || !nutritionData) return;
        await updateCalorieGoal(user.uid, formattedDate, nutritionData.calorieGoal);
        toast({ title: "Цель обновлена!" });
    }

    const totalCalories = nutritionData?.meals.reduce((acc, meal) => acc + meal.calories, 0) || 0;
    const calorieGoal = nutritionData?.calorieGoal || 2500;
    const progress = (totalCalories / calorieGoal) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Дневник питания</CardTitle>
                <CardDescription>Отслеживайте свое питание и потребление воды, чтобы достигать фитнес-целей.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center items-center gap-4 mb-6">
                    <Button variant="outline" size="icon" onClick={() => setSelectedDate(d => subDays(d, 1))}>
                        <ChevronLeft/>
                    </Button>
                    <div className="text-center">
                        <p className="text-lg font-semibold">{format(selectedDate, 'd MMMM yyyy')}</p>
                        <p className="text-sm text-muted-foreground">{isToday ? 'Сегодня' : format(selectedDate, 'eeee')}</p>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => setSelectedDate(d => addDays(d, 1))} disabled={isToday}>
                        <ChevronRight/>
                    </Button>
                </div>
                 {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="space-y-6">
                         <Card>
                            <CardHeader>
                                <CardTitle>Калории</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between font-medium">
                                        <span>Цель по калориям</span>
                                        <span>{totalCalories.toLocaleString()} / {calorieGoal.toLocaleString()} ккал</span>
                                    </div>
                                    <Progress value={progress} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Input 
                                        type="number" 
                                        value={calorieGoal} 
                                        onChange={(e) => setNutritionData(prev => ({ ...prev!, calorieGoal: Number(e.target.value) }))}
                                        className="w-full"
                                        disabled={!isToday}
                                    />
                                    <Button onClick={handleUpdateGoal} disabled={!isToday}>Установить цель</Button>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <WaterIntakeCard date={formattedDate} disabled={!isToday} />

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MealCard title="Завтрак" meals={nutritionData?.meals || []} onAddMeal={handleAddMeal} date={formattedDate} disabled={!isToday}/>
                            <MealCard title="Обед" meals={nutritionData?.meals || []} onAddMeal={handleAddMeal} date={formattedDate} disabled={!isToday}/>
                            <MealCard title="Ужин" meals={nutritionData?.meals || []} onAddMeal={handleAddMeal} date={formattedDate} disabled={!isToday}/>
                            <MealCard title="Перекусы" meals={nutritionData?.meals || []} onAddMeal={handleAddMeal} date={formattedDate} disabled={!isToday}/>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
