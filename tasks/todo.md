# DailyEcho — Build Plan v1

---

## 🚀 Go-Live Plan (Branch: `main`)

> **Ziel:** DailyEcho von Mock-Auth + localStorage auf echte Supabase-Auth + DB-Sync heben und auf Vercel deployen.

### Analyse der Blocker (Stand: 27. März 2026)

| # | Blocker | Details |
|---|---------|---------|
| B1 | Kein `.env.local` | Supabase-Credentials nicht konfiguriert — App würde im Build crashen |
| B2 | Mock-Auth | `lib/auth.ts` nutzt `DEMO_ACCOUNTS` + PIN statt Supabase Auth |
| B3 | Kein DB-Sync | `useAppStore` / `useAuthStore` schreibt nur in localStorage, kein Supabase-Sync |
| B4 | Schema nicht deployed | `001_initial_schema.sql` existiert, aber ist noch nicht ins Live-Projekt gepusht |
| B5 | Kein Vercel-Projekt | Frontend noch nicht verknüpft |

---

### Phase A — Supabase Backend aufsetzen
- [ ] A1: `.env.local` anlegen mit `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] A2: Schema in Supabase Live-Projekt deployen (SQL aus `001_initial_schema.sql` in Supabase SQL-Editor ausführen)
- [ ] A3: Supabase Auth — E-Mail/Passwort aktivieren (Dashboard → Auth → Providers)
- [ ] A4: Supabase Auth — E-Mail-Bestätigung für MVP deaktivieren (einfacheres Onboarding)

### Phase B — Auth ersetzen (Mock → Supabase)
- [ ] B1: `lib/auth.ts` — Supabase-basierte Funktionen (signUp, signIn, signOut, getSession)
- [ ] B2: `store/useAuthStore.ts` — Supabase `onAuthStateChange` + Session-Hydration
- [ ] B3: Login-Seite (`app/login/page.tsx`) — E-Mail + Passwort Formular mit Supabase
- [ ] B4: Register-Seite (`app/(auth)/register/page.tsx`) — Supabase signUp + Profil-Anlage
- [ ] B5: `components/AuthGuard.tsx` — Supabase Session prüfen statt localStorage-Mock

### Phase C — Daten-Sync (localStorage → Supabase DB)
- [ ] C1: `store/useAppStore.ts` — Check-ins in `daily_entries` Tabelle schreiben/lesen
- [ ] C2: `store/useAppStore.ts` — Profil-Daten (Streak, XP, Achievements) aus `profiles` Tabelle
- [ ] C3: `store/useAppStore.ts` — Achievements in `user_achievements` Tabelle synchronisieren
- [ ] C4: Fallback: localStorage als Cache behalten, Supabase als Source of Truth

### Phase D — Build-Validierung
- [ ] D1: `npm run build` — fehlerfrei durchlaufen
- [ ] D2: Manueller E2E-Test: Registrierung → Onboarding → Check-in → Dashboard
- [ ] D3: Auth-Flow testen: Login / Logout / Session-Persistenz nach Refresh

### Phase E — Vercel Deployment
- [ ] E1: Vercel-Projekt anlegen + GitHub `main` Branch verknüpfen
- [ ] E2: Env-Variablen in Vercel setzen (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- [ ] E3: Supabase Redirect-URLs für Produktion konfigurieren (Auth → URL Configuration)
- [ ] E4: Produktions-Deployment triggern + URL testen

---

## Stack
- **Framework:** Next.js 15 (App Router)
- **Sprache:** TypeScript 5.x
- **Styling:** Tailwind CSS + shadcn/ui
- **UI Components:** 21st.dev (shadcn-compatible)
- **State:** Zustand (mit Supabase-Sync)
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Hosting:** Vercel (Frontend) + Supabase (Backend)
- **Charts:** Recharts (Wochenziel-Ring)
- **Animationen:** Framer Motion (via 21st.dev Komponenten)

---

## 21st.dev Komponenten (Installation)
```bash
npx shadcn@latest add https://21st.dev/r/ayushmxxn/tubelight-navbar
npx shadcn@latest add https://21st.dev/r/victorwelander/expandable-tabs
npx shadcn@latest add https://21st.dev/r/aceternity/placeholders-and-vanish-input
npx shadcn@latest add https://21st.dev/r/Codehagen/display-cards
npx shadcn@latest add https://21st.dev/r/motion-primitives/text-shimmer
npx shadcn@latest add https://21st.dev/r/aceternity/aurora-background
npx shadcn@latest add https://21st.dev/r/aliimam/gradient-text
```

---

## Datenmodell (localStorage)

```ts
// DailyEntry
{
  id: string               // ISO date "2026-03-24"
  date: string
  morningDone: boolean
  eveningDone: boolean
  mood: 1 | 2 | 3 | 4 | 5
  moodContext: "morning" | "evening"
  answers: string[]        // 3 Antworten auf Fragen
  quickWin: string | null  // optional QuickWin-Text
  hasQuickWin: boolean
}

