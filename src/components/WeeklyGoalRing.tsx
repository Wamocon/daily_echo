'use client';

import { useAppStore } from '@/store/useAppStore';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

export function WeeklyGoalRing() {
  const { weeklyGoal } = useAppStore();

  const checkinPct = Math.min((weeklyGoal.checkins / weeklyGoal.checkinGoal) * 100, 100);
  const quickwinPct = Math.min((weeklyGoal.quickwins / weeklyGoal.quickwinGoal) * 100, 100);

  const data = [
    { name: 'Check-ins', value: checkinPct, fill: 'hsl(var(--primary))' },
    { name: 'Quick Wins', value: quickwinPct, fill: '#f59e0b' },
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-medium">Wochenziel</p>
      <div className="w-32 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="55%"
            outerRadius="90%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar dataKey="value" cornerRadius={6} background={{ fill: 'hsl(var(--muted))' }} />
            <Tooltip
              formatter={(value, name) => [`${Math.round(Number(value))}%`, String(name)]}
              contentStyle={{ fontSize: '11px', padding: '4px 8px' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary inline-block" />
          Check-ins: {weeklyGoal.checkins}/{weeklyGoal.checkinGoal} Tage
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
          Quick Wins: {weeklyGoal.quickwins}/{weeklyGoal.quickwinGoal}
        </div>
      </div>
    </div>
  );
}
