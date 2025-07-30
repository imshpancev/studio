
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, MessageSquare, History, Rss, Bike, Waves, Map as MapIcon, Dumbbell, Footprints, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import WorkoutHistoryPage from "@/app/history/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { allSports } from '@/lib/workout-data';
import { useState, useEffect } from 'react';
import { getUserProfile, UserProfile } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';


const getSportIcon = (sport: string) => {
    switch (sport) {
        case 'Бег': return <Footprints className="h-4 w-4" />;
        case 'Тренажерный зал': return <Dumbbell className="h-4 w-4" />;
        case 'Йога': return <Rss className="h-4 w-4" />;
        case 'Велоспорт': return <Bike className="h-4 w-4" />;
        case 'Плавание': return <Waves className="h-4 w-4" />;
        default: return <Footprints className="h-4 w-4" />;
    }
}

export default function UserProfilePage() {
    const router = useRouter();
    const params = useParams();
    const userId = params.id as string;
    const { toast } = useToast();

    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // In a real app, 'isFollowing' and stats would come from a service
    const [isFollowing, setIsFollowing] = useState(false);
    const [followers, setFollowers] = useState(Math.floor(Math.random() * 500));
    const [following, setFollowing] = useState(Math.floor(Math.random() * 200));

    useEffect(() => {
        if (!userId) return;

        async function fetchUser() {
            try {
                setIsLoading(true);
                const userProfile = await getUserProfile(userId);
                setUser(userProfile);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Ошибка",
                    description: "Не удалось загрузить профиль пользователя."
                });
            } finally {
                setIsLoading(false);
            }
        }

        fetchUser();
    }, [userId, toast]);


    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-16 w-16 animate-spin" />
            </div>
        );
    }

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
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-3xl">{user.name}</CardTitle>
                    <CardDescription className="text-primary">{user.username}</CardDescription>
                </CardHeader>
                <CardContent className='text-center space-y-4'>
                    <p className="pt-2 text-muted-foreground max-w-md mx-auto">{user.bio}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {user.favoriteSports?.map(sport => (
                            <Badge key={sport} variant="secondary" className="flex items-center gap-1">
                                {getSportIcon(sport)}
                                {sport}
                            </Badge>
                        ))}
                    </div>
                     <div className="flex gap-6 pt-4 justify-center">
                        <div className="text-center">
                            <p className="font-bold text-lg">{followers}</p>
                            <p className="text-sm text-muted-foreground">Подписчики</p>
                        </div>
                         <div className="text-center">
                            <p className="font-bold text-lg">{following}</p>
                            <p className="text-sm text-muted-foreground">Подписки</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className='flex justify-center gap-2 border-t pt-6'>
                    <Button onClick={() => setIsFollowing(!isFollowing)}>
                        <UserPlus className="mr-2" />
                        {isFollowing ? 'Отписаться' : 'Подписаться'}
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
                    {/* The history page now fetches data based on the logged-in user.
                        For a public profile, this would need to be modified to accept a userId prop.
                        For now, this will show the LOGGED IN user's history, not the viewed user's.
                        This is a limitation to be addressed in a future step.
                     */}
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