// UserStats
{
  streak: number
  longestStreak: number
  freezeUsedThisWeek: boolean
  lastCheckInDate: string
  totalCheckIns: number
  totalQuickWins: number
  weeklyQuickWins: number  // reset jeden Montag
  unlockedAchievements: string[]
}
```

---

## Feature-Schritte

### Phase 1 — Setup & Infrastruktur (~3h)
- [x] Next.js 15 initialisieren (`npx create-next-app@latest`)
- [x] Tailwind + shadcn/ui konfigurieren
- [x] 21st.dev Komponenten installieren
- [x] Supabase Schema-File erstellen (`supabase/migrations/001_initial_schema.sql`)
- [ ] Supabase Projekt live deployen (Remote-Projekt anlegen, Schema pushen, RLS aktivieren)
- [ ] Supabase Auth Flow (Magic Link / E-Mail+Passwort) — aktuell: Mock-Auth via DEMO_ACCOUNTS
- [x] Zustand Store-Skeleton anlegen
- [ ] Vercel Projekt + Preview Deployments verknüpfen
- [x] Ordnerstruktur einrichten

### Phase 2 — Daten & State (~2h)
- [x] Datenmodell TypeScript-Typen definieren (`types/index.ts`)
- [x] Supabase Client/Server Helper (`lib/supabase/`)
- [x] Zustand Store (`store/useAppStore.ts`) — localStorage-basiert
- [ ] Supabase-Sync im Zustand Store (aktuell nur localStorage, kein Remote-Sync)
- [x] Streak-Logik implementieren (inkl. Freeze)
- [x] Achievement-Checker implementieren (10 Achievements)

### Phase 3 — Kern-Features (~8h)
- [x] Mood Tracker Komponente (5 Stufen, Emoji)
- [x] Suggestion-Map (Mood × Kontext → 3 Vorschläge)
- [x] Morgen Check-in Flow (3 Fragen + Mood + Intention)
- [x] Abend Check-in Flow (3 Fragen + Mood + QuickWin + Intention-Result)
- [x] Expandable Tabs (Morgen/Abend Umschaltung)
- [x] QuickWin Wochenzähler (2/2 Anzeige)

### Phase 4 — Gamification (~4h)
- [x] Streak-Anzeige (Gradient Text + Flammen-Emoji)
- [x] Streak Freeze Button (1x/Woche)
- [x] Wochenziel-Fortschrittsring (Recharts RadialBar)
- [x] Achievement Badges Grid (10 Badges + Fortschrittsbalken)
- [x] Level-Up Animation (Framer Motion, LevelUpModal)
- [x] XP-System (lib/xp.ts, XPBar-Komponente, 10 Level)
- [x] Unlockables-Seite in `/achievements` (Level-2–10 Freischaltungen)

### Phase 5 — Dashboard & UI-Polish (~4h)
- [x] Startseite / Dashboard zusammenführen (Bento-Grid, `/home`)
- [x] "On this Day"-Erinnerungen (History-Seite)
- [x] Tubelight Navbar (Home / Check-in / Achievements / Verlauf)
- [x] Aurora Background für Dashboard
- [x] Responsive Layout (Mobile + Desktop)
- [x] Dark Mode support (ThemeProvider + ThemeSwitch)

---

## Mood → Suggestion Map

| Mood | Label | Morgen | Abend |
|------|-------|--------|-------|
| 1 😔 | Sehr niedrig | Box Breathing (5min), 1 kontrollierbares Ziel notieren | Kein Bildschirm vor Schlaf, Dankbarkeitsliste |
| 2 😕 | Niedrig | Spaziergang (10min), 1 erreichbares Tagesziel | Was hat heute Energie gekostet?, Ruhige Musik |
| 3 😐 | Neutral | Was soll heute dein bester Moment sein? Wasser trinken | Was war überraschend gut heute? |
| 4 🙂 | Gut | Energie nutzen — was willst du heute anpacken? | Energie weitergeben — wem kannst du helfen? |
| 5 😄 | Sehr gut | Dokumentiere was dich in diesen Zustand gebracht hat! | Feiere es — schreib deinen QuickWin auf! |

---

## Achievement-Definitionen

| ID | Badge | Emoji | Trigger |
|----|-------|-------|---------|
| first_spark | First Spark | 🔥 | Erster Check-in |
| week_one | Week One | 🗓️ | 7 Tage Streak |
| iron_will | Iron Will | 💪 | 30 Tage Streak |
| summit | Summit | 🏔️ | 100 Tage Streak |
| first_win | First Win | ⚡ | Erster QuickWin |
| on_a_roll | On a Roll | 🎯 | 2 QuickWins in einer Woche |
| both_worlds | Both Worlds | ☯️ | Morgen + Abend am selben Tag |
| deep_diver | Deep Diver | 📖 | Prompt aus Bibliothek genutzt |

---

## Ordnerstruktur

```
src/
  app/
    page.tsx              # Dashboard (Startseite)
    checkin/
      page.tsx            # Morgen/Abend Check-in Flow
    achievements/
      page.tsx            # Badge-Übersicht
    history/
      page.tsx            # Eintragshistorie + "On this Day"
  components/
    ui/                   # shadcn + 21st.dev Komponenten
    MoodPicker.tsx
    CheckinFlow.tsx
    QuickWinCard.tsx
    StreakDisplay.tsx
    WeeklyGoalRing.tsx
    AchievementBadge.tsx
    MoodSuggestions.tsx
  lib/
    storage.ts            # localStorage CRUD
    suggestions.ts        # Mood → Suggestion Map
    achievements.ts       # Achievement-Checker
    streaks.ts            # Streak-Logik
  store/
    useAppStore.ts        # Zustand Store
  types/
    index.ts              # TypeScript-Typen
