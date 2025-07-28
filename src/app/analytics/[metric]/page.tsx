
'use client';

import { useParams, useRouter } from 'next/navigation';
import ReadinessDetailPage from '../readiness/page';
import SleepDetailPage from '../sleep/page';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, HelpCircle } from 'lucide-react';


const componentMap: Record<string, React.ComponentType> = {
    readiness: ReadinessDetailPage,
    sleep: SleepDetailPage,
    // Add other detail pages here as they are created
};

export default function MetricDetailPage() {
    const params = useParams();
    const router = useRouter();
    const metric = Array.isArray(params.metric) ? params.metric[0] : params.metric;

    const MetricComponent = componentMap[metric];

    if (!MetricComponent) {
        return (
             <div className="max-w-4xl mx-auto p-4 md:p-8">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Назад к Аналитике
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

    