
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const mockUsers = [
  { id: '1', name: 'Иван Петров', handle: '@ivan_p', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', bio: 'Любитель марафонов и трейлраннинга.', isFollowing: false },
  { id: '2', name: 'Елена Сидорова', handle: '@elena_fit', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', bio: 'Йога, пилатес и здоровое питание.', isFollowing: true },
  { id: '3', name: 'Алексей Смирнов', handle: '@alex_power', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', bio: 'Пауэрлифтинг и силовые тренировки.', isFollowing: false },
  { id: '4', name: 'Мария Кузнецова', handle: '@mariya_cycle', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704g', bio: 'Велоспорт и триатлон - моя страсть.', isFollowing: false },
];


export function UsersPage() {
    const [users, setUsers] = useState(mockUsers);
    const { toast } = useToast();
    
    const handleFollowToggle = (userId: string) => {
        setUsers(currentUsers =>
            currentUsers.map(user => {
                if (user.id === userId) {
                    const wasFollowing = user.isFollowing;
                    toast({
                        title: wasFollowing ? `Вы отписались от ${user.name}` : `Вы подписались на ${user.name}`,
                    });
                    return { ...user, isFollowing: !user.isFollowing };
                }
                return user;
            })
        );
    };

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Поиск по имени или никнейму..." className="pl-10" />
            </div>

            <div className="space-y-4">
                {users.map(user => (
                    <div key={user.id} className="flex items-center gap-4">
                         <Link href={`/users/${user.id}`} className="flex items-center gap-4 flex-1 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.handle}</p>
                                <p className="text-xs text-muted-foreground mt-1 truncate">{user.bio}</p>
                            </div>
                        </Link>
                        <Button 
                            variant={user.isFollowing ? 'secondary' : 'default'}
                            onClick={() => handleFollowToggle(user.id)}
                            size="sm"
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            {user.isFollowing ? 'Отписаться' : 'Подписаться'}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
