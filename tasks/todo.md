# DailyEcho — Build Plan v1

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
- [ ] Next.js 15 initialisieren (`npx create-next-app@latest`)
- [ ] Tailwind + shadcn/ui konfigurieren
- [ ] 21st.dev Komponenten installieren
- [ ] Supabase Projekt anlegen + Schema deployen (3 Tabellen + RLS)
- [ ] Supabase Auth Flow (Magic Link + E-Mail/Passwort)
- [ ] Zustand Store-Skeleton anlegen
- [ ] Vercel Projekt + Preview Deployments verknüpfen
- [ ] Ordnerstruktur einrichten

### Phase 2 — Daten & State (~2h)
- [ ] Datenmodell TypeScript-Typen definieren (`types/index.ts`)
- [ ] Supabase Client/Server Helper (`lib/supabase/`)
- [ ] Zustand Store (`store/useAppStore.ts`) mit Supabase-Sync
- [ ] Streak-Logik implementieren (inkl. Freeze)
- [ ] Achievement-Checker implementieren

### Phase 3 — Kern-Features (~8h)
- [ ] Mood Tracker Komponente (5 Stufen, Emoji)
- [ ] Suggestion-Map (Mood × Kontext → 3 Vorschläge)
- [ ] Morgen Check-in Flow (3 Fragen + Mood)
- [ ] Abend Check-in Flow (3 Fragen + Mood + QuickWin)
- [ ] Expandable Tabs (Morgen/Abend Umschaltung)
- [ ] QuickWin Wochenzähler (2/2 Anzeige)

### Phase 4 — Gamification (~4h)
- [ ] Streak-Anzeige (Gradient Text + Flammen-Emoji)
- [ ] Streak Freeze Button (1x/Woche)
- [ ] Wochenziel-Fortschrittsring (Recharts RadialBar)
- [ ] Achievement Badges Grid (8 Badges)
- [ ] Badge-Unlock Animation (Framer Motion)

### Phase 5 — Dashboard & UI-Polish (~4h)
- [ ] Startseite / Dashboard zusammenführen
- [ ] "On this Day"-Erinnerungen
- [ ] Tubelight Navbar (Home / Check-in / Achievements / Verlauf)
- [ ] Aurora Background für Dashboard
- [ ] Responsive Layout testen (Mobile + Desktop)
- [ ] Dark Mode support

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

## Review
*(wird nach Fertigstellung befüllt)*


## Redesign Phasen (Basierend auf UI Vorschl�gen)

### Phase 1 � Macro Layout (Die Struktur) [Branch: design/macro-layout]
- [x] Fluid Layout (Volle Breite mit Padding statt zentriertem Container)
- [x] Gruppierte und hierarchische Navigation (Sections in der SideNav aktualisieren)
- [x] Globaler "Top-Level" Kontext/Header (Header-Leiste für Titel & Kontext einfügen)

### Phase 2 � Dashboard Redesign (Das Raster) [Branch: design/bento-dashboard]
- [x] Organische Cards (Card UI statt aktueller Listen, weichere Schatten, mehr Whitespace)
- [x] Bento-Grid Dashboard-Struktur (CSS Grid Implementierung für das Main-Dashboard)
- [x] Prominenter Call-to-Action (CTA) Block für den Check-in direkt im Grid

### Phase 3 � Quick Actions (Der Kontext) [Branch: design/right-sidebar]
- [ ] Rechte Sidebar / Sliding-Panel f�r schnelle Interaktionen (Quick Wins, �bungen)
- [ ] Auslagerung der Interventionen aus dem Modal in diese Kontext-Spalte

### Phase 4 � Visualizations & Emotion (Der Feinschliff) [Branch: design/data-viz-and-emotion]
- [ ] Inline-Visualisierungen / Daten aggregieren (Wochentrend-Diagramm ins Dashboard integrieren)
- [ ] Emotionales Farbsystem f�r Faces anstatt Text/Zahlen (Mood-Gesichter re-designen)
- [ ] Interactive Tooltips & Hover-States f�r Chart-Elemente und Moods hinzuf�gen
