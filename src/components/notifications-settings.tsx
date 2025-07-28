
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const notificationsSchema = z.object({
  workoutReminders: z.boolean().default(true),
  motivationalMessages: z.boolean().default(true),
  weeklyReports: z.boolean().default(false),
  warmupReminders: z.boolean().default(true),
});

export function NotificationsSettings() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof notificationsSchema>>({
    resolver: zodResolver(notificationsSchema),
    defaultValues: {
      workoutReminders: true,
      motivationalMessages: true,
      weeklyReports: false,
      warmupReminders: true,
    },
  });

  function onSubmit(values: z.infer<typeof notificationsSchema>) {
    console.log('Notification settings saved:', values);
    // In a real app, save these settings to the user's profile in the database
    toast({
      title: 'Настройки уведомлений сохранены!',
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Bell />
            Управление уведомлениями
        </CardTitle>
        <CardDescription>
          Выберите, какие уведомления вы хотите получать от приложения.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="workoutReminders"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Напоминания о тренировках</FormLabel>
                      <FormDescription>
                        Получать уведомления о запланированных на сегодня тренировках.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="motivationalMessages"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Мотивационные сообщения</FormLabel>
                      <FormDescription>
                        Получать советы и мотивацию, чтобы не сбиться с пути.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="warmupReminders"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Напоминания о разминке</FormLabel>
                      <FormDescription>
                        Получать напоминание о необходимости размяться перед тренировкой.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-readonly
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weeklyReports"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Еженедельные отчеты</FormLabel>
                      <FormDescription>
                        Получать сводку вашего прогресса каждую неделю.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Сохранить настройки</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
