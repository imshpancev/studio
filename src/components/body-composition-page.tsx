
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Bone, Droplets, HeartPulse, Info, Leaf, LineChart, Scale, Trash2 } from "lucide-react";

// Mock data, in a real app this would be fetched from a health service
const bodyCompData = {
    skeletalMuscle: { value: 37.9, unit: '%', status: 'normal' },
    protein: { value: 19.8, unit: '%', status: 'normal' },
    boneMass: { value: 3.8, unit: 'кг', status: 'normal' },
    bmi: { value: 28.1, unit: '', status: 'high' },
    bodyTone: { value: 6.3, unit: '', status: 'normal' },
    restingHeartRate: { value: 100, unit: 'уд/мин', status: 'high' },
    bodyType: { value: 'Крупное', description: 'Пищевой дисбаланс; потребление большого объема пищи, сидячий образ жизни ...' },
    metabolicAge: { value: 35, unit: 'лет', status: 'normal' },
    measurementTime: '21/июля/2025 07:52'
};

const statusColors = {
    normal: 'text-green-500',
    high: 'text-orange-500',
    low: 'text-yellow-500',
};

const statusArrows = {
    normal: <LineChart className="h-4 w-4" />,
    high: <ArrowUp className="h-4 w-4" />,
    low: <ArrowDown className="h-4 w-4" />,
}


const MetricCard = ({ title, value, unit, status, icon }: { title: string, value: number | string, unit: string, status: 'normal' | 'high' | 'low', icon: React.ReactNode }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">{icon}{title}</CardTitle>
                 <div className={statusColors[status]}>
                     {statusArrows[status]}
                 </div>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${statusColors[status]}`}>{value} <span className="text-sm font-normal text-muted-foreground">{unit}</span></div>
            </CardContent>
        </Card>
    )
};


export function BodyCompositionPage() {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Отчет об измерениях</CardTitle>
                        <CardDescription>
                            Данные синхронизированы с Apple Health. Последнее измерение: {bodyCompData.measurementTime}
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Стандартный и безопасный</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <MetricCard title="Скелетные мышцы" value={bodyCompData.skeletalMuscle.value} unit={bodyCompData.skeletalMuscle.unit} status={bodyCompData.skeletalMuscle.status as any} icon={<Leaf />} />
                        <MetricCard title="Белок" value={bodyCompData.protein.value} unit={bodyCompData.protein.unit} status={bodyCompData.protein.status as any} icon={<Droplets />} />
                        <MetricCard title="Костная масса" value={bodyCompData.boneMass.value} unit={bodyCompData.boneMass.unit} status={bodyCompData.boneMass.status as any} icon={<Bone />} />
                    </div>
                </div>
                 <div>
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Другие индикаторы</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <MetricCard title="Индекс массы тела (ИМТ)" value={bodyCompData.bmi.value} unit={bodyCompData.bmi.unit} status={bodyCompData.bmi.status as any} icon={<Scale />} />
                        <MetricCard title="Пульс в состоянии покоя" value={bodyCompData.restingHeartRate.value} unit={bodyCompData.restingHeartRate.unit} status={bodyCompData.restingHeartRate.status as any} icon={<HeartPulse />} />
                        <MetricCard title="Метаболический возраст" value={bodyCompData.metabolicAge.value} unit={bodyCompData.metabolicAge.unit} status={bodyCompData.metabolicAge.status as any} icon={<Info />} />
                    </div>
                </div>
                <div>
                     <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2">Общее заключение</h3>
                     <Card>
                        <CardContent className="p-6">
                             <CardTitle className="mb-2">Телосложение: {bodyCompData.bodyType.value}</CardTitle>
                             <p className="text-muted-foreground">{bodyCompData.bodyType.description}</p>
                             <Button variant="link" className="px-0">Все виды телосложения</Button>
                        </CardContent>
                     </Card>
                </div>
            </CardContent>
        </Card>
    );
}
