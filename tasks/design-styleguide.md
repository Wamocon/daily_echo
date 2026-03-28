# DailyEcho — Design Style Guide

**Stand:** März 2026  
**Basis:** globals.css, layout.tsx, Tailwind / shadcn/ui (Style: base-nova)

---

## 1. Typografie

| Rolle | Font | Variante | Verwendung |
|---|---|---|---|
| **Primär / Fließtext** | DM Sans | Normal, SemiBold, Bold | Headlines, Buttons, Body-Text |
| **Mono / Code** | IBM Plex Mono | 400, 500, 600 | Code-Snippets, Debug-Anzeigen, Zahlen-Displays |

- **Schriftgrößen** (Tailwind-Klassen): `text-sm` (14px), `text-base` (16px), `text-xl` (20px), `text-2xl` (24px), `text-3xl` (30px)
- **Font Weights**: `font-medium`, `font-semibold`, `font-bold`
- Anti-Aliasing: `antialiased` global gesetzt

---

## 2. Farben

### 2.1 Light Mode

| Token | Hex-Wert | Bedeutung / Verwendung |
|---|---|---|
| `--background` | `#f0f8ff` | Seitenhintergrund (sehr helles Blau) |
| `--foreground` | `#374151` | Standard-Textfarbe (dunkles Grau) |
| `--card` | `#ffffff` | Kartenhintergrund |
| `--primary` | `#22c55e` | Akzentfarbe, Buttons, Ringe (Grün) |
| `--primary-foreground` | `#ffffff` | Text auf Primary-Elementen |
| `--secondary` | `#e0f2fe` | Sekundärer Hintergrund (Sky-100) |
| `--accent` | `#d1fae5` | Subtile Hervorhebung (Emerald-100) |
| `--muted` | `#f3f4f6` | Dezenter Hintergrund |
| `--muted-foreground` | `#6b7280` | Sekundärer Text / Platzhalter |
| `--border` | `#e5e7eb` | Rahmenfarbe |
| `--destructive` | `#ef4444` | Fehler / Löschen (Rot) |
| `--sidebar` | `#e0f2fe` | Sidebar-Hintergrund |

### 2.2 Dark Mode

| Token | Hex-Wert | Bedeutung / Verwendung |
|---|---|---|
| `--background` | `#0f172a` | Seitenhintergrund (Slate-900) |
| `--foreground` | `#d1d5db` | Standard-Text |
| `--card` | `#1e293b` | Kartenhintergrund (Slate-800) |
| `--primary` | `#34d399` | Akzentfarbe (Emerald-400) |
| `--secondary` | `#2d3748` | Sekundärer Hintergrund |
| `--muted-foreground` | `#6b7280` | Sekundärer Text |
| `--border` | `#4b5563` | Rahmenfarbe |
| `--sidebar` | `#1e293b` | Sidebar-Hintergrund |

### 2.3 Chartfarben (Grün-Palette)

Verwendet für Mood-Charts, Fortschrittsanzeigen:

| | Hex | Tailwind-Äquivalent |
|---|---|---|
| Chart-1 | `#22c55e` | green-500 |
| Chart-2 | `#10b981` | emerald-500 |
| Chart-3 | `#059669` | emerald-600 |
| Chart-4 | `#047857` | emerald-700 |
| Chart-5 | `#065f46` | emerald-900 |

### 2.4 Rainbow / Spezialfarben

Für animierte Elemente (RainbowButton, XP-Effekte):

| Token | Wert | Farbe |
|---|---|---|
| `--color-1` | `hsl(0 100% 63%)` | Rot |
| `--color-2` | `hsl(270 100% 63%)` | Lila |
| `--color-3` | `hsl(210 100% 63%)` | Blau |
| `--color-4` | `hsl(195 100% 63%)` | Cyan |
| `--color-5` | `hsl(90 100% 63%)` | Hellgrün |
| `--brand` | `hsl(50 100% 50%)` | Goldgelb (Brand-Akzent) |

---

## 3. Formen & Border Radius

Das System setzt auf **weiche, gerundete Ecken** durchgehend:

| Klasse | Wert | Verwendung |
|---|---|---|
| `rounded-sm` | `~0.3rem` | Kleine Chips, Tags |
| `rounded-md` | `~0.4rem` | Buttons (Standard) |
| `rounded-lg` | `0.5rem` (Base) | Inputs, kleine Cards |
| `rounded-xl` | `~0.7rem` | Haupt-Cards, Panels, Textareas |
| `rounded-2xl` | `~0.9rem` | Achievement-Badges, Feature-Cards |
| `rounded-full` | `50%` | Pills, Progress-Bars, Avatare |

**Grundregel:** `--radius: 0.5rem` als Base, alle anderen Werte berechnen sich relativ dazu.

---

## 4. Schatten & Tiefe

| Klasse | Verwendung |
|---|---|
| `shadow-xl` | Tooltip-Boxen, schwebende Panels |
| `border border-border` | Standard-Kartenrahmen |
| `ring-2 ring-primary/50` | Fokus-Zustand bei Inputs |

---

## 5. Gradienten

| Element | Gradient |
|---|---|
| XP-Fortschrittsbalken | `from-violet-500 to-purple-400` (links → rechts) |
| RainbowButton | Animierter CSS-Gradient über alle `--color-*` Variablen |
| GradientText-Komponente | Konfigurierbar per Props |
| Aurora-Hintergrund | Weiche, animierte Farbverläufe (Spezialeffekt auf Landingpage) |

---

## 6. Komponenten-Bibliothek & Icon-Set

| | |
|---|---|
| **UI-Bibliothek** | shadcn/ui (Style: `base-nova`) |
| **CSS-Framework** | Tailwind CSS v4 |
| **Icon-Set** | Lucide React |
| **Animationen** | `tw-animate-css` |

---

## 7. Design-Prinzipien (aus dem Konzept)

- **Warm & persönlich** — kein kalter Tech-Look, keine klinische Ästhetik
- **Sanft gamifiziert** — Grüne Primärfarbe signalisiert Fortschritt und Wachstum
- **Dual-Mode** — vollständiges Light- und Dark-Theme
- **Mobile-first** — responsive Web-App
- **Kontrast durch Farbbedeutung**: Grün = Fortschritt, Amber = Reflexion/Warnung, Blau = Ruhe/Information, Rot = Fehler/Löschen

---

## 8. Stimmung / Mood-Farbkodierung (in-App)

Wird in `MoodPicker`, `CheckinFlow` und Charts verwendet:

| Stimmung | Farbe |
|---|---|
| Sehr gut | Grün (`green-*`) |
| Gut | Emerald |
| Neutral | Blau / Muted |
| Schlecht | Amber |
| Sehr schlecht | Rot |
