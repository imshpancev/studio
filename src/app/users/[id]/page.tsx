
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, MessageSquare, History, Rss } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { WorkoutHistoryPage } from '@/components/workout-history-page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


// Mock data for profiles - in a real app this would be fetched
const mockUsers = {
  '1': { id: '1', name: 'Иван Петров', handle: '@ivan_p', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', bio: 'Любитель марафонов и трейлраннинга.', isFollowing: false, followers: 125, following: 89 },
  '2': { id: '2', name: 'Елена Сидорова', handle: '@elena_fit', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', bio: 'Йога, пилатес и здоровое питание.', isFollowing: true, followers: 234, following: 120 },
  '3': { id: '3', name: 'Алексей Смирнов', handle: '@alex_power', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', bio: 'Пауэрлифтинг и силовые тренировки.', isFollowing: false, followers: 543, following: 50 },
  '4': { id: '4', name: 'Мария Кузнецова', handle: '@mariya_cycle', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704g', bio: 'Велоспорт и триатлон - моя страсть.', isFollowing: false, followers: 876, following: 210 },
};

type UserKey = keyof typeof mockUsers;

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
                    <p className="pt-2 text-muted-foreground max-w-md">{user.bio}</p>
                    <div className="flex gap-6 pt-4">
                        <div className="text-center">
                            <p className="font-bold text-lg">{user.followers}</p>
                            <p className="text-sm text-muted-foreground">Подписчики</p>
                        </div>
                         <div className="text-center">
                            <p className="font-bold text-lg">{user.following}</p>
                            <p className="text-sm text-muted-foreground">Подписки</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='flex justify-center gap-2'>
                    <Button>
                        <UserPlus className="mr-2" />
                        {user.isFollowing ? 'Отписаться' : 'Подписаться'}
                    </Button>
                     <Button variant="outline">
                        <MessageSquare className="mr-2" />
                        Сообщение
                    </Button>
                </CardContent>
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

    