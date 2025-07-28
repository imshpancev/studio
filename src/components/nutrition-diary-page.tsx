
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Flame, PlusCircle, Camera, History } from "lucide-react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { WaterIntakeCard } from './water-intake-card';

const MealCard = ({ title, meals, onAddMeal }: { title: string, meals: any[], onAddMeal: (meal: any) => void }) => {
    const [mealName, setMealName] = useState('');
    const [calories, setCalories] = useState('');
    const [photo, setPhoto] = useState<string | null>(null);

    const handleAdd = () => {
        if (!mealName || !calories) return;
        onAddMeal({ name: mealName, calories: parseInt(calories), photo });
        setMealName('');
        setCalories('');
        setPhoto(null);
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
                {meals.map((meal, index) => (
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
                    <Input placeholder="Название блюда" value={mealName} onChange={(e) => setMealName(e.target.value)} />
                    <Input type="number" placeholder="Калории" value={calories} onChange={(e) => setCalories(e.target.value)} />
                    <Button variant="outline" asChild className="relative">
                        <label htmlFor={`photo-upload-${title}`}>
                            <Camera className="mr-2" />
                            {photo ? "Фото добавлено" : "Добавить фото"}
                            <input id={`photo-upload-${title}`} type="file" accept="image/*" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" onChange={handlePhotoUpload} />
                        </label>
                    </Button>
                    <Button onClick={handleAdd} disabled={!mealName || !calories}><PlusCircle className="mr-2"/>Добавить</Button>
                </div>
            </CardContent>
        </Card>
    )
}

export function NutritionDiaryPage() {
    const [calorieGoal, setCalorieGoal] = useState(2500);
    const [breakfast, setBreakfast] = useState<{name: string, calories: number, photo: string | null}[]>([]);
    const [lunch, setLunch] = useState<{name: string, calories: number, photo: string | null}[]>([]);
    const [dinner, setDinner] = useState<{name: string, calories: number, photo: string | null}[]>([]);
    const [snacks, setSnacks] = useState<{name: string, calories: number, photo: string | null}[]>([]);

    const totalCalories = [...breakfast, ...lunch, ...dinner, ...snacks].reduce((acc, meal) => acc + meal.calories, 0);
    const progress = (totalCalories / calorieGoal) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Дневник питания</CardTitle>
                <CardDescription>Отслеживайте свое питание и потребление воды, чтобы достигать фитнес-целей.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Tabs defaultValue="today" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="today">Сегодня</TabsTrigger>
                        <TabsTrigger value="history" className="gap-2"><History />История</TabsTrigger>
                    </TabsList>
                    <TabsContent value="today" className="mt-4 space-y-6">
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
                                        onChange={(e) => setCalorieGoal(Number(e.target.value))}
                                        className="w-full"
                                    />
                                    <Button>Установить цель</Button>
                                </div>
                            </CardContent>
                        </Card>
                        
                        <WaterIntakeCard />

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MealCard title="Завтрак" meals={breakfast} onAddMeal={(meal) => setBreakfast(prev => [...prev, meal])} />
                            <MealCard title="Обед" meals={lunch} onAddMeal={(meal) => setLunch(prev => [...prev, meal])} />
                            <MealCard title="Ужин" meals={dinner} onAddMeal={(meal) => setDinner(prev => [...prev, meal])} />
                            <MealCard title="Перекусы" meals={snacks} onAddMeal={(meal) => setSnacks(prev => [...prev, meal])} />
                        </div>
                    </TabsContent>
                     <TabsContent value="history" className="mt-4">
                       <Card>
                           <CardContent className="p-8 text-center text-muted-foreground">
                               <p>История вашего питания будет отображаться здесь.</p>
                           </CardContent>
                       </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

    