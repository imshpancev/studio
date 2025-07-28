
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowDown, ChevronRight, Scale, BrainCircuit, Droplets, Flame, Dumbbell, FileText, PersonStanding, Bot, Percent } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { getUserProfile, UserProfile } from '@/services/userService';
import { auth } from '@/lib/firebase';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";


const MetricRow = ({ title, value, unit, icon, metricId, status }: { title: string, value?: number | string, unit: string, icon: React.ReactNode, metricId: string, status?: string }) => {
    const router = useRouter();
    const statusColor = 
        status === 'high' ? 'text-orange-500' :
        status === 'low' ? 'text-yellow-500' :
        'text-foreground';

    return (
        <div onClick={() => router.push(`/analytics/composition/${metricId}`)} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted">
            <div className="flex items-center gap-3">
                {icon}
                <span className="font-medium">{title}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className={`font-semibold text-lg ${statusColor}`}>{value}{unit}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
        </div>
    )
};


export function BodyCompositionPage() {
    const { toast } = useToast();
    const user = auth.currentUser;
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const bodyCompData = {
        weight: { value: profile?.weight, unit: 'кг', metricId: 'weight' },
        bodyFat: { value: profile?.bodyFat, unit: '%', status: 'high', metricId: 'body-fat' },
        muscleMass: { value: profile?.muscleMass, unit: '%', status: 'normal', metricId: 'muscle-mass' },
        visceralFat: { value: profile?.visceralFat, unit: '', status: 'high', metricId: 'visceral-fat' },
        bmr: { value: profile?.bmr, unit: 'ккал', status: 'normal', metricId: 'bmr' },
        water: { value: profile?.water, unit: '%', status: 'low', metricId: 'water' },
        skeletalMuscle: { value: profile?.skeletalMuscle, unit: '%', status: 'normal', metricId: 'skeletal-muscle' },
        score: { value: 4.1, max: 10 },
        bodyType: 'Крупное'
    };
    
    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }
        async function fetchData() {
            try {
                const userProfile = await getUserProfile(user!.uid, user!.email || '');
                setProfile(userProfile);
            } catch (error) {
                 toast({
                    variant: 'destructive',
                    title: 'Ошибка',
                    description: 'Не удалось загрузить данные о составе тела.',
                });
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [user, toast]);

    if(isLoading) {
        return (
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/2" /><Skeleton className="h-4 w-3/4 mt-2" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Отчет об измерениях</CardTitle>
                <CardDescription>
                    Данные синхронизированы с Apple Health.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Body Visual */}
                <div className="p-4 rounded-lg bg-muted">
                    <div className="flex justify-around items-center">
                        <div className="space-y-8 text-right">
                           <div className="space-y-1">
                             <p className="text-sm text-muted-foreground">Вес</p>
                             <p className="text-xl font-bold">{bodyCompData.weight.value}кг</p>
                           </div>
                           <div className="space-y-1">
                             <p className="text-sm text-muted-foreground">Телесный жир</p>
                             <p className="text-xl font-bold">{bodyCompData.bodyFat.value}%</p>
                           </div>
                        </div>

                        <div className="relative w-24 h-48">
                             {/* Abstract Body Shape */}
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-40 bg-primary/20 rounded-full blur-sm"></div>
                             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-32 bg-primary/50 rounded-full"></div>
                             <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary/50 rounded-full"></div>
                        </div>

                        <div className="space-y-8 text-left">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Оценка</p>
                                <p className="text-xl font-bold">{bodyCompData.score.value}<span className="text-base text-muted-foreground">/10</span></p>
                            </div>
                           <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Телосложение</p>
                                <p className="text-xl font-bold">{bodyCompData.bodyType}</p>
                           </div>
                        </div>
                    </div>
                </div>

                <Alert>
                    <Bot className="h-4 w-4"/>
                    <AlertTitle className="flex items-center gap-2">Анализ от умного помощника</AlertTitle>
                    <AlertDescription>
                        За последние дни почти ничего не изменилось. Однако с точки зрения долгосрочных тенденций, вы на правильном пути.
                    </AlertDescription>
                </Alert>
                
                <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Требующие особого внимания</h3>
                    <div className="space-y-2">
                        <MetricRow title="Вес тела" value={bodyCompData.weight.value} unit="кг" icon={<Scale className="h-6 w-6 text-primary"/>} metricId="weight" />
                        <MetricRow title="Телесный жир" value={bodyCompData.bodyFat.value} unit="%" icon={<Percent className="h-6 w-6 text-primary"/>} metricId="body-fat" status={bodyCompData.bodyFat.status} />
                        <MetricRow title="Мышцы" value={bodyCompData.muscleMass.value} unit="%" icon={<Dumbbell className="h-6 w-6 text-primary"/>} metricId="muscle-mass" status={bodyCompData.muscleMass.status} />
                        <MetricRow title="Индекс висцерального жира" value={bodyCompData.visceralFat.value} unit="" icon={<FileText className="h-6 w-6 text-primary"/>} metricId="visceral-fat" status={bodyCompData.visceralFat.status} />
                        <MetricRow title="СООВ" value={bodyCompData.bmr.value} unit="ккал" icon={<Flame className="h-6 w-6 text-primary"/>} metricId="bmr" status={bodyCompData.bmr.status} />
                        <MetricRow title="Вода в организме" value={bodyCompData.water.value} unit="%" icon={<Droplets className="h-6 w-6 text-primary"/>} metricId="water" status={bodyCompData.water.status} />
                        <MetricRow title="Скелетные мышцы" value={bodyCompData.skeletalMuscle.value} unit="%" icon={<PersonStanding className="h-6 w-6 text-primary"/>} metricId="skeletal-muscle" status={bodyCompData.skeletalMuscle.status}/>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
