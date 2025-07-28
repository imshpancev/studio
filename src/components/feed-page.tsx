
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from './ui/button';
import { Clock, Dumbbell, Flame, Map, Zap, Calendar, History, Heart, MessageCircle, Rss } from "lucide-react";
import { Badge } from './ui/badge';
import { historyItems } from '@/app/history/page';

// Mock data for a user's feed
const feedItems = [
    {
        user: { id: '2', name: 'Елена Сидорова', handle: '@elena_fit', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
        workout: historyItems.find(h => h.id === 3), // Yoga
        timestamp: '2 часа назад'
    },
    {
        user: { id: '1', name: 'Иван Петров', handle: '@ivan_p', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        workout: historyItems.find(h => h.id === 1), // Run
        timestamp: 'Вчера'
    },
    {
        user: { id: '4', name: 'Мария Кузнецова', handle: '@mariya_cycle', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704g' },
        workout: historyItems.find(h => h.id === 5), // Cycling
        timestamp: '3 дня назад'
    }
];

export function FeedPage() {
    const router = useRouter();

    const handleWorkoutClick = (item: any) => {
        const itemQuery = encodeURIComponent(JSON.stringify(item));
        router.push(`/history/${item.id}?data=${itemQuery}`);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Rss />Лента активности</CardTitle>
                    <CardDescription>
                        Последние тренировки людей, на которых вы подписаны.
                    </CardDescription>
                </CardHeader>
            </Card>

            {feedItems.map((item, index) => {
                if (!item.workout) return null;
                return (
                    <Card key={index}>
                        <CardHeader className="flex flex-row gap-3 space-y-0">
                           <Link href={`/users/${item.user.id}`}>
                                <Avatar>
                                    <AvatarImage src={item.user.avatar} alt={item.user.name} />
                                    <AvatarFallback>{item.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </Link>
                            <div className="flex-1">
                                <Link href={`/users/${item.user.id}`} className="hover:underline">
                                    <p className="font-semibold">{item.user.name}</p>
                                </Link>
                                <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                            </div>
                        </CardHeader>
                        <CardContent 
                            className="p-4 border-y cursor-pointer hover:bg-muted/50"
                             onClick={() => handleWorkoutClick(item.workout)}
                        >
                             <h4 className="font-semibold text-lg mb-2">{item.workout.title}</h4>
                             <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                <Badge variant="outline">{item.workout.type}</Badge>
                                <div className="flex items-center gap-1"><Clock className="h-4 w-4" /> {item.workout.duration}</div>
                                <div className="flex items-center gap-1"><Flame className="h-4 w-4" /> {item.workout.calories} ккал</div>
                                {item.workout.distance && <div className="flex items-center gap-1"><Map className="h-4 w-4" /> {item.workout.distance}</div>}
                            </div>
                        </CardContent>
                         <CardContent className="p-2 flex justify-start gap-1">
                             <Button variant="ghost" size="sm"><Heart className="mr-2" />Нравится</Button>
                             <Button variant="ghost" size="sm"><MessageCircle className="mr-2" />Комментировать</Button>
                        </CardContent>
                    </Card>
                )
            })}

             {feedItems.length === 0 && (
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
