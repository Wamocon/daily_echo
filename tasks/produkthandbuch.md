# Produkthandbuch — Anforderungsdokument
## DailyEcho v1.0 | Technische Dokumentation

**Erstellt:** März 2026  
**Status:** Freigegeben zur Umsetzung  
**Verantwortlich:** Technischer Dokumentator  

---

## 1. Überblick & Zielsetzung

Das Produkthandbuch dient als vollständige Referenz für Endnutzer der DailyEcho-App. Es soll als interaktive In-App-Hilfeseite zugänglich sein und zusätzlich als strukturiertes PDF exportiert werden können.

### 1.1 Zielgruppen

| Gruppe | Bedarf |
|--------|--------|
| **Neue Nutzer** | Schnelleinstieg, Konzepte verstehen, erste Schritte |
| **Fortgeschrittene Nutzer** | XP-System, Achievement-Mechaniken, Level-Freischaltungen |
| **Administrator** | Konten verwalten, Berechtigungen, Demo-Modus |

### 1.2 Qualitätsziele

- **Vollständigkeit**: Alle Features, jede Seite, alle Mechaniken beschrieben
- **Auffindbarkeit**: Volltextsuche über alle Abschnitte und Fragen
- **Zugänglichkeit**: Klare Sprache, keine technischen Fachbegriffe ohne Erklärung
- **Exportierbarkeit**: Druckoptimiertes Layout für PDF-Export via Browser

---

## 2. Struktur des Handbuchs (Inhaltsverzeichnis)

Das Handbuch gliedert sich in folgende Kapitel — jedes Kapitel entspricht einer eigenen Sektion auf der Hilfeseite:

```
1.  Überblick
2.  Erste Schritte (Onboarding)
3.  Das Dashboard
4.  Den Check-in durchführen
5.  Quick Wins
6.  Verlauf & Rückblick
7.  Streak-System
8.  XP & Level-System
9.  Erfolge (Achievements)
10. Micro-Interventionen
11. Werte-Kompass
12. Erinnerungen & Benachrichtigungen
13. Profil & Einstellungen
14. Admin-Panel
15. Häufige Fragen (FAQ)
```

---

## 3. Anforderungen an die Hilfeseite (Route: `/help`)

### 3.1 Suchfunktion

| Anforderung | Priorität | Detail |
|-------------|-----------|--------|
| **Client-seitige Volltextsuche** | MUSS | Durchsucht Titel, Abschnittsinhalte, FAQ-Fragen und -Antworten |
| **Echtzeit-Filterung** | MUSS | Ergebnisse werden beim Tippen sofort aktualisiert (kein Submit) |
| **Keyword-Highlighting** | SOLL | Gefundener Suchbegriff wird im Ergebnis hervorgehoben |
| **Anzahl Treffer anzeigen** | SOLL | "3 Ergebnisse für 'XP'" |
| **Leerzustand** | MUSS | Bei keinen Treffern: freundliche Meldung + Vorschläge |
| **Suche zurücksetzen** | MUSS | ×-Button oder Escape leert das Suchfeld |

### 3.2 Navigation & Struktur

| Anforderung | Priorität | Detail |
|-------------|-----------|--------|
| **Seitenleiste mit Sprungmarken** | SOLL | Auf Desktop scrollbar zu jedem Kapitel-Anker |
| **Accordion-Sektionen** | MUSS | Jedes Kapitel ausklappbar, Standard: erstes Kapitel offen |
| **Deep-Link-Anker** | SOLL | `#kapitel-3` o.ä. — direktes Verlinken möglich |
| **Mobile-First** | MUSS | Akkordeon-Darstellung auf Mobile, kein zweigeteiltes Layout |
| **Aktives Kapitel hervorheben** | KANN | Sidebar-Eintrag bei Kapitel im Viewport markiert |

### 3.3 Inhaltliche Anforderungen pro Kapitel

#### Kapitel 1 — Überblick
- Was ist DailyEcho? (Kern-Nutzenversprechen)
- Wie funktioniert die App in einem Satz?
- Welche Daten werden wo gespeichert (localStorage, kein Konto erforderlich)?

