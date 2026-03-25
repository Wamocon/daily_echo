'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  User, Pencil, LogOut, Flame, CheckCircle2, Zap, Target, Save, X,
} from 'lucide-react';

const GOAL_OPTIONS = [
  'Klarheit & Fokus',
  'Stressabbau',
  'Karriere-Tracking',
  'Persönliches Wachstum',
];

export default function ProfilePage() {
  const { profile, updateProfile } = useAppStore();
  const { logout } = useAuthStore();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(profile.onboarding_name ?? '');
  const [editAge, setEditAge] = useState(String(profile.onboarding_age ?? ''));
  const [editJob, setEditJob] = useState(profile.onboarding_job ?? '');
  const [editGoal, setEditGoal] = useState(profile.onboarding_goal ?? '');
  const [editTarget, setEditTarget] = useState(profile.weekly_quickwin_target ?? 2);

  const handleSave = () => {
    updateProfile({
      onboarding_name: editName.trim(),
      onboarding_age: parseInt(editAge, 10) || null,
      onboarding_job: editJob.trim(),
      onboarding_goal: editGoal,
      weekly_quickwin_target: editTarget,
      display_name: editName.trim(),
    });
    setEditing(false);
  };

  const handleCancel = () => {
    setEditName(profile.onboarding_name ?? '');
    setEditAge(String(profile.onboarding_age ?? ''));
    setEditJob(profile.onboarding_job ?? '');
    setEditGoal(profile.onboarding_goal ?? '');
    setEditTarget(profile.weekly_quickwin_target ?? 2);
    setEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initials = (profile.onboarding_name ?? profile.display_name ?? 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen px-4 pt-8 pb-32 lg:pb-8 max-w-lg mx-auto">
      <div className="flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <User className="w-5 h-5 text-purple-500" />
            </div>
            <h1 className="text-2xl font-bold leading-none">Profil</h1>
          </div>
          {!editing ? (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1.5">
              <Pencil className="w-3.5 h-3.5" /> Bearbeiten
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel} className="gap-1">
                <X className="w-3.5 h-3.5" /> Abbrechen
              </Button>
              <Button size="sm" onClick={handleSave} className="gap-1">
                <Save className="w-3.5 h-3.5" /> Speichern
              </Button>
            </div>
          )}
        </div>

        {/* Avatar + Name */}
        <motion.div
          layout
          className="bg-card border rounded-2xl p-6 flex flex-col items-center gap-4 shadow-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xl shadow">
            {initials}
          </div>
          {!editing ? (
            <div className="text-center">
              <p className="text-xl font-bold">
                {profile.onboarding_name ?? profile.display_name ?? 'Unbekannt'}
              </p>
              {profile.onboarding_age && (
                <p className="text-sm text-muted-foreground">{profile.onboarding_age} Jahre · {profile.onboarding_job}</p>
              )}
              {profile.onboarding_goal && (
                <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  🎯 {profile.onboarding_goal}
                </span>
              )}
            </div>
          ) : (
            <div className="w-full flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Name</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="flex gap-3">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs text-muted-foreground">Alter</label>
                  <input type="number" value={editAge} onChange={(e) => setEditAge(e.target.value)}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs text-muted-foreground">Beruf</label>
                  <input value={editJob} onChange={(e) => setEditJob(e.target.value)}
                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Ziel</label>
                <div className="flex flex-wrap gap-2">
                  {GOAL_OPTIONS.map((g) => (
                    <button key={g} onClick={() => setEditGoal(g)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                        editGoal === g ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:border-primary/50'
                      }`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground">Quick Win Ziel / Woche</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setEditTarget(n)}
                      className={`w-9 h-9 rounded-xl border text-sm font-medium transition-all ${
                        editTarget === n ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:border-primary/50'
                      }`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card border rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm">
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xl font-bold">{profile.streak}</span>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">Aktueller Streak</p>
          </div>
          <div className="bg-card border rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-xl font-bold">{profile.total_checkins}</span>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">Check-ins gesamt</p>
          </div>
          <div className="bg-card border rounded-2xl p-4 flex flex-col items-center gap-1 shadow-sm">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-xl font-bold">{profile.total_quickwins}</span>
            </div>
            <p className="text-[10px] text-muted-foreground text-center">Quick Wins gesamt</p>
          </div>
        </div>

        {/* Wöchentliches Ziel */}
        <div className="bg-card border rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <Target className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-sm font-medium">Wöchentliches Quick Win Ziel</p>
            <p className="text-xs text-muted-foreground">{profile.weekly_quickwin_target ?? 2} pro Woche</p>
          </div>
          <span className="ml-auto text-2xl font-bold text-primary">{profile.weekly_quickwin_target ?? 2}</span>
        </div>

        {/* Werte-Kompass */}
        {(profile.values ?? []).length > 0 && (
          <div className="bg-card border rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
            <p className="text-sm font-semibold flex items-center gap-2">🧭 Deine Werte</p>
            <div className="flex flex-wrap gap-2">
              {(profile.values ?? []).map((v) => {
                const count = profile.value_answer_counts?.[v] ?? 0;
                return (
                  <div
                    key={v}
                    className="flex items-center gap-2 bg-violet-50 dark:bg-violet-950 border border-violet-200 dark:border-violet-800 rounded-xl px-3 py-2"
                  >
                    <span className="text-sm font-medium text-violet-700 dark:text-violet-300">{v}</span>
                    {count > 0 && (
                      <span className="text-xs bg-violet-200 dark:bg-violet-800 text-violet-700 dark:text-violet-200 rounded-full px-1.5 py-0.5 font-semibold">
                        {count}×
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">Anzahl reflektierter Check-ins pro Wert.</p>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors py-3 border border-red-200 dark:border-red-900/50 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950"
        >
          <LogOut className="w-4 h-4" />
          Abmelden
        </button>
      </div>
    </div>
  );
}
