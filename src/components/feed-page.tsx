
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from './ui/button';
import { Clock, Flame, Map, Heart, MessageCircle, Rss, UserPlus, Trophy } from "lucide-react";
import { Badge } from './ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { UsersPage } from './users-page';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useState, useEffect } from 'react';
import { getLeaderboardData, UserProfile } from '@/services/userService';
import { auth } from '@/lib/firebase';
import { Skeleton } from './ui/skeleton';
import { getFeedWorkouts, WorkoutWithUser } from '@/services/workoutService';


export function FeedPage() {
    const router = useRouter();
    const [leaderboardData, setLeaderboardData] = useState<UserProfile[]>([]);
    const [feedItems, setFeedItems] = useState<WorkoutWithUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const currentUser = auth.currentUser;

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const [leaderboard, feed] = await Promise.all([
                    getLeaderboardData(),
                    getFeedWorkouts(currentUser?.uid || '')
                ]);
                setLeaderboardData(leaderboard);
                setFeedItems(feed);
            } catch (error) {
                console.error("Failed to fetch feed or leaderboard", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [currentUser]);

    const handleWorkoutClick = (item: any) => {
        // We don't need to pass the whole item in the query anymore
        router.push(`/history/${item.id}`);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
             <Card>
                <CardHeader>
                   <div className="flex justify-between items-center">
                     <CardTitle className="flex items-center gap-2"><Rss />Лента активности</CardTitle>
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline"><UserPlus/>Найти друзей</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl w-full">
                           <DialogHeader>
                               <DialogTitle>Поиск пользователей</DialogTitle>
                               <DialogDescription>
                                    Находите друзей и единомышленников, чтобы следить за их прогрессом.
                               </DialogDescription>
                           </DialogHeader>
                           <div className="max-h-[70vh] overflow-y-auto pr-2">
                             <UsersPage />
                           </div>
                        </DialogContent>
                     </Dialog>
                   </div>
                    <CardDescription>
                        Последние тренировки людей, на которых вы подписаны.
                    </CardDescription>
                </CardHeader>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Trophy />Таблица лидеров сообщества (Неделя)</CardTitle>
                    <CardDescription>Сравните свой прогресс с друзьями.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Место</TableHead>
                                <TableHead>Пользователь</TableHead>
                                <TableHead className="text-right">Дистанция (км)</TableHead>
                                <TableHead className="text-right">Шаги</TableHead>
                                <TableHead className="text-right">Калории</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderboardData.map((user, index) => (
                                <TableRow key={user.uid} className={user.uid === currentUser?.uid ? 'bg-muted/50' : ''}>
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <Link href={`/users/${user.uid}`} className="font-medium hover:underline">{user.uid === currentUser?.uid ? 'Вы' : user.name}</Link>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{user.totalDistance?.toFixed(1) || 0}</TableCell>
                                    <TableCell className="text-right">{user.totalSteps?.toLocaleString() || 0}</TableCell>
                                    <TableCell className="text-right">{user.totalCalories?.toLocaleString() || 0}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>


            {isLoading && (
                 <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                 </div>
            )}
            
            {!isLoading && feedItems.map((item, index) => {
                if (!item.user) return null;
                return (
                    <Card key={index}>
                        <CardHeader className="flex flex-row gap-3 space-y-0">
                           <Link href={`/users/${item.user.uid}`}>
                                <Avatar>
                                    <AvatarImage src={item.user.avatar} alt={item.user.name} />
                                    <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </Link>
                            <div className="flex-1">
                                <Link href={`/users/${item.user.uid}`} className="hover:underline">
                                    <p className="font-semibold">{item.user.name}</p>
                                </Link>
                                <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
                            </div>
                        </CardHeader>
                        <CardContent 
                            className="p-4 border-y cursor-pointer hover:bg-muted/50"
                             onClick={() => handleWorkoutClick(item)}
                        >
                             <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                             <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                <Badge variant="outline">{item.type}</Badge>
                                <div className="flex items-center gap-1"><Clock className="h-4 w-4" /> {item.duration}</div>
                                <div className="flex items-center gap-1"><Flame className="h-4 w-4" /> {item.calories} ккал</div>
                                {item.distance && <div className="flex items-center gap-1"><Map className="h-4 w-4" /> {item.distance}</div>}
                            </div>
                        </CardContent>
                         <CardContent className="p-2 flex justify-start gap-1">
                             <Button variant="ghost" size="sm"><Heart className="mr-2" />Нравится</Button>
                             <Button variant="ghost" size="sm"><MessageCircle className="mr-2" />Комментировать</Button>
                        </CardContent>
                    </Card>
                )
            })}

             {!isLoading && feedItems.length === 0 && (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        <p className="font-semibold">Ваша лента пока пуста</p>
                        <p>Подпишитесь на других пользователей, чтобы видеть их тренировки здесь.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
