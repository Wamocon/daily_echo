'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Printer, ChevronDown, HelpCircle, BookOpen,
  Zap, Flame, Star, Trophy, Bell, User, ShieldCheck, MessageCircleQuestion,
  Sun, Moon, Target, BarChart2, Sparkles, Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HelpEntry {
  id: string;
  question?: string;
  answer: string;
}

interface HelpSection {
  id: string;
  chapter: number;
  title: string;
  icon: React.ElementType;
  iconColor: string;
  summary: string;
  content: string;
  entries?: HelpEntry[];
}

// ─── Content ──────────────────────────────────────────────────────────────────

const HELP_SECTIONS: HelpSection[] = [
  {
    id: 'ueberblick',
    chapter: 1,
    title: 'Überblick',
    icon: BookOpen,
    iconColor: 'text-violet-500',
    summary: 'Was ist DailyEcho und wie funktioniert es?',
    content: `
DailyEcho ist eine tägliche Reflexions-App, die dir hilft, Klarheit, Fokus und persönliches Wachstum zu entwickeln — durch strukturierte Morgen- und Abend-Check-ins, Quick Wins und Micro-Interventionen.

**Das Kernprinzip in einem Satz**: Wer täglich zwei Minuten reflektiert, wer er ist und was er erlebt, wächst schneller als jeder, der es nicht tut.

**Wo werden deine Daten gespeichert?**
Alle Daten (Einträge, Profil, Erfolge, Quick Wins) werden ausschließlich lokal in deinem Browser gespeichert (localStorage).  Es werden keine Daten an einen Server übertragen. Das bedeutet: keine Cloud-Synchronisierung, aber auch maximale Privatsphäre.

**Was DailyEcho bietet:**
- **Täglich 2× Check-in**: Morgen-Reflexion (Intention setzen) und Abend-Reflexion (Tag auswerten)
- **XP & Level-System**: Dein Engagement wird belohnt — mit Erfahrungspunkten und Level-Aufstiegen
- **Streak-Mechanik**: Aufeinanderfolgende Tage werden als Streak gezählt und belohnt
- **Quick Wins**: Kleine tägliche Erfolge festhalten und wöchentlich tracken
- **Micro-Interventionen**: Wenn deine Stimmung niedrig ist, erhältst du eine passende Übung
- **Achievements**: 10 verschiedene Abzeichen für besondere Meilensteine
- **Werte-Kompass**: Deine persönlichen Werte lenken die Reflexionsfragen
    `.trim(),
  },
  {
    id: 'erste-schritte',
    chapter: 2,
    title: 'Erste Schritte',
    icon: Star,
    iconColor: 'text-yellow-500',
    summary: 'Anmelden, Onboarding und erste Nutzung.',
    content: `
**Anmelden**
Beim ersten Öffnen der App wählst du ein der Demo-Konten aus:
- **Alex** (Nutzer) — vollständiger Zugang zu allen persönlichen Features
- **Admin** — zusätzlich Zugang zum Admin-Panel
- **Gast** — eingeschränkter Lesezugang

Jedes Konto kann mit einem PIN geschützt werden. Der Standard-PIN lautet **1234**.

**Onboarding (7 Schritte)**
Beim ersten Login führt dich der Onboarding-Assistent durch folgende Schritte:

1. **Name**: Wie soll die App dich ansprechen?
2. **Alter**: Optionale Angabe für die personalisierte Ansprache
3. **Beruf**: In welchem beruflichen Umfeld befindest du dich?
4. **Ziel**: Was möchtest du mit DailyEcho erreichen? (Klarheit & Fokus / Stressabbau / Karriere-Tracking / Persönliches Wachstum)
5. **Quick-Win-Ziel**: Wie viele Quick Wins willst du pro Woche erzielen? (1–5)
6. **Werte**: Wähle 1–3 persönliche Werte, die deine Reflexionsfragen beeinflussen (Familie, Karriere, Gesundheit, Kreativität, Freundschaft, Sinn, Wachstum, Ruhe, Abenteuer, Finanzen)
7. **Fertig**: Dein Profil ist bereit

Nach dem Onboarding landest du direkt auf dem Dashboard.
    `.trim(),
  },
  {
    id: 'dashboard',
    chapter: 3,
    title: 'Das Dashboard',
    icon: BarChart2,
    iconColor: 'text-blue-500',
    summary: 'Alle Dashboard-Kacheln und die rechte Sidebar erklärt.',
    content: `
Das Dashboard ist dein täglicher Ausgangspunkt. Es zeigt alle relevanten Informationen auf einen Blick.

**Kacheln im Dashboard:**

**Tägliche Reflexion (links oben)**
Der Haupt-Call-to-Action. Zeigt an, welcher Check-in als nächstes ansteht (Morgen oder Abend) und ob du für heute bereits beide abgeschlossen hast. Klicke auf den Button, um den Check-in zu starten.

**Dein Fortschritt (rechts oben)**
Zeigt dein aktuelles Level, deinen XP-Fortschritt und drei Fortschrittsbalken:
- 🌅 **MorningEcho** — Morgen-Check-in heute (+20 XP)
- 🌙 **NightEcho** — Abend-Check-in heute (+20 XP)
- ⚡ **Quick Wins** — Wöchentliches Quick Win Ziel

**Dein Rhythmus (links mitte)**
Zeigt den Status deiner heutigen Check-ins als klickbare Kacheln. Enthält außerdem:
- Deine heutige **Morgen-Intention** mit Möglichkeit zur Abend-Auswertung
- **Quick Win erfassen** — direkte Eingabe eines Quick Wins für heute

**Kalender (rechts mitte)**
Monatskalender mit farbigen Punkten für jeden Tag mit Check-in. In der Kopfzeile des Kalenders wird dein aktueller Streak angezeigt.

**Stimmungstrend (unten, volle Breite)**
Balkendiagramm der letzten 14 Tage. Zeigt die Stimmungswerte (1–5) der Morgen- und Abend-Check-ins als farbige Balken.

**Rechte Sidebar — Interaktions-Werkzeuge**
Die rechte Sidebar (klappbar via Button oben rechts) bietet:
- **Jetzt empfohlen**: Micro-Intervention bei niedriger Stimmung
- **Fokus-Timer**: Pomodoro-Technik (25 Min Arbeit, 5 Min Pause)
- **Atemübung**: Box-Breathing (4-4-4-4 Sekunden Rhythmus)
- **Lo-Fi Musik**: YouTube Lo-Fi-Stream direkt eingebettet
    `.trim(),
  },
  {
    id: 'checkin',
    chapter: 4,
    title: 'Check-in durchführen',
    icon: Sun,
    iconColor: 'text-orange-500',
    summary: 'Morgen- und Abend-Check-in, Fragen und Intentions-Loop.',
    content: `
Der Check-in ist das Herzstück von DailyEcho. Er dauert 2–5 Minuten und führt dich in mehreren Schritten durch eine strukturierte Reflexion.

**Morgen-Check-in (Start über Dashboard oder Menü "Check-in")**

*Schritt 1 — Stimmung*: Wie fühlst du dich gerade? Skala 1–5:
- 😔 1 — Schlecht / Erschöpft
- 😕 2 — Eher mies
- 😐 3 — Neutral
- 🙂 4 — Gut
- 😄 5 — Hervorragend

*Schritt 2 — Pflichtfragen (Morgen):*
1. Was ist deine Intention für heute?
2. Was ist das Erste, worauf du dich heute freust?
3. Was könnte heute herausfordernd werden — und wie gehst du damit um?

*Schritt 3 — Optionale Zusatzfrage* (zufällig ausgewählt, z.B. "Welche Aufgabe hast du zuletzt aufgeschoben?")

*Schritt 4 — Werte-Frage* (falls Werte beim Onboarding gewählt wurden, rotierend täglich)

*Schritt 5 — Fertig*: XP-Vergabe, Streak-Update, Achievement-Prüfung

**Abend-Check-in**

*Schritt 1 — Intentions-Loop:* Deine Morgen-Intention wird angezeigt. Du bewertest, wie es gelaufen ist:
- ✅ Geschafft
- ⚡ Teilweise
- ❌ Nicht geschafft

*Schritt 2 — Stimmung* (1–5, wie oben)

*Schritt 3 — Pflichtfragen (Abend):*
1. Was war heute dein schönster Moment?
2. Was hat dich heute belastet oder Energie gekostet?
3. Was nimmst du dir aus dem heutigen Tag mit?

*Schritt 4 — Optionale Frage + Werte-Frage*

*Schritt 5 — Quick Win*: Möchtest du einen Erfolg von heute festhalten?

*Schritt 6 — Fertig*: XP-Vergabe, Streak-Update

**Bonus-XP für Abschluss beider Check-ins am selben Tag: +15 XP extra**
    `.trim(),
  },
  {
    id: 'quick-wins',
    chapter: 5,
    title: 'Quick Wins',
    icon: Zap,
    iconColor: 'text-amber-500',
    summary: 'Kleine Erfolge erfassen, Wochenziele tracken.',
    content: `
Quick Wins sind kurze, positive Feststellungen deiner täglichen Erfolge. Sie helfen dir, Fortschritt wahrzunehmen, den du sonst übersehen würdest.

**Was ist ein Quick Win?**
Alles, was du heute getan hast und auf das du (auch ein bisschen) stolz sein kannst. Beispiele:
- "Habe heute 30 Minuten sport gemacht"
- "Endlich den ungelesenen E-Mail-Berg aufgeräumt"
- "Einem Freund geschrieben, den ich lange nicht kontaktiert hatte"

**Quick Win erfassen — 3 Wege:**
1. **Dashboard-Kachel "Dein Rhythmus"** → Quick Win erfassen (expandierbares Textfeld)
2. **Am Ende des Abend-Check-ins** — direkte Eingabe
3. **Verlauf-Seite** → Quick Wins Tab → aktuelle Woche

**Wochenziel**
Du legst beim Onboarding (oder im Profil) fest, wie viele Quick Wins du pro Woche erzielen möchtest (1–5). Der Fortschrittsbalken im Dashboard zeigt deinen Wochenfortschritt.

**+25 XP** für jeden eingetragenen Quick Win.

**Archiv**
Im Verlauf kannst du mit dem Wochennavigator (< >) durch vergangene Wochen blättern und deine Quick Wins ansehen. Quick Wins der laufenden Woche können auch gelöscht werden (Hover über den Eintrag → Papierkorb-Icon erscheint).
    `.trim(),
  },
  {
    id: 'verlauf',
    chapter: 6,
    title: 'Verlauf & Rückblick',
    icon: BookOpen,
    iconColor: 'text-teal-500',
    summary: 'Eintragsarchiv, Stimmungstrend und Heute-vor-einem-Jahr-Feature.',
    content: `
Die Verlauf-Seite (Navigation: "Verlauf") zeigt all deine vergangenen Reflexionen und Quick Wins.

**Quick Wins Bereich**
Oben auf der Seite befindet sich der Quick Wins Navigator:
- **Wochennavigator**: Mit den Pfeiltasten < > kannst du Woche für Woche zurückblättern
- **Fortschrittsbalken**: Zeigt, ob du dein Wochenziel in der jeweiligen Woche erreicht hast
- **Heute-Eingabe**: Quick Wins für die aktuelle Woche direkt hinzufügen (Enter oder Hinzufügen-Button)
- **Frühere Wochen**: Zeigt als Liste die letzten 6 Wochen zum schnellen Wechsel

**Eintragsarchiv**
Darunter werden alle deine Check-in-Einträge angezeigt, neueste zuerst. Jede Karte zeigt:
- Datum (Wochentag, Tag, Monat, Jahr)
- Morgen-Mood-Emoji (🌅) und Abend-Mood-Emoji (🌙)
- Quick Win Text (falls vorhanden, orange hervorgehoben)
- Abend-Antwort-Vorschau (gekürzter Text)

**Heute vor einem Jahr**
Falls du vor genau 365 Tagen einen Eintrag gemacht hast, erscheint er ganz oben als besonderer Rückblick — eine schöne Erinnerung, wie du damals gedacht hast.
    `.trim(),
  },
  {
    id: 'streak',
    chapter: 7,
    title: 'Streak-System',
    icon: Flame,
    iconColor: 'text-orange-500',
    summary: 'Wie Streaks zählen, die Freeze-Mechanik und Meilensteine.',
    content: `
Ein Streak zählt, wie viele Tage in Folge du mindestens einen Check-in abgeschlossen hast.

**Was zählt als Streak?**
Mindestens ein abgeschlossener Check-in (Morgen oder Abend) pro Kalendertag. Du musst nicht beide Check-ins machen — einer reicht, um den Streak am Laufen zu halten.

**Streak anzeigen**
Dein aktueller Streak wird im Dashboard-Kalender (oben links in der Kachel) und in der SideNav (als 🔥-Pill neben deinem Level) angezeigt. Das Profil zeigt zusätzlich deinen längsten je erreichten Streak.

**Streak Freeze — Ein Tag Aussetzen erlaubt**
Jede Woche hast du ein "Freeze". Wenn du einen Tag aussetzt, wird dein Streak automatisch eingefroren (kein Verlust). Das Freeze wird dann für diese Woche verbraucht. Wenn du in derselben Woche einen zweiten Tag aussetzt, bricht der Streak.

**Streak-Meilensteine (je +100 XP)**
- 🔥 7 Tage
- 🔥🔥 14 Tage
- 💪 30 Tage
- 🏔️ 100 Tage

**Wenn der Streak bricht**
Kein Drama. Der Streak beginnt von vorne. Dein längster Streak bleibt jedoch als Rekord gespeichert.
    `.trim(),
  },
  {
    id: 'xp-level',
    chapter: 8,
    title: 'XP & Level-System',
    icon: Star,
    iconColor: 'text-purple-500',
    summary: 'XP-Tabelle, alle Level und was sie freischalten.',
    content: `
Das XP-System belohnt dich für regelmäßige Reflexion. Mit ausreichend XP steigst du im Level auf und schaltest neue Features und Kosmetik frei.

**XP-Tabelle — Einnahmen**
| Aktion | XP |
|--------|-----|
| Morgen-Check-in abgeschlossen | +20 XP |
| Abend-Check-in abgeschlossen | +20 XP |
| Bonus: beide Check-ins am selben Tag | +15 XP |
| Quick Win erfasst | +25 XP |
| Intentions-Loop geschlossen | +20 XP |
| Perspektiv-Schritt im Check-in | +15 XP |
| Streak-Meilenstein (7/14/30/100 Tage) | +100 XP |
| Micro-Intervention abgeschlossen | +5 XP |

**XP-Verluste**
| Ereignis | XP |
|----------|-----|
| 1 Tag verpasst | −5 XP |
| 3+ Tage in Folge verpasst | −20 XP |

**Level-Tabelle**
| Level | Titel | XP ab |
|-------|-------|-------|
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

**Freischaltungen nach Level**
| Level | Freischaltung |
|-------|---------------|
| 2 | Dark Mode (Theme) |
| 3 | Silber-Rahmen · Tiefgang-Bibliothek |
| 4 | Streak-Emoji · Mood Heatmap |
| 5 | Wochen-Brief |
| 6 | Gold-Rahmen · Erweiterte Stats |
| 10 | Legendärer Rahmen |

Der XP-Balken ist jederzeit im Dashboard ("Dein Fortschritt"-Kachel) und in der SideNav sichtbar.
    `.trim(),
  },
  {
    id: 'achievements',
    chapter: 9,
    title: 'Erfolge (Achievements)',
    icon: Trophy,
    iconColor: 'text-yellow-500',
    summary: 'Alle 10 Abzeichen und wie man sie freischaltet.',
    content: `
Achievements sind permanente Abzeichen, die du für bestimmte Meilensteine erhältst. Sie werden auf der Erfolge-Seite (Navigation: "Erfolge") angezeigt.

**Alle 10 Achievements**
| Abzeichen | Emoji | Freischalt-Bedingung |
|-----------|-------|----------------------|
| First Spark | 🔥 | 1. Check-in abgeschlossen |
| Week One | 🗓️ | 7-Tage-Streak erreicht |
| Iron Will | 💪 | 30-Tage-Streak erreicht |
| Summit | 🏔️ | 100-Tage-Streak erreicht |
| First Win | ⚡ | 1. Quick Win erfasst |
| On a Roll | 🎯 | Wöchentliches Quick-Win-Ziel erreicht |
| Both Worlds | ☯️ | Morgen- UND Abend-Check-in am selben Tag |
| Deep Diver | 📖 | Prompt-Bibliothek genutzt |
| Goal Setter | 🎯 | Onboarding vollständig abgeschlossen |
| Loop Closed | 🔄 | Intentions-Loop 5× geschlossen |

**Unterschied: Achievements vs. Freischaltungen**
- **Achievements** sind Abzeichen/Trophäen ohne funktionale Auswirkung — sie dokumentieren deine Geschichte
- **Freischaltungen** sind echte Features oder kosmetische Extras, die nach Level-Aufstieg aktiviert werden

**Fortschrittsanzeige**
Bei Achievements, die noch nicht freigeschaltet sind, zeigt die App einen Fortschrittsbalken an (z.B. "5 von 7 Tagen" für Week One).
    `.trim(),
  },
  {
    id: 'interventionen',
    chapter: 10,
    title: 'Micro-Interventionen',
    icon: Sparkles,
    iconColor: 'text-violet-500',
    summary: 'Wann erscheinen Empfehlungen und wie nutzt man sie.',
    content: `
Micro-Interventionen sind kurze, konkrete Übungen oder Aufgaben, die dir helfen, mit einer niedrigen Stimmung umzugehen oder einen positiven Impuls zu setzen.

**Wann erscheint eine Empfehlung?**
Die Karte "Jetzt empfohlen" in der rechten Dashboard-Sidebar wird angezeigt, wenn:
- Dein letzter Check-in eine Stimmung von 1–3 ergab (Mood ≤ 3)
- Du die Intervention des heutigen Tages noch nicht abgeschlossen hast

**Wie nutzt man eine Intervention?**
1. Lies die Empfehlung in der Karte (Titel + Beschreibung)
2. Führe die Übung durch (Atemübung, kurzes Schreiben, Bewegung etc.)
3. Nutze das **Textfeld** unter der Beschreibung für deine Notizen (z.B. "Zwei Sätze, was ich kontrollieren kann")
4. Klicke **"Erledigt — +5 XP"** um die Intervention abzuschließen

Das Textfeld ist optional. Auch ohne Notiz kannst du die Intervention bestätigen.

**Welche Interventionen gibt es?**
Die Empfehlung wird basierend auf deiner Stimmung (1–5) und der Tageszeit (Morgen/Abend) ausgewählt. Beispiele:
- Stimmung 1, Morgen → "Box Breathing" (4-4-4-4 Atemübung)
- Stimmung 2, Morgen → "Micro-Win setzen" (1 erreichbares Ziel notieren)
- Stimmung 3, Abend → "Kurze Tagesauswertung" (zwei Sätze schreiben)
- Stimmung 4, Morgen → "Big 3 des Tages" (drei Prioritäten festhalten)
- Stimmung 5, Abend → "Morgen noch besser machen" (Energie nutzen)
    `.trim(),
  },
  {
    id: 'werte',
    chapter: 11,
    title: 'Werte-Kompass',
    icon: Heart,
    iconColor: 'text-rose-500',
    summary: 'Persönliche Werte und wie sie deine Reflexion beeinflussen.',
    content: `
Der Werte-Kompass ist ein Feature, das deine persönlichen Prioritäten in die tägliche Reflexion einbindet.

**Was sind persönliche Werte?**
Werte sind die Prinzipien, die dir wichtig sind und dein Handeln leiten. DailyEcho bietet 10 Werte zur Auswahl:
Familie · Karriere · Gesundheit · Kreativität · Freundschaft · Sinn · Wachstum · Ruhe · Abenteuer · Finanzen

**Werte einstellen**
Beim Onboarding (Schritt 6) wählst du 1–3 Werte. Du kannst sie jederzeit im Profil ändern.

**Wie beeinflussen Werte den Check-in?**
Als 4. Frage im Check-in wird täglich eine wertspezifische Frage eingeblendet. Das System rotiert täglich durch deine gewählten Werte. Beispiele:
- Wert "Karriere" → "Welchen Schritt hast du heute für deine Karriere-Ziele getan?"
- Wert "Familie" → "Wie hast du heute für deine Familie da sein können?"
- Wert "Gesundheit" → "Was hast du heute für deine körperliche oder mentale Gesundheit getan?"

**Value-Counter im Profil**
Im Profil siehst du, wie oft du über jeden deiner Werte reflektiert hast (z.B. "Karriere: 12×"). Das hilft dir zu sehen, welchen Werten du in deiner Reflexion besonders viel Raum gibst.
    `.trim(),
  },
  {
    id: 'erinnerungen',
    chapter: 12,
    title: 'Erinnerungen & Benachrichtigungen',
    icon: Bell,
    iconColor: 'text-blue-500',
    summary: 'Browser-Benachrichtigungen für Check-ins konfigurieren.',
    content: `
DailyEcho kann dich täglich an deine Check-ins erinnern — über Browser-Benachrichtigungen.

**Erinnerungen aktivieren**
1. Gehe zu **Profil** (Navigation)
2. Öffne die Sektion **"Erinnerungen"** (ausklappbare Karte)
3. Klicke **"Aktivieren"** → der Browser fragt nach der Erlaubnis
4. Erlaube Benachrichtigungen → du erhältst sofort eine Test-Benachrichtigung

**Einstellungen**
Nach der Aktivierung kannst du konfigurieren:
- 🌅 **Morgens erinnern um**: Uhrzeit für den Morgen-Check-in (Standard: 08:00)
- 🌙 **Abends erinnern um**: Uhrzeit für den Abend-Check-in (Standard: 19:00)
- ⚡ **Quick Win Tipp freitags**: Freitagsnachmittag-Erinnerung, die Woche zusammenzufassen

Klicke **"Speichern"** um die Zeiten zu übernehmen.

**Wichtiger Hinweis**
Die Erinnerungen funktionieren nur, solange der Browser-Tab geöffnet ist. DailyEcho nutzt **keine** Push-Benachrichtigungen, die auch bei geschlossenem Browser funktionieren.

**Benachrichtigungen deaktivieren**
Schalte den Haupt-Toggle "Alle Erinnerungen" auf AUS — oder entziehe die Berechtigung im Browser (Einstellungen → Datenschutz → Benachrichtigungen).
    `.trim(),
  },
  {
    id: 'profil',
    chapter: 13,
    title: 'Profil & Einstellungen',
    icon: User,
    iconColor: 'text-slate-500',
    summary: 'Profil bearbeiten, Werte anpassen, abmelden.',
    content: `
Im Profil (Navigation: "Profil") verwaltest du alle persönlichen Einstellungen.

**Profil bearbeiten**
Klicke auf "Bearbeiten" oben rechts. Du kannst ändern:
- **Name**: Anzeigename in der App
- **Alter**: Optionale Angabe
- **Beruf**: Dein berufliches Umfeld
- **Ziel**: Dein Hauptziel mit DailyEcho
- **Quick Win Ziel / Woche**: 1–5 Quick Wins als Wochenziel

Klicke **"Speichern"** um die Änderungen zu übernehmen, oder **"Abbrechen"** um sie zu verwerfen.

**Statistiken anzeigen**
Das Profil zeigt deine wichtigsten Kennzahlen:
- 🔥 Aktueller Streak
- ✅ Gesamt Check-ins
- ⚡ Gesamt Quick Wins

**Werte-Kompass**
Am Ende der Seite siehst du deine gewählten Werte und wie oft du über jeden reflektiert hast.

**Erinnerungen**
Der ausklappbare "Erinnerungen"-Bereich im Profil ermöglicht das Konfigurieren der Browser-Benachrichtigungen (siehe Kapitel 12).

**Abmelden**
Der rote "Abmelden"-Button am Ende der Seite meldet dich aus dem aktuellen Konto ab. Deine Daten bleiben im Browser erhalten — sie sind dem Browser-Speicher zugeordnet, nicht dem Konto.
    `.trim(),
  },
  {
    id: 'admin',
    chapter: 14,
    title: 'Admin-Panel',
    icon: ShieldCheck,
    iconColor: 'text-amber-500',
    summary: 'Konten verwalten, Statistiken einsehen (nur für Admins).',
    content: `
Das Admin-Panel ist nur für Nutzer mit der Rolle **Admin** sichtbar und zugänglich.

**Zugang**
Navigation → "Admin" (erscheint nur wenn du als Admin eingeloggt bist)

**App-Statistiken**
Oben zeigt das Admin-Panel die Kennzahlen der aktuellen Sitzung:
- Gesamt Check-ins, Quick Wins, aktueller Streak, Anzahl freigeschalteter Achievements
- Wöchentlicher Fortschritt (Check-ins & Quick Wins)

**Demo-Konten verwalten**
Im Abschnitt "Demo-Konten verwalten" siehst du alle vorhandenen Konten. Für jedes Konto kannst du auf "Bearbeiten" klicken und folgendes ändern:
- **Name**: Anzeigename des Kontos
- **PIN**: Zugangscode (max. 8 Zeichen, leer lassen = kein PIN)
- **Tagline**: Kurzbeschreibung des Kontos
- **Rolle**: Admin / Nutzer / Gast

Klicke **"Speichern"** um die Änderungen zu übernehmen.

**Als anderer Nutzer einloggen**
Jede Karte hat einen "Einloggen"-Button (außer dem eigenen Konto). Damit wechselst du direkt zur Sitzung dieses Nutzers.

**Hinweis**
Änderungen an Demo-Konten werden lokal im Browser gespeichert und überschreiben die Standardwerte. Sie gelten nur in deinem Browser.
    `.trim(),
  },
  {
    id: 'faq',
    chapter: 15,
    title: 'Häufige Fragen (FAQ)',
    icon: MessageCircleQuestion,
    iconColor: 'text-green-500',
    summary: 'Antworten auf die häufigsten Fragen.',
    content: '',
    entries: [
      {
        id: 'faq-cloud',
        question: 'Werden meine Daten in der Cloud gespeichert?',
        answer: 'Nein. Alle Daten (Einträge, Profil, Achievements, Quick Wins) werden ausschließlich lokal im localStorage deines Browsers gespeichert. Es findet keine Übertragung an externe Server statt. Das bedeutet: maximale Privatsphäre, aber kein Sync zwischen Geräten.',
      },
      {
        id: 'faq-missed-day',
        question: 'Was passiert, wenn ich einen Tag verpasse?',
        answer: 'Du verlierst 5 XP. Dein Streak bricht jedoch nicht sofort, da du einmal pro Woche ein "Freeze" hast, das einen verpassten Tag abfängt. Bei zwei oder mehr verpassten Tagen in einer Woche bricht der Streak auf 0 zurück. Dein persönlicher Rekord-Streak bleibt gespeichert.',
      },
      {
        id: 'faq-multiple-profiles',
        question: 'Kann ich mehrere Nutzer-Profile haben?',
        answer: 'Ja, über das Demo-Konto-System. Die App hat drei voreingestellte Konten (Admin, Alex, Gast). Jedes Konto teilt sich jedoch denselben Browser-Speicher. Für vollständig getrennte Daten empfiehlt sich ein anderes Browser-Profil.',
      },
      {
        id: 'faq-achievements-vs-unlockables',
        question: 'Was ist der Unterschied zwischen Achievements und Freischaltungen?',
        answer: 'Achievements sind permanente Trophäen, die du für Meilensteine erhältst (z.B. "Week One" für 7 Tage Streak). Sie haben keine funktionale Auswirkung, dokumentieren aber deine Geschichte. Freischaltungen (Unlockables) sind echte Features oder kosmetische Extras, die du durch Level-Aufstiege freischaltest (z.B. Dark Mode ab Level 2).',
      },
      {
        id: 'faq-no-intervention',
        question: 'Wieso sehe ich keine Empfehlung in der Sidebar?',
        answer: 'Eine Micro-Intervention erscheint nur, wenn deine letzte Check-in-Stimmung ≤ 3 war UND du die heutige Intervention noch nicht abgeschlossen hast. Bei einer Stimmung von 4 oder 5 gibt es keine Intervention — das ist ein positives Zeichen! Die Intervention verschwindet auch, nachdem du auf "Erledigt" geklickt hast.',
      },
      {
        id: 'faq-reset',
        question: 'Wie setze ich meinen Fortschritt zurück?',
        answer: 'Öffne die Browser-Entwicklertools (F12 → Anwendung → localStorage) und lösche die Schlüssel "dailyecho_profile", "dailyecho_entries", "dailyecho_achievements" und "dailyecho_quickwins". Nach einem Neuladen der Seite startet das Onboarding von vorne. Alternativ: Browserdaten löschen.',
      },
      {
        id: 'faq-loop-closed',
        question: 'Was bedeutet "Loop geschlossen"?',
        answer: 'Loop geschlossen bedeutet, dass du am Morgen eine Intention gesetzt UND am Abend ausgewertet hast, wie die Umsetzung lief. Du erhältst +20 XP für jeden geschlossenen Loop. Das Achievement "Loop Closed" wird nach 5 geschlossenen Loops freigeschaltet.',
      },
      {
        id: 'faq-xp-bar',
        question: 'Wo sehe ich meinen XP-Fortschritt?',
        answer: 'Dein XP-Fortschritt ist an mehreren Stellen sichtbar: (1) Dashboard-Kachel "Dein Fortschritt" — zeigt Level, aktuelle XP und den Balken zum nächsten Level. (2) SideNav — unter dem Avatar befindet sich ein farbiger XP-Balken. (3) Erfolge-Seite, Tab "Freischaltungen" — zeigt das gesamte Level-System.',
      },
      {
        id: 'faq-values-change',
        question: 'Kann ich meine Werte nachträglich ändern?',
        answer: 'Ja. Gehe zu Profil → Bearbeiten und passe deine Werte an. Beachte, dass der Werte-Antwort-Zähler (wie oft du über einen Wert reflektiert hast) bestehen bleibt. Bei komplett anderen Werten verliert der Zähler seine Aussagekraft.',
      },
      {
        id: 'faq-notifications-not-working',
        question: 'Meine Erinnerungen kommen nicht an — was tun?',
        answer: 'Prüfe folgendes: (1) Browser-Tab muss geöffnet sein — DailyEcho nutzt keine Push-Benachrichtigungen. (2) Benachrichtigungen müssen im Browser erlaubt sein (Schloss-Symbol links in der Adressleiste). (3) In Profil → Erinnerungen prüfen, ob der Haupt-Toggle aktiv ist. (4) Sende eine Test-Benachrichtigung um die Verbindung zu prüfen.',
      },
      {
        id: 'faq-dark-mode',
        question: 'Wie aktiviere ich den Dark Mode?',
        answer: 'Der Dark Mode ist ab Level 2 freigeschaltet (ab 100 XP). Mit dem Toggle oben rechts in der TopHeader-Leiste (Sonne/Mond-Symbol) wechselst du zwischen Hell- und Dunkel-Design. Falls der Toggle nicht erscheint, schau unter Erfolge → Freischaltungen, ob Dark Mode freigeschaltet ist.',
      },
      {
        id: 'faq-streak-freeze',
        question: 'Wie funktioniert der Streak-Freeze genau?',
        answer: 'Du hast einmal pro Woche (Montag bis Sonntag) die Möglichkeit, einen verpassten Tag zu "überbrücken", ohne deinen Streak zu verlieren. Der Freeze wird automatisch genutzt, wenn du nach einem Pausentag wieder eincheckst. Du siehst in der SideNav, ob dein Freeze bereits verbraucht wurde.',
      },
      {
        id: 'faq-lofi-audio',
        question: 'Der Lo-Fi Stream hört nicht auf, obwohl ich ihn geschlossen habe — was tun?',
        answer: 'Das wurde behoben. Die Karte wird beim Schließen vollständig aus dem DOM entfernt, sodass der YouTube-Stream stoppt. Falls du ältere Daten im Cache hast, lade die Seite neu (Strg+F5).',
      },
      {
        id: 'faq-quickwin-delete',
        question: 'Kann ich Quick Wins löschen?',
        answer: 'Ja, aber nur Quick Wins der aktuellen Woche. Im Bereich "Quick Wins" auf der Verlauf-Seite (oder im Rhythmus-Abschnitt des Dashboards) fährt man mit der Maus über einen Eintrag — dann erscheint das Papierkorb-Symbol rechts. Ältere Quick Wins aus vergangenen Wochen können nicht gelöscht werden.',
      },
      {
        id: 'faq-admin-pin',
        question: 'Ich habe meinen PIN vergessen — was nun?',
        answer: 'Falls du den Standard-PIN (1234) geändert hast und ihn vergessen hast: Gehe als Admin in das Admin-Panel → Konten verwalten → Bearbeiten → neuen PIN eintragen. Falls du keinen Admin-Zugang mehr hast, kannst du über die Browser-Entwicklertools (F12 → Anwendung → localStorage → dailyecho_admin_overrides) die Overrides löschen und den Standard-PIN 1234 wieder nutzen.',
      },
    ],
  },
];

