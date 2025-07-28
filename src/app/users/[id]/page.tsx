

'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, MessageSquare, History, Rss, Bike, Waves, Map as MapIcon, Dumbbell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { WorkoutHistoryPage } from '@/components/workout-history-page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { allSports } from '@/lib/workout-data';
import { RunIcon } from '@/components/icons/run-icon';


// Mock data for profiles - in a real app this would be fetched
const mockUsers = {
  '1': { id: '1', name: 'Иван Петров', handle: '@ivan_p', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', bio: 'Любитель марафонов и трейлраннинга. Ищу компанию для длительных пробежек по выходным.', isFollowing: false, followers: 125, following: 89, favoriteSports: ['Бег', 'Велоспорт'] },
  '2': { id: '2', name: 'Елена Сидорова', handle: '@elena_fit', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', bio: 'Йога, пилатес и здоровое питание. Верю в гармонию тела и духа.', isFollowing: true, followers: 234, following: 120, favoriteSports: ['Йога'] },
  '3': { id: '3', name: 'Алексей Смирнов', handle: '@alex_power', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', bio: 'Пауэрлифтинг и силовые тренировки. Цель: пожать 200 кг.', isFollowing: false, followers: 543, following: 50, favoriteSports: ['Тренажерный зал'] },
  '4': { id: '4', name: 'Мария Кузнецова', handle: '@mariya_cycle', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704g', bio: 'Велоспорт и триатлон - моя страсть. Готовлюсь к полному Ironman.', isFollowing: false, followers: 876, following: 210, favoriteSports: ['Велоспорт', 'Плавание', 'Бег', 'Триатлон'] },
};

type UserKey = keyof typeof mockUsers;

const getSportIcon = (sport: string) => {
    switch (sport) {
        case 'Бег': return <RunIcon className="h-4 w-4" />;
        case 'Тренажерный зал': return <Dumbbell className="h-4 w-4" />;
        case 'Йога': return <Rss className="h-4 w-4" />;
        case 'Велоспорт': return <Bike className="h-4 w-4" />;
        case 'Плавание': return <Waves className="h-4 w-4" />;
        default: return <RunIcon className="h-4 w-4" />;
    }
}

export default function UserProfilePage() {
    const router = useRouter();
    const params = useParams();
    const userId = params.id as UserKey;

    const user = mockUsers[userId];

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p>Пользователь не найден.</p>
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
             <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
            </Button>
             <Card>
                <CardHeader className="text-center items-center">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-3xl">{user.name}</CardTitle>
                    <CardDescription className="text-primary">{user.handle}</CardDescription>
                </CardHeader>
                <CardContent className='text-center space-y-4'>
                    <p className="pt-2 text-muted-foreground max-w-md mx-auto">{user.bio}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {user.favoriteSports.map(sport => (
                            <Badge key={sport} variant="secondary" className="flex items-center gap-1">
                                {getSportIcon(sport)}
                                {sport}
                            </Badge>
                        ))}
                    </div>
                     <div className="flex gap-6 pt-4 justify-center">
                        <div className="text-center">
                            <p className="font-bold text-lg">{user.followers}</p>
                            <p className="text-sm text-muted-foreground">Подписчики</p>
                        </div>
                         <div className="text-center">
                            <p className="font-bold text-lg">{user.following}</p>
                            <p className="text-sm text-muted-foreground">Подписки</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className='flex justify-center gap-2 border-t pt-6'>
                    <Button>
                        <UserPlus className="mr-2" />
                        {user.isFollowing ? 'Отписаться' : 'Подписаться'}
                    </Button>
                     <Button variant="outline">
                        <MessageSquare className="mr-2" />
                        Сообщение
                    </Button>
                </CardFooter>
            </Card>

            <Tabs defaultValue="history" className="w-full mt-8">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="history" className='gap-2'><History />История тренировок</TabsTrigger>
                    <TabsTrigger value="feed" className='gap-2'><Rss />Публикации</TabsTrigger>
                </TabsList>
                <TabsContent value="history" className='mt-4'>
                    {/* Re-using the component, but in a real app it would fetch this user's data */}
                    <WorkoutHistoryPage /> 
                </TabsContent>
                <TabsContent value="feed" className='mt-4'>
                    <Card>
                        <CardContent className="p-8 text-center text-muted-foreground">
                            У {user.name} еще нет публикаций.
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

        </div>
    )
}