```

---

## Review (Stand: März 2026)

### ✅ Feature-Vollständigkeit
- Alle ursprünglich geplanten Kern-Features sind implementiert
- **Sprint 1** (Geführte Reflexion): Done — Perspektivwechsel, Reframing, Mood-Kontext-Klärung im CheckinFlow
- **Sprint 2** (Intention-Loop): Done — Morgen-Intention + Abend-Auflösung mit 3 Chips
- **Sprint 3** (XP/Level/Unlockables): Done — lib/xp.ts, XPBar, LevelUpModal, Unlockables-Seite
- **Sprint 4** (Micro-Interventionen): Done — interventions.ts, Interventionskarten in QuickActionsSidebar
- **Sprint 5** (Werte-Kompass): Done — OnboardingFlow Schritt 6 + values-basierte Fragen in questions.ts

### ⬜ Noch offen (Go-Live Blockers)
- Supabase Projekt live schalten + Schema deployen
- Supabase Real Auth (aktuell: DEMO_ACCOUNTS Mock)
- Zustand Store auf Supabase-Sync umstellen
- Vercel Projekt + Preview Deployments

### ⬜ Noch offen (Backlog)
- XP-Abzug bei verpassten Tagen (lib/xp.ts hat die Konstanten, aber kein aktiver Background-Job)
- Kalender-Heatmap Mood-View (B9)
- Landing Page (B10)
- SEO Metadata (B12)
- Export als PDF / Jahresbericht (B15)


## Redesign Phasen (Basierend auf UI Vorschl�gen)

### Phase 1 � Macro Layout (Die Struktur) [Branch: design/macro-layout]
- [x] Fluid Layout (Volle Breite mit Padding statt zentriertem Container)
- [x] Gruppierte und hierarchische Navigation (Sections in der SideNav aktualisieren)
- [x] Globaler "Top-Level" Kontext/Header (Header-Leiste für Titel & Kontext einfügen)

### Phase 2 � Dashboard Redesign (Das Raster) [Branch: design/bento-dashboard]
- [x] Organische Cards (Card UI statt aktueller Listen, weichere Schatten, mehr Whitespace)
- [x] Bento-Grid Dashboard-Struktur (CSS Grid Implementierung für das Main-Dashboard)
- [x] Prominenter Call-to-Action (CTA) Block für den Check-in direkt im Grid

### Phase 3 — Quick Actions (Der Kontext) [Branch: design/right-sidebar]
- [x] Rechte Sidebar / Sliding-Panel für schnelle Interaktionen (Quick Wins, Übungen)
- [x] Auslagerung der Interventionen aus dem Modal in diese Kontext-Spalte

### Phase 4 — Visualizations & Emotion (Der Feinschliff) [Branch: design/data-viz-and-emotion]
- [x] Inline-Visualisierungen / Daten aggregieren (Wochentrend-Diagramm ins Dashboard integrieren)
- [x] Emotionales Farbsystem für Faces anstatt Text/Zahlen (Mood-Gesichter re-designen)
- [x] Interactive Tooltips & Hover-States für Chart-Elemente und Moods hinzufügen

Phase 3 starting - Right Sidebar & Micro Interventions