#### Kapitel 2 — Erste Schritte
- Schritt-für-Schritt: Anmelden / Konto wählen
- Onboarding-Assistent erklären (7 Schritte: Name → Alter → Beruf → Ziel → Quick-Win-Ziel → Werte → Fertig)
- PIN-System erklären

#### Kapitel 3 — Das Dashboard
- Layout-Übersicht: alle Kacheln erklären (CTA, Fortschritt, Rhythmus, Kalender, Stimmungstrend)
- Rechte Sidebar: Pomodoro, Atemübung, Lo-Fi
- Schnellaktion-Kachel: Bewege den Nutzer zum Check-in

#### Kapitel 4 — Den Check-in durchführen
- Morgen-Check-in: Ablauf, alle Fragen aufführen (Pflicht + optional)
- Abend-Check-in: Ablauf, alle Fragen aufführen
- Intentions-Loop: Morgen-Intention setzen → Abends auswerten
- Stimmungsauswahl 1–5 erklären
- Was passiert nach dem Check-in? (XP, Streak, Achievements)

**Alle 3 Pflichtfragen Morgen:**
1. Was ist deine Intention für heute?
2. Was ist das Erste, worauf du dich heute freust?
3. Was könnte heute herausfordernd werden — und wie gehst du damit um?

**Alle 3 Pflichtfragen Abend:**
1. Was war heute dein schönster Moment?
2. Was hat dich heute belastet oder Energie gekostet?
3. Was nimmst du dir aus dem heutigen Tag mit?

#### Kapitel 5 — Quick Wins
- Was ist ein Quick Win?
- Wie wird er erfasst (Dashboard-Kachel "Rhythmus" + Verlauf-Seite)?
- Wochenziel einstellen (1–5 pro Woche)
- Wochennavigation im Verlauf

#### Kapitel 6 — Verlauf & Rückblick
- Eintragsarchiv erklären
- "Heute vor einem Jahr"-Feature
- Quick Win Wochenarchiv
- Stimmungstrend-Chart (14 Tage)

#### Kapitel 7 — Streak-System
- Was zählt als Streak? (Mind. ein Check-in pro Kalendertag)
- Freeze-Mechanik (1× pro Woche: ein Tag Ausfall wird überbrückt)
- Meilensteine: 7 / 14 / 30 / 100 Tage (+100 XP Bonus)
- Wie sieht man den Streak? (Dashboard-Kalender)

#### Kapitel 8 — XP & Level-System
- Vollständige XP-Tabelle aufführen (alle Aktionen + Minuspunkte)
- Level-Tabelle mit Titeln und XP-Schwellen (Level 1–10)
- Was schaltet jedes Level frei? (Unlockables-Tabelle)
- XP-Balken auf dem Dashboard

#### Kapitel 9 — Erfolge (Achievements)
- Liste aller 10 Achievements mit Freischaltbedingungen
- Unterschied Achievements vs. Freischaltungen (Unlockables)
- Fortschrittsbalken bei ungesperrten Achievements erklären

#### Kapitel 10 — Micro-Interventionen
- Was ist eine Micro-Intervention?
- Wann erscheint die Empfehlung? (Stimmung < 4 nach Check-in)
- Notiz-Feld: Warum ist schreiben wichtig?
- +5 XP für abgeschlossene Intervention

#### Kapitel 11 — Werte-Kompass
- Was sind persönliche Werte?
- Auswahl beim Onboarding (1–3 Werte aus 10)
- Wie beeinflussen Werte die Check-in-Fragen?
- Value-Counter im Profil anzeigen/erklären

#### Kapitel 12 — Erinnerungen
- Browser-Benachrichtigungen aktivieren
- Zeitplan konfigurieren (Morgen / Abend)
- Freitags-Quick-Win-Erinnerung
- Hinweis: Tab muss geöffnet sein (keine Push-Notifications)

#### Kapitel 13 — Profil & Einstellungen
- Profil bearbeiten (Name, Alter, Beruf, Ziel, Wochenziel)
- Werte im Profil ansehen
- Abmelden
- Notification-Einstellungen (innerhalb Profil)

