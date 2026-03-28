'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { createClient } from '@/lib/supabase/client';
import { ROLE_LABELS, ROLE_COLORS } from '@/lib/auth';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Users, Activity, Zap, Flame, ShieldCheck, Check } from 'lucide-react';
import type { UserRole } from '@/types';

interface SupabaseUser {
  id: string;
  display_name: string | null;
  role: string;
  created_at: string;
  streak: number;
  total_checkins: number;
}

export default function AdminPage() {
  const { profile, weeklyGoal, unlockedAchievements } = useAppStore();
  const { currentUser } = useAuthStore();
  const [users, setUsers] = useState<SupabaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.from('profiles')
      .select('id, display_name, role, created_at, streak, total_checkins')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setUsers(data as SupabaseUser[]);
        setLoading(false);
      });
  }, []);

  const updateRole = async (userId: string, newRole: UserRole) => {
    setSavingId(userId);
    const supabase = createClient();
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
    setSavingId(null);
    setSavedId(userId);
    setTimeout(() => setSavedId(null), 2000);
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
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
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
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" /> Meine Statistiken
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
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
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
      <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
          <Users className="w-3.5 h-3.5" /> Nutzer verwalten
        </h2>
        {loading ? (
          <p className="text-sm text-muted-foreground animate-pulse">Lade Nutzerâ€¦</p>
        ) : (
          <div className="space-y-3">
            {users.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.05 }}
                className={cn(
                  'bg-card rounded-2xl border border-border/40 p-4 flex items-center gap-4',
                  user.id === currentUser?.id && 'ring-2 ring-primary'
                )}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {(user.display_name ?? '?')[0].toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm truncate">{user.display_name ?? user.id.slice(0, 8)}</span>
                    {user.id === currentUser?.id && (
                      <span className="text-xs text-primary font-medium">â† du</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {user.streak} Tage Streak Â· {user.total_checkins} Check-ins
                  </p>
                </div>

                {/* Role picker */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex gap-1">
                    {(['admin', 'user', 'guest'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => updateRole(user.id, r)}
                        disabled={savingId === user.id}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs border font-medium transition-colors',
                          user.role === r
                            ? cn(ROLE_COLORS[r], 'border-transparent')
                            : 'bg-background border-border hover:border-primary/50'
                        )}
                      >
                        {ROLE_LABELS[r]}
                      </button>
                    ))}
                  </div>
                  {savedId === user.id && (
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}