// ─── Helper: strip markdown for plain-text search ────────────────────────────

function stripMarkdown(text: string): string {
  return text.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/#+\s/g, '').replace(/\|.+\|/g, '');
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-700/60 rounded-sm px-0.5">{part}</mark> : part
  );
}

// ─── Components ───────────────────────────────────────────────────────────────

function ContentRenderer({ content, query }: { content: string; query: string }) {
  const lines = content.split('\n');
  return (
    <div className="flex flex-col gap-2 text-sm text-foreground/80 leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        // Table row
        if (line.startsWith('|')) {
          return null; // handled by table block below
        }
        // Bold heading-style line
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={i} className="font-semibold text-foreground mt-3 first:mt-0">{highlight(line.replace(/\*\*/g, ''), query)}</p>;
        }
        // Bullet
        if (line.startsWith('- ')) {
          return <p key={i} className="pl-4 before:content-['·'] before:mr-2 before:text-muted-foreground">{highlight(line.slice(2).replace(/\*\*(.+?)\*\*/g, ''), query)}</p>;
        }
        // Numbered list
        if (/^\d+\.\s/.test(line)) {
          return <p key={i} className="pl-4">{highlight(line.replace(/\*\*(.+?)\*\*/g, ''), query)}</p>;
        }
        return <p key={i}>{highlight(line.replace(/\*\*(.+?)\*\*/g, ''), query)}</p>;
      })}
      {/* Render tables */}
      {renderTables(content, query)}
    </div>
  );
}

