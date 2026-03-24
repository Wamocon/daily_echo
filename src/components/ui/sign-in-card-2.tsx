'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight, Lock, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEMO_ACCOUNTS, DemoAccount } from '@/lib/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}

export function SignInCard() {
  const [selectedAccount, setSelectedAccount] = useState<DemoAccount | null>(null);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const { login } = useAuthStore();
  const router = useRouter();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSelectAccount = (account: DemoAccount) => {
    setSelectedAccount(account);
    setPin('');
    setError('');
  };

  const handleLogin = async () => {
    if (!selectedAccount) return;
    if (selectedAccount.pin && pin !== selectedAccount.pin) {
      setError('Falscher PIN. Versuche es erneut.');
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login(selectedAccount);
    router.push('/home');
  };

  const requiresPin = selectedAccount && selectedAccount.pin;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#f0f8ff] via-[#e0f2fe] to-[#d1fae5] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#064e3b] relative overflow-hidden flex items-center justify-center">
      {/* Background glow spots */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120vh] h-[60vh] rounded-b-[50%] bg-green-400/20 dark:bg-green-500/20 blur-[80px]" />
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100vh] h-[60vh] rounded-b-full bg-emerald-300/20 dark:bg-emerald-400/20 blur-[60px]"
        animate={{ opacity: [0.1, 0.2, 0.1], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror' }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[90vh] h-[90vh] rounded-t-full bg-sky-400/20 dark:bg-sky-500/20 blur-[60px]"
        animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: 'mirror', delay: 1 }}
      />
      <div className="absolute left-1/4 top-1/4 w-96 h-96 bg-green-300/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute right-1/4 bottom-1/4 w-96 h-96 bg-sky-300/10 rounded-full blur-[100px] animate-pulse delay-1000" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-sm relative z-10"
        style={{ perspective: 1500 }}
      >
        <motion.div
          className="relative"
          style={{ rotateX, rotateY }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ z: 10 }}
        >
          <div className="relative group">
            {/* Card glow */}
            <motion.div
              className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"
              animate={{
                boxShadow: [
                  '0 0 10px 2px rgba(34,197,94,0.05)',
                  '0 0 20px 6px rgba(34,197,94,0.10)',
                  '0 0 10px 2px rgba(34,197,94,0.05)',
                ],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
            />

            {/* Traveling light beams */}
            <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-70"
                animate={{ left: ['-50%', '100%'], opacity: [0.2, 0.5, 0.2] }}
                transition={{ left: { duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }, opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror' } }}
              />
              <motion.div
                className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-green-400 to-transparent opacity-70"
                animate={{ top: ['-50%', '100%'], opacity: [0.2, 0.5, 0.2] }}
                transition={{ top: { duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 0.6 }, opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror', delay: 0.6 } }}
              />
              <motion.div
                className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-70"
                animate={{ right: ['-50%', '100%'], opacity: [0.2, 0.5, 0.2] }}
                transition={{ right: { duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 1.2 }, opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror', delay: 1.2 } }}
              />
              <motion.div
                className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-emerald-400 to-transparent opacity-70"
                animate={{ bottom: ['-50%', '100%'], opacity: [0.2, 0.5, 0.2] }}
                transition={{ bottom: { duration: 2.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1, delay: 1.8 }, opacity: { duration: 1.2, repeat: Infinity, repeatType: 'mirror', delay: 1.8 } }}
              />
              {/* Corner glows */}
              {[
                { pos: 'top-0 left-0 h-[5px] w-[5px]', delay: 0 },
                { pos: 'top-0 right-0 h-[8px] w-[8px]', delay: 0.5 },
                { pos: 'bottom-0 right-0 h-[8px] w-[8px]', delay: 1 },
                { pos: 'bottom-0 left-0 h-[5px] w-[5px]', delay: 1.5 },
              ].map(({ pos, delay }, i) => (
                <motion.div
                  key={i}
                  className={`absolute ${pos} rounded-full bg-white/50 blur-[1px]`}
                  animate={{ opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 2 + i * 0.1, repeat: Infinity, repeatType: 'mirror', delay }}
                />
              ))}
            </div>

            <div className="absolute -inset-[0.5px] rounded-2xl bg-gradient-to-r from-white/3 via-white/7 to-white/3 opacity-0 group-hover:opacity-70 transition-opacity duration-500" />

            {/* Glass card */}
            <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl p-6 border border-green-200/60 dark:border-green-900/40 shadow-2xl overflow-hidden">
              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                  backgroundImage: `linear-gradient(135deg, #22c55e 0.5px, transparent 0.5px), linear-gradient(45deg, #22c55e 0.5px, transparent 0.5px)`,
                  backgroundSize: '30px 30px',
                }}
              />

              {/* Logo + Header */}
              <div className="text-center space-y-1 mb-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                  className="mx-auto w-10 h-10 rounded-full border border-white/10 bg-gradient-to-br from-purple-500/40 to-purple-900/40 flex items-center justify-center relative overflow-hidden"
                >
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">🌀</span>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-foreground"
                >
                  DailyEcho
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground text-xs"
                >
                  Wähle dein Profil zum Fortfahren
                </motion.p>
              </div>

              {/* Role selection */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="grid grid-cols-3 gap-2 mb-4"
              >
                {DEMO_ACCOUNTS.map((account) => {
                  const isSelected = selectedAccount?.id === account.id;
                  return (
                    <motion.button
                      key={account.id}
                      type="button"
                      onClick={() => handleSelectAccount(account)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        'relative flex flex-col items-center gap-1 p-3 rounded-xl border transition-all duration-300 text-center',
                        isSelected
                          ? 'bg-primary/10 border-primary shadow-[0_0_12px_rgba(34,197,94,0.15)]'
                          : 'bg-muted/60 border-border hover:bg-accent hover:border-primary/40'
                      )}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="role-indicator"
                          className="absolute inset-0 rounded-xl bg-primary/10"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span className="text-xl relative z-10">{account.emoji}</span>
                      <span className="text-xs font-medium text-foreground relative z-10">{account.name}</span>
                      <span className="text-[10px] text-muted-foreground relative z-10 leading-tight">{account.role}</span>
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* PIN Input */}
              <AnimatePresence>
                {requiresPin && (
                  <motion.div
                    key="pin-input"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={cn(
                        'relative flex items-center overflow-hidden rounded-lg',
                        focusedInput === 'pin' && 'z-10'
                      )}
                    >
                      <Lock
                        className={cn(
                          'absolute left-3 w-4 h-4 transition-all duration-300',
                          focusedInput === 'pin' ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                      <Input
                        type={showPin ? 'text' : 'password'}
                        placeholder="PIN eingeben"
                        value={pin}
                        onChange={(e) => { setPin(e.target.value); setError(''); }}
                        onFocus={() => setFocusedInput('pin')}
                        onBlur={() => setFocusedInput(null)}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        maxLength={8}
                        className="w-full bg-muted border-border focus:border-primary text-foreground placeholder:text-muted-foreground h-10 transition-all duration-300 pl-10 pr-10 tracking-widest"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 cursor-pointer"
                      >
                        {showPin ? (
                          <Eye className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-white/40 hover:text-white transition-colors duration-300" />
                        )}
                      </button>
                    </div>
                    {/* PIN hint */}
                    <p className="text-[10px] text-muted-foreground text-center mt-1.5">
                      Demo-PIN: <span className="font-mono text-foreground/60">1234</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-red-400 text-center mb-3"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Login Button */}
              <motion.button
                whileHover={{ scale: selectedAccount ? 1.02 : 1 }}
                whileTap={{ scale: selectedAccount ? 0.98 : 1 }}
                type="button"
                disabled={!selectedAccount || isLoading}
                onClick={handleLogin}
                className="w-full relative group/button"
              >
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg opacity-0 group-hover/button:opacity-60 transition-opacity duration-300" />
                <div
                  className={cn(
                    'relative overflow-hidden font-medium h-10 rounded-lg transition-all duration-300 flex items-center justify-center',
                    selectedAccount
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  )}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
                    style={{ opacity: isLoading ? 1 : 0, transition: 'opacity 0.3s ease' }}
                  />
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="label"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-1.5 text-sm font-medium"
                      >
                        {selectedAccount ? `Als ${selectedAccount.name} einloggen` : 'Profil wählen'}
                        {selectedAccount && (
                          <ArrowRight className="w-3 h-3 group-hover/button:translate-x-1 transition-transform duration-300" />
                        )}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>

              {/* Role description */}
              <AnimatePresence>
                {selectedAccount && (
                  <motion.p
                    key="tagline"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="text-center text-[11px] text-muted-foreground mt-3"
                  >
                    {selectedAccount.tagline}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
