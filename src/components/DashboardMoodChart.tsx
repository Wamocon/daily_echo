'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { getOnThisDay } from '@/lib/storage';
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, Tooltip, YAxis } from 'recharts';

const MOOD_EMOJI: Record<number, string> = { 1: '😔', 2: '😕', 3: '😐', 4: '🙂', 5: '😄' };
const MOOD_COLORS: Record<number, string> = {
  1: '#f87171', // red-400
  2: '#fb923c', // orange-400
  3: '#94a3b8', // neutral-400
  4: '#60a5fa', // blue-400
  5: '#4ade80', // green-400
};

export function DashboardMoodChart() {
  const { todayEntry } = useAppStore();

  const data = useMemo(() => {
    // Collect past 14 days
    const past14Days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return d.toISOString().split('T')[0];
    });

    // Mock accessing history since getEntryByDate requires reading all data.
    // For this context we'll construct it via getOnThisDay matching logic but for recent days.
    const allStorage = typeof window !== 'undefined' ? localStorage.getItem('daily_echo_entries') : null;
    const allEntries = allStorage ? JSON.parse(allStorage) : [];
    
    return past14Days.map(dateStr => {
      const entry = allEntries.find((e: any) => e.date === dateStr);
      const moodValue = entry ? (entry.evening_mood || entry.morning_mood || 0) : 0;
      return {
        date: dateStr,
        displayDate: new Date(dateStr).getDate().toString().padStart(2, '0'),
        mood: moodValue,
        emoji: MOOD_EMOJI[moodValue] || '',
        color: MOOD_COLORS[moodValue] || '#e2e8f0', // slate-200 for empty
        text: entry?.evening_answers?.[0] || entry?.morning_answers?.[0] || 'Kein Eintrag'
      };
    });
  }, [todayEntry]); // Re-run when todayEntry changes

  // Custom Tooltip for Chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (data.mood === 0) return null;

      return (
        <div className="bg-card dark:bg-card/95 border border-border shadow-xl rounded-xl p-3 max-w-[200px] z-50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{data.emoji}</span>
            <span className="text-xs font-semibold text-muted-foreground">
              {new Date(data.date).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })}
            </span>
          </div>
          <p className="text-xs text-foreground/90 line-clamp-3">
            "{data.text}"
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[220px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold mb-1">Stimmungstrend</h3>
          <p className="text-xs text-muted-foreground">Die letzten 14 Tage im Überblick.</p>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[160px] relative">
        {/* Y-Axis custom labels (Moods) */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-lg z-10">
          <span>😄</span>
          <span>🙂</span>
          <span>😐</span>
          <span>😕</span>
          <span>😔</span>
        </div>

        <div className="w-full h-full pl-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="displayDate" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                dy={10}
              />
              <YAxis domain={[0, 5]} hide />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'transparent' }}
              />
              <Bar 
                dataKey="mood" 
                radius={[6, 6, 6, 6]}
                barSize={12}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}