function renderTables(content: string, query: string) {
  const tableBlocks: React.ReactNode[] = [];
  const lines = content.split('\n');
  let tableLines: string[] = [];
  let inTable = false;

  lines.forEach((line, i) => {
    if (line.startsWith('|')) {
      inTable = true;
      tableLines.push(line);
    } else if (inTable) {
      inTable = false;
      tableBlocks.push(renderTable(tableLines, query, i));
      tableLines = [];
    }
  });
  if (tableLines.length > 0) tableBlocks.push(renderTable(tableLines, query, 999));
  return tableBlocks;
}

function renderTable(lines: string[], query: string, key: number) {
  const rows = lines.filter(l => !l.match(/^\|[-|:\s]+\|$/));
  if (rows.length < 2) return null;
  const parseRow = (row: string) => row.split('|').filter(c => c.trim()).map(c => c.trim());
  const headers = parseRow(rows[0]);
  const data = rows.slice(1);
  return (
    <div key={key} className="overflow-x-auto -mx-1 mt-3 mb-1">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-border">
            {headers.map((h, i) => (
              <th key={i} className="text-left py-1.5 px-2 font-semibold text-muted-foreground">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
            <tr key={ri} className="border-b border-border/50 hover:bg-muted/30">
              {parseRow(row).map((cell, ci) => (
                <td key={ci} className="py-1.5 px-2">{highlight(cell, query)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HelpPage() {
  const [query, setQuery] = useState('');
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['ueberblick']));
  const searchRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();

  const filteredSections = useMemo(() => {
    if (!q) return HELP_SECTIONS;
    return HELP_SECTIONS.filter((s) => {
      const searchText = [
        s.title,
        s.summary,
        stripMarkdown(s.content),
        ...(s.entries ?? []).map(e => `${e.question ?? ''} ${e.answer}`),
      ].join(' ').toLowerCase();
      return searchText.includes(q);
    });
  }, [q]);

  const totalHits = filteredSections.length;

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handlePrint = () => {
    // Open all sections before printing
    setOpenSections(new Set(HELP_SECTIONS.map(s => s.id)));
    setTimeout(() => window.print(), 300);
  };

  const clearSearch = () => {
    setQuery('');
    searchRef.current?.focus();
  };

  // When searching, open all matching sections
  useMemo(() => {
    if (q) {
      setOpenSections(new Set(filteredSections.map(s => s.id)));
    }
  }, [q, filteredSections]);

  return (
    <>
      {/* Print-only header */}
      <div className="hidden print:block print:mb-8">
        <h1 className="text-3xl font-bold">DailyEcho — Produkthandbuch</h1>
        <p className="text-sm text-gray-500 mt-1">Stand: März 2026 · Alle Rechte vorbehalten</p>
        <hr className="mt-4" />
      </div>

      <div className="w-full max-w-6xl mx-auto print:max-w-none">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 no-print">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold leading-none">Produkthandbuch</h1>
              <p className="text-xs text-muted-foreground mt-0.5">15 Kapitel · Volltext-Suche · PDF-Export</p>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-accent shadow-sm text-sm font-medium transition-colors no-print"
          >
            <Printer className="w-4 h-4" />
            Als PDF exportieren
          </button>
        </div>

        {/* ── Search ── */}
        <div className="relative mb-6 no-print">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && clearSearch()}
            placeholder="Handbuch durchsuchen… (z.B. XP, Streak, Quick Win, PIN)"
            className="w-full bg-card border rounded-2xl pl-11 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
          {query && (
            <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
          {q && (
            <p className="text-xs text-muted-foreground mt-2 pl-1">
              {totalHits === 0 ? (
                <>Keine Ergebnisse für <strong>"{query}"</strong>. Versuche ein anderes Stichwort.</>
              ) : (
                <><strong>{totalHits}</strong> {totalHits === 1 ? 'Kapitel' : 'Kapitel'} für <strong>"{query}"</strong></>
              )}
            </p>
          )}
        </div>

        {/* ── Sections ── */}
        <div className="flex flex-col gap-3">
          {filteredSections.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-medium">Kein Eintrag gefunden für "{query}"</p>
              <p className="text-sm mt-1">Versuche Begriffe wie: XP, Streak, Check-in, PIN, Profil</p>
              <button onClick={clearSearch} className="mt-4 text-sm text-primary underline underline-offset-2">Suche zurücksetzen</button>
            </div>
          )}

          {filteredSections.map((section) => {
            const isOpen = openSections.has(section.id);
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                id={section.id}
                className="bg-card rounded-[2rem] border border-border/40 shadow-sm overflow-hidden print:!block print:rounded-none print:border-0 print:shadow-none print:mb-6"
              >
                {/* Section header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-accent/30 transition-colors text-left no-print"
                >
                  <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                    <Icon className={cn('w-4 h-4', section.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground font-mono">Kap. {section.chapter.toString().padStart(2, '0')}</span>
                      <span className="font-semibold text-sm">{highlight(section.title, q)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{highlight(section.summary, q)}</p>
                  </div>
                  <ChevronDown className={cn('w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200', isOpen && 'rotate-180')} />
                </button>

                {/* Print-only header (always shown) */}
                <div className="hidden print:block px-6 pt-4 pb-2 border-b">
                  <h2 className="text-lg font-bold">{section.chapter}. {section.title}</h2>
                  <p className="text-sm text-gray-500">{section.summary}</p>
                </div>

                {/* Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden print:!block print:!h-auto print:!opacity-100"
                    >
                      <div className="px-6 pb-6 pt-2 border-t border-border/40">
                        {section.content && <ContentRenderer content={section.content} query={q} />}

                        {/* FAQ entries */}
                        {section.entries && (
                          <div className="flex flex-col gap-3 mt-2">
                            {section.entries
                              .filter(entry => {
                                if (!q) return true;
                                return `${entry.question ?? ''} ${entry.answer}`.toLowerCase().includes(q);
                              })
                              .map((entry) => (
                                <div key={entry.id} className="bg-muted/40 rounded-2xl px-4 py-3">
                                  {entry.question && (
                                    <p className="font-semibold text-sm mb-1.5">{highlight(entry.question, q)}</p>
                                  )}
                                  <p className="text-sm text-foreground/80 leading-relaxed">{highlight(entry.answer, q)}</p>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* ── Footer ── */}
        {!q && (
          <p className="text-center text-xs text-muted-foreground mt-10 pb-4 no-print">
            DailyEcho Produkthandbuch · Stand März 2026 · 15 Kapitel
          </p>
        )}
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          nav, aside, header, .sidenav, [class*="AppNavBar"], [class*="TopHeader"], [class*="SideNav"] { display: none !important; }
          main { padding: 0 !important; margin: 0 !important; }
          body { background: white !important; color: black !important; font-size: 11pt; }
          .print\\:block { display: block !important; }
          .print\\:mb-6 { margin-bottom: 1.5rem !important; }
          [id] { page-break-inside: avoid; }
          h1, h2 { page-break-after: avoid; }
          .print\\:rounded-none { border-radius: 0 !important; }
          .print\\:border-0 { border: none !important; border-bottom: 1px solid #e5e7eb !important; }
          .print\\:shadow-none { box-shadow: none !important; }
        }
      `}</style>
    </>
  );
}
