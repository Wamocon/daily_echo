'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  DEMO_ACCOUNTS, ROLE_LABELS, ROLE_COLORS,
  getAdminOverrides, saveAdminOverrides, getEffectiveDemoAccounts,
  AccountOverride,
} from '@/lib/auth';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Users, Activity, Zap, Flame, ShieldCheck, Pencil, X, Check, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
  const { profile, weeklyGoal, unlockedAchievements } = useAppStore();
  const { currentUser, login } = useAuthStore();

  // User management state
  const [accounts, setAccounts] = useState(getEffectiveDemoAccounts());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<AccountOverride>({ id: '' });
  const [saved, setSaved] = useState(false);

  const startEdit = (id: string) => {
    const acc = accounts.find((a) => a.id === id)!;
    setEditFields({ id, name: acc.name, pin: acc.pin ?? '', tagline: acc.tagline, role: acc.role });
    setEditingId(id);
    setSaved(false);
  };

  const cancelEdit = () => setEditingId(null);

  const commitEdit = () => {
    const overrides = getAdminOverrides().filter((o) => o.id !== editFields.id);
    overrides.push(editFields);
    saveAdminOverrides(overrides);
    setAccounts(getEffectiveDemoAccounts());
    setEditingId(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const stats = [
    { label: 'Gesamt Check-ins', value: profile.total_checkins, icon: Activity, color: 'text-blue-500' },
    { label: 'Quick Wins', value: profile.total_quickwins, icon: Zap, color: 'text-yellow-500' },
    { label: 'Aktueller Streak', value: `${profile.streak} Tage`, icon: Flame, color: 'text-orange-500' },
    { label: 'Achievements', value: unlockedAchievements.length, icon: ShieldCheck, color: 'text-purple-500' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground text-sm ml-11">
          Eingeloggt als <span className="font-semibold text-foreground">{currentUser?.name}</span>
        </p>
      </motion.div>

      {/* Stats grid */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" /> App-Statistiken
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="bg-card border rounded-2xl p-4"
            >
              <stat.icon className={cn('w-5 h-5 mb-2', stat.color)} />
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Weekly progress */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" /> Wochenziel (aktuell)
        </h2>
        <div className="bg-card rounded-[2rem] border border-border/40 p-5 space-y-4">
          {[
            { label: 'Check-ins', current: weeklyGoal.checkins, goal: weeklyGoal.checkinGoal, color: 'bg-blue-500' },
            { label: 'Quick Wins', current: weeklyGoal.quickwins, goal: weeklyGoal.quickwinGoal, color: 'bg-yellow-500' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium">{item.label}</span>
                <span className="text-muted-foreground">{item.current} / {item.goal}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (item.current / item.goal) * 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                  className={cn('h-full rounded-full', item.color)}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* User management */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Users className="w-3.5 h-3.5" /> Demo-Konten verwalten
          </h2>
          {saved && <span className="text-xs text-green-500 font-medium">✓ Gespeichert</span>}
        </div>
        <div className="space-y-3">
          {accounts.map((account, i) => {
            const isEditing = editingId === account.id;
            return (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.07 }}
                className={cn(
                  'bg-card rounded-[2rem] border border-border/40 p-4',
                  account.id === currentUser?.id && 'ring-2 ring-primary'
                )}
              >
                {!isEditing ? (
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{account.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{account.name}</span>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', ROLE_COLORS[account.role])}>
                          {ROLE_LABELS[account.role]}
                        </span>
                        {account.id === currentUser?.id && (
                          <span className="text-xs text-primary font-medium">← du</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{account.tagline}</p>
                      <div className="flex flex-wrap gap-1">
                        {account.permissions.length === 0 ? (
                          <span className="text-xs text-muted-foreground italic">Nur Lese-Zugriff</span>
                        ) : (
                          account.permissions.map((p) => (
                            <span key={p} className="text-[11px] bg-muted px-2 py-0.5 rounded-full font-mono">{p}</span>
                          ))
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-xs text-muted-foreground">
                        {account.pin ? <span className="font-mono">PIN: {account.pin}</span> : <span className="italic">kein PIN</span>}
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => startEdit(account.id)}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border bg-background hover:bg-accent transition-colors"
                        >
                          <Pencil className="w-3 h-3" /> Bearbeiten
                        </button>
                        {account.id !== currentUser?.id && (
                          <button
                            onClick={() => login(account)}
                            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border bg-background hover:bg-accent transition-colors"
                          >
                            <LogIn className="w-3 h-3" /> Einloggen
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{account.emoji}</span>
                      <span className="text-sm font-medium text-muted-foreground">Konto bearbeiten</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">Name</label>
                        <input
                          value={editFields.name ?? ''}
                          onChange={(e) => setEditFields((f) => ({ ...f, name: e.target.value }))}
                          className="rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground">PIN</label>
                        <input
                          value={editFields.pin ?? ''}
                          onChange={(e) => setEditFields((f) => ({ ...f, pin: e.target.value }))}
                          placeholder="leer = kein PIN"
                          maxLength={8}
                          className="rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">Tagline</label>
                      <input
                        value={editFields.tagline ?? ''}
                        onChange={(e) => setEditFields((f) => ({ ...f, tagline: e.target.value }))}
                        className="rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-muted-foreground">Rolle</label>
                      <div className="flex gap-2">
                        {(['admin', 'user', 'guest'] as const).map((r) => (
                          <button
                            key={r}
                            onClick={() => setEditFields((f) => ({ ...f, role: r }))}
                            className={cn(
                              'px-3 py-1.5 rounded-full text-xs border font-medium transition-colors',
                              editFields.role === r
                                ? cn(ROLE_COLORS[r], 'border-transparent')
                                : 'bg-background border-border hover:border-primary/50'
                            )}
                          >
                            {ROLE_LABELS[r]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <Button variant="outline" size="sm" onClick={cancelEdit} className="gap-1">
                        <X className="w-3.5 h-3.5" /> Abbrechen
                      </Button>
                      <Button size="sm" onClick={commitEdit} className="gap-1">
                        <Check className="w-3.5 h-3.5" /> Speichern
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
