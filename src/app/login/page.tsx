'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithEmail } = useAuthStore();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Bitte E-Mail eingeben.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const user = loginWithEmail(email.trim());
    setLoading(false);
    if (!user) {
      setError('Kein Konto mit dieser E-Mail gefunden. Bitte zuerst registrieren.');
      return;
    }
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm shadow">
            🌀
          </div>
          <span className="font-bold text-lg">DailyEcho</span>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          <h1 className="text-xl font-bold mb-1">Willkommen zurück</h1>
          <p className="text-sm text-muted-foreground mb-6">Melde dich mit deiner E-Mail an</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">E-Mail</label>
              <input
                type="email"
                autoFocus
                placeholder="du@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? 'Anmelden…' : 'Anmelden'}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Noch kein Konto?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Jetzt registrieren
            </Link>
          </p>
        </div>

        {/* Legal footer */}
        <p className="text-center text-xs text-muted-foreground mt-8 flex gap-4 justify-center">
          <Link href="/impressum" className="hover:text-foreground transition-colors">
            Impressum
          </Link>
          <Link href="/datenschutz" className="hover:text-foreground transition-colors">
            Datenschutz
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

