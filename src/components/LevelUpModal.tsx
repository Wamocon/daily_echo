'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLevelTitle } from '@/lib/xp';
import { useAppStore } from '@/store/useAppStore';

export default function LevelUpModal() {
  const leveledUp = useAppStore((s) => s.leveledUp);
  const clearXPFeedback = useAppStore((s) => s.clearXPFeedback);

  useEffect(() => {
    if (leveledUp !== null) {
      const timer = setTimeout(() => clearXPFeedback(), 4000);
      return () => clearTimeout(timer);
    }
  }, [leveledUp, clearXPFeedback]);

  return (
    <AnimatePresence>
      {leveledUp !== null && (
        <motion.div
          key="levelup"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={clearXPFeedback}
        >
          <motion.div
            className="relative bg-gradient-to-br from-violet-600 to-purple-800 rounded-3xl p-8 text-center shadow-2xl max-w-xs w-full mx-4"
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20, delay: 0.05 }}
          >
            {/* Stars burst */}
            {['⭐', '✨', '🌟', '💫', '⭐'].map((star, i) => (
              <motion.span
                key={i}
                className="absolute text-xl pointer-events-none"
                style={{ top: `${10 + i * 12}%`, left: `${5 + i * 20}%` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], y: [-10, -30, -50] }}
                transition={{ delay: 0.2 + i * 0.1, duration: 1 }}
              >
                {star}
              </motion.span>
            ))}

            <motion.div
              className="text-5xl mb-3"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              🏆
            </motion.div>

            <h2 className="text-white text-2xl font-bold mb-1">Level Up!</h2>
            <p className="text-violet-200 text-sm mb-3">Du hast Level {leveledUp} erreicht</p>
            <div className="bg-white/20 rounded-xl px-4 py-2 inline-block">
              <span className="text-white font-semibold text-lg">
                Lv.{leveledUp} · {getLevelTitle(leveledUp)}
              </span>
            </div>
            <p className="text-violet-300 text-xs mt-4">Tippen zum Schließen</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
