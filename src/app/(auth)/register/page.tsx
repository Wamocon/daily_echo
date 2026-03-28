'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError('Bitte alle Felder ausfüllen. Passwort mind. 6 Zeichen.');
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { display_name: name.trim() },
      },
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    // Wenn session null ist, muss die E-Mail zuerst best\u00e4tigt werden
    if (!data.session) {
      setError('\u2709\ufe0f Bitte best\u00e4tige deine E-Mail-Adresse. Schau in dein Postfach und klicke den Aktivierungslink.');
      return;
    }
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm shadow">
            🌀
          </div>
          <span className="font-bold text-lg">DailyEcho</span>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
          <h1 className="text-xl font-bold mb-1">Konto erstellen</h1>
          <p className="text-sm text-muted-foreground mb-6">Starte deine tägliche Reflexion</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Name</label>
              <input
                type="text"
                placeholder="Dein Vorname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">E-Mail</label>
              <input
                type="email"
                placeholder="du@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Passwort</label>
              <input
                type="password"
                placeholder="Mind. 6 Zeichen"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? 'Erstelle Konto…' : 'Registrieren & Starten'}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Bereits ein Konto?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Anmelden
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
      </div>
    </div>
  );
}
