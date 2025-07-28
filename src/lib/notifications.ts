
'use client';

import { toast } from "@/hooks/use-toast";

/**
 * Represents the user's notification preferences.
 * In a real app, this would be fetched from a user settings service.
 */
interface NotificationPreferences {
  workoutReminders: boolean;
  motivationalMessages: boolean;
  weeklyReports: boolean;
  warmupReminders: boolean;
}

// Mock user preferences. Replace with actual data fetching.
const userPreferences: NotificationPreferences = {
  workoutReminders: true,
  motivationalMessages: true,
  weeklyReports: false,
  warmupReminders: true,
};

/**
 * Checks if the browser supports notifications and if permission is granted.
 * @returns Promise<boolean> - True if notifications are supported and granted.
 */
async function checkNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn("This browser does not support desktop notification");
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Shows a simple browser notification if the user has allowed it.
 * @param title - The title of the notification.
 * @param options - The body text and other options for the notification.
 */
async function showBrowserNotification(title: string, options: NotificationOptions) {
    const hasPermission = await checkNotificationPermission();
    if (hasPermission) {
        new Notification(title, options);
    }
}


/**
 * A specific notification function to remind the user to warm up.
 * It shows both a toast and a browser notification.
 */
export async function showWarmupNotification() {
  // Always show the in-app toast
  toast({
    title: 'Не забудьте размяться!',
    description: 'Хорошая разминка - ключ к безопасной и эффективной тренировке.',
  });
  
  // Show browser notification only if user has enabled it in settings
  if (userPreferences.warmupReminders) {
    await showBrowserNotification('Время для разминки!', {
      body: 'Подготовьте свои мышцы и суставы к предстоящей нагрузке.',
      icon: '/logo.svg', // You might need to add a logo to your /public folder
    });
  }
}

/**
 * Shows a motivational message to the user.
 */
export async function showMotivationNotification() {
    if(userPreferences.motivationalMessages) {
        toast({
            title: 'Вы на верном пути!',
            description: 'Каждая тренировка - это шаг к вашей цели. Продолжайте в том же духе!'
        });
        await showBrowserNotification('Так держать!', {
            body: 'Помните о своей цели и продолжайте двигаться вперед!',
            icon: '/logo.svg'
        });
    }
}
