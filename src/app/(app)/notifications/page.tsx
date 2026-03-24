'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Clock, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { NotificationPrefs } from '@/types';
import { getNotifPrefs, saveNotifPrefs } from '@/lib/storage';
import { requestNotificationPermission, showTestNotification, scheduleNotifications } from '@/lib/notifications';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/material-design-3-switch';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(getNotifPrefs());
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleEnable = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setPermission('granted');
      const updated = { ...prefs, enabled: true };
      setPrefs(updated);
      saveNotifPrefs(updated);
      scheduleNotifications();
      showTestNotification();
    } else {
      setPermission(Notification.permission);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    saveNotifPrefs(prefs);
    scheduleNotifications();
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updatePref = <K extends keyof NotificationPrefs>(key: K, value: NotificationPrefs[K]) => {
    setPrefs((p) => ({ ...p, [key]: value }));
    setSaved(false);
  };

  const notifSupported = typeof window !== 'undefined' && 'Notification' in window;

  return (
    <div className="min-h-screen px-4 pt-8 pb-32 lg:pb-8 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-none">Erinnerungen</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Browser-Benachrichtigungen konfigurieren</p>
          </div>
        </div>

        {/* Permission Status */}
        {!notifSupported ? (
          <div className="bg-muted/50 border border-dashed rounded-2xl p-4 flex items-center gap-3 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Dein Browser unterstützt keine Benachrichtigungen.
          </div>
        ) : permission === 'denied' ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-start gap-3">
            <BellOff className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-destructive">Benachrichtigungen blockiert</p>
              <p className="text-xs text-muted-foreground mt-1">
                Bitte erlaube Benachrichtigungen in den Browser-Einstellungen für diese Seite und lade dann neu.
              </p>
            </div>
          </div>
        ) : permission === 'default' ? (
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 flex flex-col gap-3">
            <p className="text-sm font-medium">Benachrichtigungen aktivieren</p>
            <p className="text-xs text-muted-foreground">
              DailyEcho kann dich morgens und abends an deinen Check-in erinnern sowie freitags an die Quick Wins.
            </p>
            <Button onClick={handleEnable} size="sm" className="self-start gap-2">
              <Bell className="w-4 h-4" />
              Erlauben & aktivieren
            </Button>
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
            <p className="text-sm font-medium text-green-700 dark:text-green-400">Benachrichtigungen erlaubt</p>
            <button
              onClick={showTestNotification}
              className="ml-auto text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Test senden
            </button>
          </div>
        )}

        {/* Settings */}
        {notifSupported && permission === 'granted' && (
          <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
            {/* Master Toggle */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Bell className={cn('w-4 h-4', prefs.enabled ? 'text-primary' : 'text-muted-foreground')} />
                <div>
                  <p className="text-sm font-medium">Erinnerungen aktiv</p>
                  <p className="text-xs text-muted-foreground">Alle Benachrichtigungen ein/aus</p>
                </div>
              </div>
              <Switch
                size="sm"
                checked={prefs.enabled}
                onCheckedChange={(v) => updatePref('enabled', v)}
              />
            </div>

            {/* Morning Time */}
            <div className={cn(
              'flex items-center justify-between px-5 py-4 border-b border-border transition-opacity',
              !prefs.enabled && 'opacity-40 pointer-events-none'
            )}>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Morgen-Erinnerung</p>
                  <p className="text-xs text-muted-foreground">Täglich für den Morgen-Check-in</p>
                </div>
              </div>
              <input
                type="time"
                value={prefs.morningTime}
                onChange={(e) => updatePref('morningTime', e.target.value)}
                className="bg-muted border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Evening Time */}
            <div className={cn(
              'flex items-center justify-between px-5 py-4 border-b border-border transition-opacity',
              !prefs.enabled && 'opacity-40 pointer-events-none'
            )}>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-indigo-500" />
                <div>
                  <p className="text-sm font-medium">Abend-Erinnerung</p>
                  <p className="text-xs text-muted-foreground">Täglich für den Abend-Check-in</p>
                </div>
              </div>
              <input
                type="time"
                value={prefs.eveningTime}
                onChange={(e) => updatePref('eveningTime', e.target.value)}
                className="bg-muted border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Quick Win Reminder */}
            <div className={cn(
              'flex items-center justify-between px-5 py-4 transition-opacity',
              !prefs.enabled && 'opacity-40 pointer-events-none'
            )}>
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Quick Win Erinnerung</p>
                  <p className="text-xs text-muted-foreground">Freitags: Hast du 2 Quick Wins erfasst?</p>
                </div>
              </div>
              <Switch
                size="sm"
                checked={prefs.quickwinReminder}
                onCheckedChange={(v) => updatePref('quickwinReminder', v)}
              />
            </div>
          </div>
        )}

        {notifSupported && permission === 'granted' && (
          <Button onClick={handleSave} disabled={saving} className="self-end gap-2">
            {saving ? 'Speichern…' : saved ? '✓ Gespeichert' : 'Einstellungen speichern'}
          </Button>
        )}
      </motion.div>
    </div>
  );
}
