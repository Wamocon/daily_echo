import { getNotifPrefs } from '@/lib/storage';

/** Fragt Browser-Permission an, gibt true/false zurück */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

/** Zeigt sofortige Test-Notification */
export function showTestNotification(): void {
  if (typeof window === 'undefined' || Notification.permission !== 'granted') return;
  new Notification('DailyEcho 🌀', {
    body: 'Erinnerungen sind aktiviert! Du wirst jetzt an deine Check-ins erinnert.',
    icon: '/favicon.ico',
  });
}

/** Zeigt eine Notification */
function showNotification(title: string, body: string): void {
  if (typeof window === 'undefined' || Notification.permission !== 'granted') return;
  new Notification(title, { body, icon: '/favicon.ico' });
}

/** Berechnet Minuten bis zur nächsten vollen Zeit (HH:MM) */
function minutesUntil(timeStr: string): number {
  const now = new Date();
  const [hours, minutes] = timeStr.split(':').map(Number);
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1); // morgen
  return Math.round((target.getTime() - now.getTime()) / 60000);
}

const scheduledTimers: ReturnType<typeof setTimeout>[] = [];

/** Plant alle Erinnerungen basierend auf den gespeicherten Prefs */
export function scheduleNotifications(): void {
  if (typeof window === 'undefined') return;

  // Alle bestehenden Timer löschen
  scheduledTimers.forEach(clearTimeout);
  scheduledTimers.length = 0;

  const prefs = getNotifPrefs();
  if (!prefs.enabled || Notification.permission !== 'granted') return;

  // Morgen-Erinnerung
  const morningMs = minutesUntil(prefs.morningTime) * 60 * 1000;
  scheduledTimers.push(
    setTimeout(() => {
      showNotification('Guten Morgen! ☀️', 'Starte deinen Tag mit dem Morgen-Check-in in DailyEcho.');
      scheduleNotifications(); // für den nächsten Tag neu planen
    }, morningMs)
  );

  // Abend-Erinnerung
  const eveningMs = minutesUntil(prefs.eveningTime) * 60 * 1000;
  scheduledTimers.push(
    setTimeout(() => {
      showNotification('Guten Abend! 🌙', 'Nimm dir 5 Minuten für deinen Abend-Check-in.');
      scheduleNotifications();
    }, eveningMs)
  );

  // Quick Win Freitag-Erinnerung
  if (prefs.quickwinReminder) {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=So, 5=Fr
    const daysUntilFriday = ((5 - dayOfWeek + 7) % 7) || 7;
    const friday = new Date(now);
    friday.setDate(now.getDate() + daysUntilFriday);
    friday.setHours(10, 0, 0, 0);
    const fridayMs = friday.getTime() - now.getTime();
    scheduledTimers.push(
      setTimeout(() => {
        showNotification('Quick Win Erinnerung ⚡', 'Hast du diese Woche schon deine 2 Quick Wins erfasst?');
      }, fridayMs)
    );
  }
}
