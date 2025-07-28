

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { getAllUsers, UserProfile } from '@/services/userService';
import { Skeleton } from './ui/skeleton';


export function UsersPage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [followingState, setFollowingState] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();
    
    useEffect(() => {
        async function fetchUsers() {
            try {
                const fetchedUsers = await getAllUsers();
                setUsers(fetchedUsers);
                 // In a real app, you'd fetch the current user's following list
                const initialFollowing: Record<string, boolean> = {};
                fetchedUsers.forEach(u => initialFollowing[u.uid] = false); // Mocked state
                setFollowingState(initialFollowing);
            } catch (error) {
                 toast({
                    variant: 'destructive',
                    title: 'Ошибка',
                    description: 'Не удалось загрузить список пользователей.',
                });
            } finally {
                setIsLoading(false);
            }
        }
        fetchUsers();
    }, [toast]);

    const handleFollowToggle = (userId: string, name?: string) => {
        setFollowingState(current => {
            const isCurrentlyFollowing = !!current[userId];
            toast({
                title: isCurrentlyFollowing ? `Вы отписались от ${name}` : `Вы подписались на ${name}`,
            });
            return { ...current, [userId]: !isCurrentlyFollowing };
        });
        // Here you would also call a service to update the follow status in the database
    };
    
    const filteredUsers = users.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                             <Skeleton className="h-4 w-1/2" />
                             <Skeleton className="h-3 w-3/4" />
                        </div>
                        <Skeleton className="h-9 w-28 rounded-md" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Поиск по имени или никнейму..." 
                    className="pl-10" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="space-y-4">
                {filteredUsers.map(user => (
                    <div key={user.uid} className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                         <Link href={`/users/${user.uid}`} className="flex items-center gap-4 flex-1">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.username}</p>
                            </div>
                        </Link>
                        <Button 
                            variant={followingState[user.uid] ? 'secondary' : 'default'}
                            onClick={() => handleFollowToggle(user.uid, user.name)}
                            size="sm"
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            {followingState[user.uid] ? 'Отписаться' : 'Подписаться'}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
