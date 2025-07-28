
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, ShieldAlert, Heart, Brain } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function VisceralFatPage() {
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Button variant="ghost" onClick={() => router.push('/?tab=analytics')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к Аналитике
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-purple-500/10">
                <FileText className="h-8 w-8 text-purple-500" />
            </div>
            <div>
                 <CardTitle className="text-3xl">Висцеральный жир</CardTitle>
                 <CardDescription className="text-lg text-purple-500 font-bold">Индекс: 11 (Высокий)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-muted-foreground">
               Висцеральный жир — это тип жира, который скапливается в брюшной полости вокруг жизненно важных органов, таких как печень, поджелудочная железа и кишечник. Его высокий уровень связан с повышенным риском серьезных заболеваний.
            </p>

             <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4"/>
                <AlertTitle>Это важно для здоровья!</AlertTitle>
                <AlertDescription>
                    В отличие от подкожного жира, висцеральный жир является метаболически активным и может вызывать воспаление и резистентность к инсулину. Его снижение — ключевая задача для улучшения здоровья.
                </AlertDescription>
            </Alert>

             <div>
                <h3 className="font-semibold mb-2">Как снизить висцеральный жир:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li><span className='font-bold text-foreground'>Сбалансированная диета:</span> Сокращение сахара, обработанных продуктов и насыщенных жиров.</li>
                    <li><span className='font-bold text-foreground'>Регулярные аэробные упражнения:</span> Бег, плавание, езда на велосипеде.</li>
                    <li><span className='font-bold text-foreground'>Снижение стресса и качественный сон.</span></li>
                </ul>
            </div>

            <div>
                <h3 className="font-semibold mb-2">Шкала индекса:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li><span className='font-bold text-foreground'>Здоровый:</span> 1-9</li>
                    <li><span className='font-bold text-foreground'>Высокий:</span> 10-14</li>
                    <li><span className='font-bold text-foreground'>Очень высокий:</span> 15+</li>
                </ul>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
