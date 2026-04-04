export class NotificationService {
  constructor() {
    this.notificationPermission = typeof Notification !== 'undefined' ? Notification.permission : 'denied';
  }

  async requestPermission() {
    if (typeof Notification === 'undefined') return false;

    if (this.notificationPermission !== 'granted') {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission;
      return permission === 'granted';
    }
    return true;
  }

  show(title, body, vibrate = true, sound = true) {
    if (!this.notificationPermission || this.notificationPermission !== 'granted') {
      console.warn('Notification permission not granted.');
      return false;
    }

    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title, {
            body,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            vibrate: vibrate ? [200, 100, 200] : undefined,
            tag: 'soc-de-poble-notification',
            renotify: true,
          });
        });
      } else {
        new Notification(title, { 
          body,
          icon: '/icons/icon-192x192.png'
        });
      }

      if (sound && typeof window !== 'undefined') {
        const audio = new Audio('/assets/sounds/notification.mp3');
        audio.play().catch(e => console.warn('Audio play failed', e));
      }

      return true;
    } catch (error) {
      console.error('Error showing notification', error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();