#### Kapitel 14 — Admin-Panel
- Zugang (nur für Admin-Rolle)
- App-Statistiken lesen
- Demo-Konten bearbeiten (Name, PIN, Tagline, Rolle)
- "Als Nutzer einloggen"-Funktion

#### Kapitel 15 — FAQ
Mindestens 15 häufige Fragen, u.a.:
- Werden meine Daten in der Cloud gespeichert?
- Was passiert, wenn ich einen Tag verpasse?
- Kann ich mehrere Nutzer-Profile haben?
- Was ist der Unterschied zwischen Achievements und Freischaltungen?
- Wieso sehe ich keine Empfehlungen?
- Wie setze ich meinen Fortschritt zurück?
- Was bedeutet "Loop geschlossen"?

---

## 4. Anforderungen an den PDF-Export

| Anforderung | Priorität | Detail |
|-------------|-----------|--------|
| **Export-Button sichtbar** | MUSS | "PDF exportieren"-Button prominent oben auf der Seite |
| **Browser-nativer Druck** | MUSS | `window.print()` mit `@media print`-Stylesheet |
| **Navigation ausblenden** | MUSS | SideNav, AppNavBar, TopHeader, Suchfeld beim Drucken unsichtbar |
| **Alle Sektionen geöffnet** | MUSS | Beim Drucken alle Akkordeons aufgeklappt |
| **Seitenumbrüche** | SOLL | `page-break-before: always` vor Hauptkapiteln |
| **Typografie** | SOLL | Druckschrift, schwarzer Text, weißer Hintergrund |
| **Kopfzeile** | SOLL | "DailyEcho Produkthandbuch — Stand: März 2026" als Print-Header |
| **Dateiname-Tipp** | KANN | Toast-Hinweis: Browser-Druckdialog → "Als PDF speichern" wählen |

---

## 5. Technische Umsetzungshinweise

### 5.1 Implementierung
- **Route**: `src/app/(app)/help/page.tsx` — im App-Layout (mit SideNav)
- **Suche**: Statisches `HELP_SECTIONS` Array mit `id`, `title`, `content` (Strings) — `useMemo` + `.filter` + `.toLowerCase`-Matching
- **Akkordeon**: Native `AnimatePresence` + `motion.div` (Framer Motion, bereits vorhanden)
- **Anker**: `id={section.id}` auf jedem Wrapper-`div`, Sidebar mit `<a href={#id}>`

### 5.2 Datenlage  
- Keine API-Calls nötig — vollständig statischer Inhalt
- Keine lokalisierten Strings nötig (Sprache: Deutsch)

### 5.3 Navigationseintrag
- SideNav `Einstellungen`-Gruppe: neuer Eintrag "Hilfe" mit `HelpCircle`-Icon
- Optional: `?`-Floater-Button in TopHeader

### 5.4 Print-CSS-Strategie
```css
@media print {
  nav, .sidenav, .appnav, .search-bar, .no-print { display: none !important; }
  .accordion-content { display: block !important; height: auto !important; }
  .help-section { page-break-before: auto; }
  .help-chapter { page-break-before: always; }
  body { background: white; color: black; }
}
```

---

## 6. Qualitätskriterien & Abnahme

| Kriterium | Messbar? | Zielwert |
|-----------|----------|----------|
| Vollständigkeit | Ja | Alle 15 Kapitel vorhanden, alle XP-Werte korrekt |
| Suchqualität | Ja | Suche "XP" findet mind. 3 Treffer |
| PDF-Export | Ja | Druck erzeugt vollständiges, lesbares Dokument |
| Mobile-Tauglichkeit | Ja | Kein horizontaler Scroll auf 375px Breite |
| Build-Stabilität | Ja | `npm run build` fehlerfrei |

---

## 7. Nicht im Scope

- Mehrsprachigkeit (nur Deutsch)
- Servergerenderte Inhalte oder CMS-Anbindung
- Automatische Versionierung des Handbuchs
- Video-Tutorials oder Screenshot-Einbettung
- Feedback-Formular je Abschnitt

---

*Anforderungsdokument fertiggestellt. Umsetzung beginnt unmittelbar nach Freigabe.*
