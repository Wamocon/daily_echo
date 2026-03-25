# DailyEcho — Product Backlog

> Stand: März 2026 | Branch-Strategie: 1 Branch pro Sprint, Freigabe vor nächstem Sprint

---

## Sprint-Roadmap

| Sprint | Branch | Thema | Status |
|--------|--------|-------|--------|
| S1 | `sprint/1-guided-reflection` | Geführte Reflexion (Reframing + Perspektivwechsel) | 🟡 In Entwicklung |
| S2 | `sprint/2-intention-loop` | Intention-Loop (Morgen → Abend Brücke) | ⬜ Wartet auf Freigabe S1 |
| S3 | `sprint/3-xp-level-system` | XP / Level / Unlockables | ⬜ Wartet auf Freigabe S2 |
| S4 | `sprint/4-micro-interventions` | Micro-Interventionen nach Check-in | ⬜ Wartet auf Freigabe S3 |
| S5 | `sprint/5-values-compass` | Werte-Kompass im Onboarding | ⬜ Wartet auf Freigabe S4 |

---

## Sprint 1 — Geführte Reflexion

### Ziel
Der User verlässt die App mit einem anderen Gedanken als er reinkam.

### Features
- **Perspektivwechsel-Prompt (Vorschlag 15)**  
  Bei Mood ≤ 2 nach der letzten Antwort:  
  > "Wenn dein bester Freund das erlebt hätte — was würdest du ihm sagen?"  
  User tippt Antwort → App spiegelt: "Das gilt auch für dich."

- **Reframing-Prompt (Vorschlag 1)**  
  Nach Perspektivwechsel oder allgemein bei Mood ≤ 2:  
  > "Gibt es eine andere Sichtweise auf das, was du beschrieben hast?"  
  Chip-Auswahl + optional Freitext.

- **Mood-Kontext-Klärung (Vorschlag 8)**  
  Bei Mood 1–2: 3 Chips "Nur heute / Seit ein paar Tagen / Schon eine Weile"  
  → Beeinflusst Ton der Suggestions.

---

## Sprint 2 — Intention-Loop

### Ziel
Abend-Check-in bekommt Bedeutung durch Verbindung zum Morgen.

### Features
- **Morgen-Intention speichern**  
  Neue Frage im Morgen-Flow: "Was soll heute dein wichtigster Moment sein?"  
  → Separat in `DailyEntry.morning_intention` gespeichert.

- **Abend-Auflösung**  
  Wenn `morning_intention` vorhanden: Abend-Check-in startet mit:  
  > "Heute Morgen wolltest du: '{intention}' — wie ist es gelaufen?"  
  Drei Chips: ✅ Geschafft / 🔄 Teilweise / ❌ Nicht geklappt + optionaler Kommentar.

- **Kontinuität-Badge**  
  Neues Achievement `loop_closed`: 5x Morgen + Abend mit Intention verbunden.

---

## Sprint 3 — XP / Level / Unlockables

### Ziel
Gamification mit Langzeitmotivation — Fortschritt ist immer sichtbar und verlockend.

### XP-Tabelle

| Aktion | XP |
|--------|----|
| Morgen Check-in | +20 |
| Abend Check-in | +20 |
| Quick Win erfasst | +25 |
| Beide am selben Tag | +15 Bonus |
| Optionale Frage beantwortet | +10 |
| Perspektivwechsel abgeschlossen | +15 |
| Intention-Loop geschlossen | +20 |
| Streak-Milestone (7 / 14 / 30 / 100 Tage) | +100 |
| Tag verpasst (nach Grace Period 1 Tag) | -5 |
| 3+ Tage verpasst | -20 + mögl. Level-Verlust |

### Level-Skala (logarithmisch)

| Level | Titel | XP |
|-------|-------|----|
| 1 | Beginner | 0 |
| 2 | Reflector | 100 |
| 3 | Seeker | 250 |
| 4 | Explorer | 500 |
| 5 | Journaler | 900 |
| 6 | Mindful | 1.500 |
| 7 | Achiever | 2.500 |
| 8 | Master | 4.000 |
| 9 | Sage | 6.500 |
| 10 | Echo Legend | 10.000 |

### 🔓 Unlockables — XP / Level Belohnungen

