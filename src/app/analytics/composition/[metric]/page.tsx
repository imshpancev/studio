
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import WeightPage from '@/app/analytics/composition/weight/page';
import BodyFatPage from '@/app/analytics/composition/body-fat/page';
import MuscleMassPage from '@/app/analytics/composition/muscle-mass/page';


const componentMap: Record<string, React.ComponentType> = {
    'weight': WeightPage,
    'body-fat': BodyFatPage,
    'muscle-mass': MuscleMassPage,
    // Add other detail pages here as they are created
    // 'visceral-fat': VisceralFatPage,
    // 'bmr': BmrPage,
    // 'water': WaterPage,
    // 'skeletal-muscle': SkeletalMusclePage,
};

export default function CompositionMetricDetailPage() {
    const params = useParams();
    const router = useRouter();
    const metric = Array.isArray(params.metric) ? params.metric[0] : params.metric;

    const MetricComponent = componentMap[metric];

    if (!MetricComponent) {
        return (
             <div className="max-w-4xl mx-auto p-4 md:p-8">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Назад к составу тела
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'><HelpCircle/>Страница не найдена</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Подробная информация для метрики "{metric}" еще не создана.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return <MetricComponent />;
}

    
