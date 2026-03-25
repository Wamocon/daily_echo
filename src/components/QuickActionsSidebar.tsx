'use client';

import { useAppStore } from '@/store/useAppStore';
import { getIntervention } from '@/lib/interventions';
import { Sparkles, CheckCheck, BookOpen, UserCircle2, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function QuickActionsSidebar() {
  const { todayEntry, markInterventionDone } = useAppStore();

  const hour = new Date().getHours();
  // Get primary context for current time
  const context = hour >= 5 && hour < 12 ? 'morning' : hour >= 17 ? 'evening' : 'evening';
  const recentMood = context === 'morning' ? todayEntry?.morning_mood : todayEntry?.evening_mood;

  const isLowMood = recentMood !== undefined && recentMood !== null && recentMood <= 3;
  const showIntervention = isLowMood && !todayEntry?.intervention_done;

  const intervention = (recentMood && showIntervention) 
    ? getIntervention(recentMood, context) 
    : null;

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Für dich
      </h3>

      <AnimatePresence mode="popLayout">
        {/* Dynamische Micro-Intervention */}
        {intervention && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950 rounded-3xl border border-violet-200 dark:border-violet-800 p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-violet-500 uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Micro-Intervention
            </div>
            
            <div className="flex items-start gap-4 mb-4">
              <span className="text-3xl filter drop-shadow-sm">{intervention.emoji}</span>
              <div>
                <h4 className="font-bold text-[15px] leading-tight text-foreground">{intervention.title}</h4>
                <p className="text-xs font-medium text-violet-500 mt-1">⏱ {intervention.duration}</p>
              </div>
            </div>
            
            <p className="text-xs text-foreground/80 leading-relaxed mb-5">
              {intervention.description}
            </p>

            <button
              onClick={() => markInterventionDone()}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium py-2.5 rounded-xl transition-all shadow-sm hover:shadow active:scale-95"
            >
              <CheckCheck className="w-4 h-4" />
              Ich mach das — +5 XP
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konstante Sidebar-Ressourcen */}
      <div className="bg-card rounded-3xl border border-border/40 p-3 shadow-sm hover:border-primary/20 transition-all flex items-center gap-4 cursor-pointer group">
        <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h4 className="text-sm font-bold group-hover:text-primary transition-colors">Journaling Modus</h4>
          <p className="text-xs text-muted-foreground mt-0.5">Tiefergehende Reflexion</p>
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border/40 p-3 shadow-sm hover:border-primary/20 transition-all flex items-center gap-4 cursor-pointer group">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <UserCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h4 className="text-sm font-bold group-hover:text-primary transition-colors">Atemübung</h4>
          <p className="text-xs text-muted-foreground mt-0.5">3 Minuten Grounding</p>
        </div>
      </div>

      {!intervention && (
         <div className="bg-card rounded-3xl border border-border/40 p-3 shadow-sm hover:border-primary/20 transition-all flex items-center gap-4 cursor-pointer group">
         <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
           <Flame className="w-5 h-5 text-blue-600 dark:text-blue-400" />
         </div>
         <div>
           <h4 className="text-sm font-bold group-hover:text-primary transition-colors">Fokus</h4>
           <p className="text-xs text-muted-foreground mt-0.5">Pomodoro starten</p>
         </div>
       </div>
      )}

    </div>
  );
}