| Unlock | Typ | Voraussetzung |
|--------|-----|---------------|
| **Dark Mode** | Feature | Level 2 (100 XP) |
| **Avatar-Rahmen: Silber** | Accessory | Level 3 |
| **Avatar-Rahmen: Gold** | Accessory | Level 6 |
| **Avatar-Rahmen: Legendary** | Accessory | Level 10 |
| **Custom Streak-Emoji** | Accessory | Level 4 |
| **Prompt-Bibliothek Kategorie: "Tiefgang"** | Feature | Level 3 |
| **Wöchentlicher Psycho-Brief** | Feature | Level 5 |
| **Kalender-Heatmap Mood-View** | Feature | Level 4 |
| **Erweiterte Statistiken** | Feature | Level 6 |
| **Custom Tagesstart-Zitat** | Accessory | 500 XP |
| **Streak-Shield: Bronze** | Accessory | 250 XP |
| **Streak-Shield: Gold** | Accessory | 1.500 XP |
| **Check-in Skin: Minimal** | Accessory | Level 5 |
| **Check-in Skin: Focus Mode** | Accessory | Level 7 |

### UI-Komponenten
- **XP-Bar** auf Home-Seite (unter Streak)
- **Level-Badge** im Profil + SideNav
- **Level-Up-Animation** (Framer Motion, Konfetti)
- **Unlockables-Seite** `/unlockables` — Grid aller Items, locked/unlocked Status
- **XP-Toast** nach jeder Aktion: "+20 XP"

---

## Sprint 4 — Micro-Interventionen

### Ziel
Der User verlässt die App mit einer konkreten 2-Minuten-Aktion.

### Features
- **Interventions-Matrix** `lib/interventions.ts`  
  Matrix: `mood × context × timeOfDay` → 1 präzise Karte  
  Karte zeigt: Titel + Beschreibung + Zeitaufwand + "Erledigt"-Button  

- **Interventionskarte nach Done-Screen**  
  Erscheint als letzte Karte nach dem Check-in-Abschluss.

- **"Did it"-Tracking**  
  Wenn User "Erledigt" drückt: +5 XP Bonus.

### Beispiel-Matrix (Auszug)

| Mood | Kontext | Intervention |
|------|---------|-------------|
| 1 | Morgen | Box Breathing 5min → dann 1 kontrollierbares Ziel notieren |
| 1 | Abend | Kein Bildschirm + 3er Dankbarkeitsliste |
| 3 | Morgen | Was wäre der beste Moment heute? Aufschreiben |
| 5 | Morgen | Dokumentiere was dich in diesen Zustand gebracht hat |
| 5 | Abend | Quick Win Eintrag + jemanden anrufen |

---

## Sprint 5 — Werte-Kompass

### Ziel
Langzeitbindung durch Werte-verknüpfte Fragen — jeder Check-in fühlt sich persönlich relevant an.

### Features
- **Werte-Auswahl im Onboarding** (Schritt 6, nach QuickWin-Ziel)  
  User wählt 3 aus 10 Werten:  
  Familie · Karriere · Gesundheit · Kreativität · Freundschaft · Sinn · Wachstum · Ruhe · Abenteuer · Finanzen

- **Werte-basierte Fragen**  
  `lib/questions.ts` bekommt Tag: `values?: UserValue[]`  
  `getQuestionsForUser(profile, context)` mischt 1 werte-basierte Frage in die 3 Kernfragen.

- **Werte-Tracking auf Profil-Seite**  
  Kleine Badges für jede Wert — mit Zähler wie oft eine Werte-Frage beantwortet wurde.

---

## Weitere Backlog-Ideen (Future Sprints)

| # | Idee | Kategorie | Aufwand |
|---|------|-----------|---------|
| B1 | Pattern Recognition über 7 Tage | Analyse | M |
| B2 | Wöchentlicher Psycho-Brief (template-basiert) | Engagement | M |
| B3 | Energie-Tracking (zweite Skala neben Mood) | Core | S |
| B4 | Sokratische Nachfrage (KI-optional) | Reflexion | L |
| B5 | Wortanalyse / Sentiment-Feedback | Analyse | L |
| B6 | "Aha-Moment"-Button während des Schreibens | UX | S |
| B7 | Erfolgsarchiv: "Vor 30 Tagen hast du..." | Engagement | M |
| B8 | Handlungs-Chips bei Mood 1 (statt Freitext) | UX | S |
| B9 | Wochenstimmungs-Chart (Sparkline) | Visualisierung | S |
| B10 | Landing Page | GoLive | M |
| B11 | Supabase Auth + Sync | GoLive | L |
| B12 | SEO Metadata | GoLive | S |
| B13 | Sozialer Streak-Vergleich (optional) | Social | L |
| B14 | Custom Notifications mit Mood-Context | Notifications | M |
| B15 | Export als PDF / Jahresbericht | Export | M |
