
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
                <span className={`font-semibold text-lg ${statusColor}`}>{value ?? 'N/A'}{unit}</span>
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
    
    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            return;
        }
        async function fetchData() {
            try {
                const userProfile = await getUserProfile(user!.uid);
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
    
    const getStatusForFat = (fat?: number) => {
        if (!fat) return 'normal';
        // Simplified logic
        return fat > 25 ? 'high' : 'normal';
    }

    const getStatusForWater = (water?: number, gender?: string) => {
        if (!water) return 'normal';
        const lowerBound = gender === 'female' ? 45 : 50;
        return water < lowerBound ? 'low' : 'normal';
    }
    
    const getStatusForVisceralFat = (fat?: number) => {
        if (!fat) return 'normal';
        return fat >= 10 ? 'high' : 'normal';
    }


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
                    Данные синхронизированы с вашими устройствами.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

                {/* Body Visual */}
                <div className="p-4 rounded-lg bg-muted">
                    <div className="flex justify-around items-center">
                        <div className="space-y-8 text-right">
                           <div className="space-y-1">
                             <p className="text-sm text-muted-foreground">Вес</p>
                             <p className="text-xl font-bold">{profile?.weight ?? 'N/A'}кг</p>
                           </div>
                           <div className="space-y-1">
                             <p className="text-sm text-muted-foreground">Телесный жир</p>
                             <p className="text-xl font-bold">{profile?.bodyFat ?? 'N/A'}%</p>
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
                                <p className="text-xl font-bold">N/A<span className="text-base text-muted-foreground">/10</span></p>
                            </div>
                           <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Телосложение</p>
                                <p className="text-xl font-bold">N/A</p>
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
                        <MetricRow title="Вес тела" value={profile?.weight} unit="кг" icon={<Scale className="h-6 w-6 text-primary"/>} metricId="weight" />
                        <MetricRow title="Телесный жир" value={profile?.bodyFat} unit="%" icon={<Percent className="h-6 w-6 text-primary"/>} metricId="body-fat" status={getStatusForFat(profile?.bodyFat)} />
                        <MetricRow title="Мышцы" value={profile?.muscleMass} unit="%" icon={<Dumbbell className="h-6 w-6 text-primary"/>} metricId="muscle-mass" />
                        <MetricRow title="Индекс висцерального жира" value={profile?.visceralFat} unit="" icon={<FileText className="h-6 w-6 text-primary"/>} metricId="visceral-fat" status={getStatusForVisceralFat(profile?.visceralFat)} />
                        <MetricRow title="СООВ" value={profile?.bmr} unit="ккал" icon={<Flame className="h-6 w-6 text-primary"/>} metricId="bmr" />
                        <MetricRow title="Вода в организме" value={profile?.water} unit="%" icon={<Droplets className="h-6 w-6 text-primary"/>} metricId="water" status={getStatusForWater(profile?.water, profile?.gender)} />
                        <MetricRow title="Скелетные мышцы" value={profile?.skeletalMuscle} unit="%" icon={<PersonStanding className="h-6 w-6 text-primary"/>} metricId="skeletal-muscle" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
