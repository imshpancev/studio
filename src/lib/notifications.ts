
'use client';

import { toast } from "@/hooks/use-toast";

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
 * Shows a simple browser notification.
 * @param title - The title of the notification.
 * @param options - The body text and other options for the notification.
 */
function showNotification(title: string, options: NotificationOptions) {
  new Notification(title, options);
}

/**
 * A specific notification function to remind the user to warm up.
 */
export async function showWarmupNotification() {
  const hasPermission = await checkNotificationPermission();
  
  // Also show a toast as a fallback or primary UI element
  toast({
    title: 'Не забудьте размяться!',
    description: 'Хорошая разминка - ключ к безопасной и эффективной тренировке.',
  });
  
  if (hasPermission) {
    showNotification('Время для разминки!', {
      body: 'Подготовьте свои мышцы и суставы к предстоящей нагрузке.',
      icon: '/logo.svg', // You might need to add a logo to your /public folder
    });
  }
}
