
'use client';

import { Bell, CheckCircle, Clock } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const notifications = [
    {
        type: 'follow',
        user: 'Иван Петров',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        text: 'начал(а) отслеживать вас.',
        time: '5 минут назад'
    },
    {
        type: 'workout',
        user: 'Елена Сидорова',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
        text: 'завершил(а) тренировку "Вечерняя пробежка".',
        time: '1 час назад'
    },
    {
        type: 'report',
        user: '',
        avatar: '',
        text: 'Ваш еженедельный отчет о прогрессе готов.',
        time: '3 часа назад'
    }
];


export function NotificationBell() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Открыть уведомления</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
            <div className="space-y-2">
                <h4 className="font-medium leading-none">Уведомления</h4>
                <p className="text-sm text-muted-foreground">
                    Последние обновления и активность.
                </p>
            </div>
            <Tabs defaultValue="all" className="w-full">
                <TabsList className='grid w-full grid-cols-2'>
                    <TabsTrigger value="all">Все</TabsTrigger>
                    <TabsTrigger value="unread">Непрочитанные</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className='mt-4 space-y-4'>
                    {notifications.map((n, i) => (
                        <div key={i} className="flex items-start gap-3">
                            {n.type === 'report' ? (
                                 <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                            ) : (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={n.avatar} alt={n.user} />
                                    <AvatarFallback>{n.user.charAt(0)}</AvatarFallback>
                                </Avatar>
                            )}
                            <div className='flex-1'>
                                <p className='text-sm'>
                                    {n.user && <span className='font-semibold'>{n.user}</span>} {n.text}
                                </p>
                                 <p className='text-xs text-muted-foreground flex items-center gap-1 mt-1'>
                                    <Clock className='h-3 w-3' /> {n.time}
                                 </p>
                            </div>
                        </div>
                    ))}
                </TabsContent>
                 <TabsContent value="unread">
                    <div className="flex flex-col items-center justify-center h-24 text-center">
                        <p className="text-sm font-medium">Нет непрочитанных уведомлений</p>
                        <p className="text-xs text-muted-foreground">Вы все просмотрели!</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
}
