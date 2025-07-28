
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PersonStanding, Dumbbell, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect, useState } from 'react';
import { getUserProfile } from '@/services/userService';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function SkeletalMusclePage() {
  const router = useRouter();
  const { toast } = useToast();
  const user = auth.currentUser;
  const [skeletalMuscle, setSkeletalMuscle] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        return;
    }
    async function fetchData() {
        try {
            const profile = await getUserProfile(user.uid, user.email || '');
            setSkeletalMuscle(profile.skeletalMuscle || 37.9); // fallback to mock
        } catch (e) {
            toast({ variant: 'destructive', title: 'Ошибка', description: 'Не удалось загрузить данные о скелетных мышцах.' });
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [user, toast]);
  
  const status = skeletalMuscle ? (skeletalMuscle < 33 ? '(Низкий)' : skeletalMuscle > 39 ? '(Высокий)' : '(Норма)') : '';

  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Button variant="ghost" onClick={() => router.push('/?tab=analytics')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад к Аналитике
      </Button>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full bg-teal-500/10">
                <PersonStanding className="h-8 w-8 text-teal-500" />
            </div>
            <div>
                 <CardTitle className="text-3xl">Скелетные мышцы</CardTitle>
                 <CardDescription className="text-lg text-teal-500 font-bold">{skeletalMuscle}% {status}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-muted-foreground">
                Скелетные мышцы — это тип мышц, который прикрепляется к костям и отвечает за движение. Это те самые мышцы, которые вы тренируете в зале. Их увеличение не только делает вас сильнее, но и значительно ускоряет метаболизм.
            </p>

             <Alert>
                <Dumbbell className="h-4 w-4"/>
                <AlertTitle>Ключевой показатель силы</AlertTitle>
                <AlertDescription>
                   В отличие от общей мышечной массы (которая включает гладкие мышцы и воду), процент скелетных мышц напрямую отражает результаты ваших силовых тренировок.
                </AlertDescription>
            </Alert>

             <div>
                <h3 className="font-semibold mb-2">Нормы для мужчин (возраст 18-39):</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li><span className='font-bold text-foreground'>Низкий:</span> &lt;33%</li>
                    <li><span className='font-bold text-foreground'>Норма:</span> 33 - 39%</li>
                    <li><span className='font-bold text-foreground'>Высокий:</span> &gt;39%</li>
                </ul>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
