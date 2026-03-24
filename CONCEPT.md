# DailyEcho — Gesamtkonzept v1.0

> **Projektinhaber:** Erwin Moretz (Wamocon)
> **Stand:** März 2026
> **Version:** 1.0 MVP

---

## Inhaltsverzeichnis

1. [Projektübersicht](#1-projektübersicht)
2. [Marktanalyse](#2-marktanalyse)
3. [Zielgruppe & Personas](#3-zielgruppe--personas)
4. [Feature-Scope MVP](#4-feature-scope-mvp)
5. [Architektur & Tech-Stack](#5-architektur--tech-stack)
6. [Datenmodell (Supabase)](#6-datenmodell-supabase)
7. [Planung & Phasen](#7-planung--phasen)
8. [Umsetzung](#8-umsetzung)
9. [Landingpage](#9-landingpage)
10. [Produkthandbuch](#10-produkthandbuch-struktur)
11. [Testing & Reporting](#11-testing--reporting)
12. [GoLive & Deployment](#12-golive--deployment)
13. [Offene Anforderungen](#13-offene-anforderungen)

---

## 1. Projektübersicht

**DailyEcho** ist eine responsive Web-App für tägliche Reflexion, Stimmungserfassung und die gezielte Identifikation von Quick Wins — für Berufstätige und Studierende, die mentale Klarheit mit messbarem Fortschritt verbinden wollen.

| | |
|---|---|
| **Problem** | Klassisches Journaling scheitert an Überforderung, Konsistenz und fehlendem Mehrwert nach negativen Einträgen |
| **Lösung** | Geführter 3-Fragen-Check-in (Morgen/Abend) + Mood-abhängige Verbesserungsvorschläge + Quick Win Tracker |
| **USP** | Einzige App die persönliche Reflexion mit professionellem Quick Win Tracking verbindet |
| **Wettbewerber** | Reflectly, stoic., Day One, Journey |
| **Hosting** | Vercel (Frontend) + Supabase (Backend, Auth, DB) |

---

## 2. Marktanalyse

### Wettbewerber-Kurzprofil

| App | Stärke | Schwäche | Lernpotenzial |
|---|---|---|---|
| **Reflectly** | 3-Fragen-Flow, Streak, sanftes Onboarding | Repetitive Fragen, aggressive Paywall | Minimaler Einstieg, Mood-First |
| **stoic.** | Morgen/Abend-Trennung, tiefe Prompts, Wocheninsights | Zu philosophisch, komplexes Onboarding | Dual-Modus, Insights |
| **Day One** | "On this Day"-Feature, E2E-Verschlüsselung | Keine KI-Guidance, teuer | Erinnerungen, Vertrauen durch Datenschutz |

### Marktlücke
Keine der drei Apps verbindet Journaling mit einem **professionellen Quick Win Framework** — ein klarer B2C/B2B-Differenzierungspunkt.

---

## 3. Zielgruppe & Personas

### Persona 1 — "Der ambitionierte Berufstätige"
- Alter: 25–40
- Ziel: Persönliches Wachstum + berufliche Sichtbarkeit
- Pain: "Ich weiß nie was ich geleistet habe, wenn mein Chef fragt"
- Gewinn durch DailyEcho: Quick Win Log als Leistungsnachweis

### Persona 2 — "Die achtsame Studierende"
- Alter: 20–28
- Ziel: Mentale Gesundheit, Stressabbau
- Pain: "Ich fange mit Journaling an und höre nach 3 Tagen auf"
- Gewinn durch DailyEcho: Streak + Gamification hält sie dabei

### Anwendungsgeräte
- **Desktop** (Notebook): Abend-Check-in nach der Arbeit
- **Smartphone**: Morgen-Check-in unterwegs

---

## 4. Feature-Scope MVP

### Must-Have (v1)
| # | Feature | Beschreibung |
|---|---|---|
| F1 | **Morgen-Check-in** | 3 geführte Fragen zum Tagesstart + Mood |
| F2 | **Abend-Check-in** | 3 Reflexionsfragen + Mood + Quick Win |
| F3 | **Mood Tracker** | 5-Stufen Emoji-Skala |
| F4 | **Mood-Suggestions** | 3 situative Vorschläge basierend auf Mood × Kontext |
| F5 | **Quick Win Erfassung** | Tägliche Abfrage, Wochenzähler (Ziel: 2/Woche) |
| F6 | **Daily Streak** | Tageszähler + 1x Streak Freeze pro Woche |
| F7 | **Wochenziel-Ring** | Fortschrittsring (Check-ins + Quick Wins) |
| F8 | **Achievements** | 8 Badges (Konsistenz, Quick Win, Reflexion) |
| F9 | **Auth** | E-Mail/Passwort + Magic Link (Supabase Auth) |
| F10 | **Responsive UI** | Mobile-first, Desktop-optimiert |

### Should-Have (v1.5)
| # | Feature |
|---|---|
| F11 | "On this Day" — Erinnerungen |
| F12 | Wochenstimmungsverlauf (Chart) |
| F13 | Prompt-Bibliothek (50 kuratierte Tiefenfragen) |

### Out of Scope (v2+)
- KI-Backend / Sentiment-Analyse
- Team-Sharing / Manager-View
- Export (PDF/Markdown)
- Tags & Themen-Filter
- Mobile App (React Native)

---

## 5. Architektur & Tech-Stack

```
┌─────────────────────────────────────────┐
│              Vercel (CDN)               │
│         Next.js 15 App Router           │
│                                         │
│  ┌─────────────┐   ┌──────────────────┐ │
│  │  UI Layer   │   │   API Routes     │ │
│  │  Tailwind   │   │  /api/checkin    │ │
│  │  shadcn/ui  │   │  /api/streak     │ │
│  │  21st.dev   │   │  /api/quickwin   │ │
│  └─────────────┘   └──────────────────┘ │
└────────────────────┬────────────────────┘
                     │
         ┌───────────▼───────────┐
         │   Supabase            │
         │                       │
         │  ► Auth (Magic Link)  │
         │  ► PostgreSQL DB      │
         │  ► Row Level Security │
         │  ► Realtime (future)  │
         └───────────────────────┘
```

### Tech-Stack Tabelle

| Schicht | Technologie | Version |
|---|---|---|
| Framework | Next.js (App Router) | 15.x |
| Sprache | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Basis | shadcn/ui | latest |
| UI Premium | 21st.dev Komponenten | - |
| State | Zustand | 5.x |
| Backend | Supabase (PostgreSQL) | latest |
| Auth | Supabase Auth | - |
| Charts | Recharts | 2.x |
| Animationen | Framer Motion | 11.x |
| Hosting | Vercel | - |
| CI/CD | Vercel GitHub Integration | - |

### 21st.dev Komponenten-Mapping

| Feature | Komponente | URL |
|---|---|---|
| Navigation | Tubelight Navbar | `https://21st.dev/r/ayushmxxn/tubelight-navbar` |
| Morgen/Abend Switch | Expandable Tabs | `https://21st.dev/r/victorwelander/expandable-tabs` |
| Journal-Eingabe | Placeholders & Vanish Input | `https://21st.dev/r/aceternity/placeholders-and-vanish-input` |
| Check-in Cards | Display Cards | `https://21st.dev/r/Codehagen/display-cards` |
| Lade-Animationen | Text Shimmer | `https://21st.dev/r/motion-primitives/text-shimmer` |
| Dashboard Hintergrund | Aurora Background | `https://21st.dev/r/aceternity/aurora-background` |
| Streak-Zahl | Gradient Text | `https://21st.dev/r/aliimam/gradient-text` |

---

## 6. Datenmodell (Supabase)

### Tabellen

```sql
-- Benutzerprofile (erweitert Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  freeze_used_this_week BOOLEAN DEFAULT FALSE,
  last_checkin_date DATE,
  total_checkins INT DEFAULT 0,
  total_quickwins INT DEFAULT 0
);

-- Tageseinträge
CREATE TABLE daily_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  morning_done BOOLEAN DEFAULT FALSE,
  evening_done BOOLEAN DEFAULT FALSE,
  morning_mood INT CHECK (morning_mood BETWEEN 1 AND 5),
  evening_mood INT CHECK (evening_mood BETWEEN 1 AND 5),
  morning_answers JSONB,   -- ["Antwort1", "Antwort2", "Antwort3"]
  evening_answers JSONB,
  has_quickwin BOOLEAN DEFAULT FALSE,
  quickwin_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, entry_date)
);

-- Achievements (freigeschaltete Badges)
CREATE TABLE user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,  -- 'first_spark', 'week_one', etc.
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

### Row Level Security (RLS)
```sql
-- Jeder User sieht nur seine eigenen Daten
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own entries"
  ON daily_entries FOR ALL USING (auth.uid() = user_id);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own profile"
  ON profiles FOR ALL USING (auth.uid() = id);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access own achievements"
  ON user_achievements FOR ALL USING (auth.uid() = user_id);
```

---

## 7. Planung & Phasen

### Zeitplan (~20 Entwicklungsstunden)

```
Phase 1 — Setup & Infrastruktur          (~3h)
  ├── Next.js 15 init + Konfiguration
  ├── Supabase Projekt + Schema
  ├── Auth Flow (Magic Link + E-Mail)
  ├── shadcn/ui + 21st.dev Komponenten
  └── Vercel Projekt + Preview-Deployments

Phase 2 — Daten & State                  (~2h)
  ├── TypeScript Typen (types/index.ts)
  ├── Supabase Client + Helpers (lib/)
  ├── Zustand Store mit Supabase-Sync
  └── Streak + Achievement Logik

Phase 3 — Kern-Features                  (~8h)
  ├── Mood Picker Komponente
  ├── Suggestion-Map (statisch)
  ├── Morgen-Check-in Flow
  ├── Abend-Check-in Flow + Quick Win
  └── Expandable Tabs (Morgen/Abend)

Phase 4 — Gamification                   (~3h)
  ├── Streak Display + Freeze
  ├── Wochenziel-Ring (Recharts)
  └── Achievement Badges + Unlock-Animation

Phase 5 — Dashboard & Polish             (~2h)
  ├── Startseite / Dashboard
  ├── Aurora Background + Navbar
  └── Responsive Feinschliff

Phase 6 — Landingpage                    (~1h)
  └── Marketing-Seite (/landing oder root)

Phase 7 — Testing & GoLive               (~1h)
  ├── End-to-End Smoke Tests
  ├── Supabase RLS Verifikation
  └── Vercel Production Deploy
```

---

## 8. Umsetzung

### Ordnerstruktur

```
src/
  app/
    (auth)/
      login/page.tsx
      register/page.tsx
    (app)/
      layout.tsx            # Auth Guard
      page.tsx              # Dashboard
      checkin/page.tsx      # Morgen/Abend Check-in
      achievements/page.tsx
      history/page.tsx
    landing/page.tsx        # Landingpage
    api/
      streak/route.ts       # Server Action: Streak berechnen
  components/
    ui/                     # shadcn + 21st.dev
    MoodPicker.tsx
    MoodSuggestions.tsx
    CheckinFlow.tsx
    QuickWinCard.tsx
    StreakDisplay.tsx
    WeeklyGoalRing.tsx
    AchievementBadge.tsx
    AchievementGrid.tsx
  lib/
    supabase/
      client.ts             # Browser Client
      server.ts             # Server Client
      middleware.ts
    suggestions.ts          # Mood → Suggestions Map
    achievements.ts         # Achievement Checker
    streaks.ts              # Streak Logik
  store/
    useAppStore.ts          # Zustand Store
  types/
    index.ts
```

### Mood → Suggestion Map

| Mood | Kontext | Vorschläge |
|---|---|---|
| 1 😔 Sehr niedrig | Morgen | Box Breathing (5min) · 1 kontrollierbares Ziel notieren · Kurze Pause einplanen |
| 1 😔 Sehr niedrig | Abend | Kein Bildschirm vor dem Schlafen · Dankbarkeitsliste (3 Punkte) · Atemübung |
| 2 😕 Niedrig | Morgen | Spaziergang (10min) · 1 erreichbares Tagesziel · Lieblingslied hören |
| 2 😕 Niedrig | Abend | Was hat heute Energie gekostet? · Ruhige Musik · Tagebucheintrag ohne Druck |
| 3 😐 Neutral | Morgen | Was soll heute dein bester Moment sein? · Wasser trinken · 5min Stretching |
| 3 😐 Neutral | Abend | Was war überraschend gut heute? · Morgen vorbereiten (5min) |
| 4 🙂 Gut | Morgen | Diese Energie nutzen — was willst du heute anpacken? · Jemanden motivieren |
| 4 🙂 Gut | Abend | Energie weitergeben — wem kannst du heute danken? · Quick Win dokumentieren |
| 5 😄 Sehr gut | Morgen | Dokumentiere was dich in diesen Zustand gebracht hat! · Große Aufgabe angehen |
| 5 😄 Sehr gut | Abend | Feiere es — schreib deinen Quick Win auf! · Teile deine Energie mit jemandem |

### Achievement-Definitionen

| ID | Badge | Emoji | Trigger-Bedingung |
|---|---|---|---|
| `first_spark` | First Spark | 🔥 | Erster Check-in completed |
| `week_one` | Week One | 🗓️ | 7 Tage Streak |
| `iron_will` | Iron Will | 💪 | 30 Tage Streak |
| `summit` | Summit | 🏔️ | 100 Tage Streak |
| `first_win` | First Win | ⚡ | Erster Quick Win erfasst |
| `on_a_roll` | On a Roll | 🎯 | 2 Quick Wins in einer Woche |
| `both_worlds` | Both Worlds | ☯️ | Morgen + Abend am selben Tag |
| `deep_diver` | Deep Diver | 📖 | (v1.5: Prompt-Bibliothek genutzt) |

---

## 9. Landingpage

### Struktur & Sections

```
/landing (oder Startseite für nicht-eingeloggte User)

1. Hero
   ├── Headline: "Dein täglicher Moment der Klarheit"
   ├── Subline: Geführte Reflexion · Mood Tracking · Quick Wins
   ├── CTA: "Kostenlos starten" → /register
   └── Visual: Aurora Background + Demo-GIF/Screenshot

2. Problem-Sektion
   └── "Klassisches Journaling scheitert. Hier ist warum."
       3 Pain Points mit Icons

3. Lösung / Features (Bento Grid)
   ├── Morgen & Abend Check-in
   ├── Mood Tracker + Suggestions
   ├── Quick Win Tracker
   └── Streak & Gamification

4. Wie es funktioniert (3-Schritte)
   └── Mood wählen → Fragen beantworten → Quick Win erfassen

5. Social Proof / Zitat-Sektion
   └── (Placeholder für erste echte User-Quotes)

6. FAQ
   └── Datenschutz, Plattform, Kosten

7. Footer
   └── Links: Datenschutz · Impressum · GitHub
```

### 21st.dev Komponenten (Landingpage)
- Hero: Aurora Background + Gradient Text
- Features: Bento Grid (Aceternity)
- CTA: Rainbow Button (Magic UI)
- FAQ: Accordion

---

## 10. Produkthandbuch (Struktur)

```
docs/manual.md (oder /app/help)

1. Erste Schritte
   ├── Account erstellen
   ├── Erster Check-in
   └── Dashboard verstehen

2. Funktionen
   ├── Morgen-Check-in
   ├── Abend-Check-in
   ├── Mood Tracker & Vorschläge
   ├── Quick Win erfassen
   └── Streak & Freeze

3. Gamification
   ├── Streak-System erklärt
   ├── Wochenziel
   └── Achievement-Übersicht (alle 8 Badges)

4. Datenschutz & Sicherheit
   ├── Was wird gespeichert?
   ├── Supabase Row Level Security
   └── Datenlöschung

5. FAQ
   └── Häufige Fragen
```

---

## 11. Testing & Reporting

### Teststrategie

| Ebene | Tool | Was wird getestet |
|---|---|---|
| **Unit Tests** | Vitest | Streak-Logik, Achievement-Checker, Suggestion-Map |
| **Komponenten-Tests** | React Testing Library | MoodPicker, CheckinFlow, QuickWinCard |
| **E2E Tests** | Playwright | Auth Flow, Check-in Workflow, Streak-Increment |
| **RLS Tests** | Supabase CLI | Row Level Security Policies |
| **Manuell** | Checkliste | Responsive (Mobile + Desktop), Dark Mode |

### Test-Checkliste vor GoLive

```
Auth
  ☐ Registrierung (E-Mail)
  ☐ Magic Link Login
  ☐ Logout
  ☐ Session Persistence (Refresh)

Check-in
  ☐ Morgen Check-in vollständig durchführbar
  ☐ Abend Check-in mit Quick Win
  ☐ Mood Picker zeigt korrekte Suggestions
  ☐ Doppelter Check-in am selben Tag geblockt

Gamification
  ☐ Streak steigt nach Check-in
  ☐ Streak Freeze funktioniert
  ☐ Achievements werden korrekt freigeschaltet
  ☐ Wochenziel-Ring aktualisiert sich

Datensicherheit
  ☐ User A kann keine Daten von User B sehen (RLS)
  ☐ API Routes prüfen Auth-Status

Responsive
  ☐ iPhone 14 (390px) — Check-in Flow
  ☐ iPad (768px) — Dashboard
  ☐ Desktop (1440px) — Alle Seiten
```

### Reporting-Metriken (Post-Launch)

| Metrik | Ziel (30 Tage) | Tool |
|---|---|---|
| Registrierungen | 50 User | Supabase Dashboard |
| DAU (Daily Active Users) | 30% der registrierten | Vercel Analytics |
| Ø Streak-Länge | > 5 Tage | Custom Query |
| Quick Win Rate | > 60% der Abend-Check-ins | Custom Query |
| Achievement Unlock Rate | > 80% `first_spark` | Supabase |

---

## 12. GoLive & Deployment

### Deployment-Architektur

```
GitHub (main branch)
    │
    ▼
Vercel CI/CD
    ├── Preview: jeder PR → preview.dailyecho.app
    └── Production: main merge → dailyecho.app (oder Vercel-URL)
         │
         └── Environment Variables:
               NEXT_PUBLIC_SUPABASE_URL
               NEXT_PUBLIC_SUPABASE_ANON_KEY
               SUPABASE_SERVICE_ROLE_KEY (nur server-side)
```

### GoLive-Checkliste

```
Vercel
  ☐ Custom Domain konfiguriert (optional)
  ☐ Environment Variables gesetzt
  ☐ Preview Deployments aktiv
  ☐ Vercel Analytics aktiviert

Supabase
  ☐ Production Projekt (nicht Free Tier limitiert)
  ☐ RLS auf allen Tabellen aktiv
  ☐ Auth E-Mail Templates angepasst (DailyEcho Branding)
  ☐ Database Backup aktiviert
  ☐ Connection Pooling (für Vercel Serverless)

Security
  ☐ CORS konfiguriert (nur eigene Domain)
  ☐ Rate Limiting auf Auth Endpoints
  ☐ Keine Secrets im Frontend-Bundle

Post-Launch
  ☐ Erster erfolgreicher Check-in auf Production
  ☐ Achievement-Unlock Smoke Test
  ☐ Mobile Check (echtes Gerät)
```

### Umgebungen

| Umgebung | Branch | URL |
|---|---|---|
| Development | lokal | `localhost:3000` |
| Preview | feature/* | `daily-echo-[hash].vercel.app` |
| Production | main | `dailyecho.app` |

---

## 13. Offene Anforderungen

> Weitere Anforderungen folgen laut Projektinhaber. Diese Sektion wird laufend ergänzt.

| # | Anforderung | Status | Priorität |
|---|---|---|---|
| OA-01 | *(Platzhalter)* | Offen | - |
| OA-02 | *(Platzhalter)* | Offen | - |

---

*Letzte Aktualisierung: März 2026 — Erwin Moretz / GitHub Copilot*
