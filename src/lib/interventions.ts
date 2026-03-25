import { Mood, CheckinContext } from '@/types';

export interface InterventionCard {
  id: string;
  emoji: string;
  title: string;
  description: string;
  duration: string; // e.g. "2 Min"
}

// ─── Matrix: mood (1-5) × context × timeOfDay ────────────────────────────────

type TimeOfDay = 'morning' | 'midday' | 'evening';

function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 17) return 'evening';
  return 'midday';
}

const MATRIX: Record<number, Record<CheckinContext, InterventionCard[]>> = {
  // ── Mood 1 ──────────────────────────────────────────────────────────────────
  1: {
    morning: [
      {
        id: 'm1_breath',
        emoji: '🫁',
        title: 'Box Breathing',
        description: '4 Sekunden einatmen — 4 halten — 4 ausatmen — 4 halten. Wiederhole 5 Mal. Dein Nervensystem dankt es dir.',
        duration: '2 Min',
      },
      {
        id: 'm1_control',
        emoji: '✏️',
        title: 'Eine Sache, die du kontrollieren kannst',
        description: 'Schreib eine einzige konkrete Sache auf, die du heute in der Hand hast. Nur eine.',
        duration: '1 Min',
      },
    ],
    evening: [
      {
        id: 'e1_screen',
        emoji: '📵',
        title: 'Bildschirmfreie Stunde',
        description: 'Heute Abend: kein Handy, kein TV für 1 Stunde. Drei Dinge, für die du dankbar bist, aufschreiben.',
        duration: '5 Min',
      },
      {
        id: 'e1_body',
        emoji: '🛁',
        title: 'Körper beruhigen',
        description: 'Warme Dusche oder ein Bad. Achte auf das Gefühl des warmen Wassers — das ist kein Luxus, das ist Therapie.',
        duration: '10 Min',
      },
    ],
  },

  // ── Mood 2 ──────────────────────────────────────────────────────────────────
  2: {
    morning: [
      {
        id: 'm2_micro',
        emoji: '🎯',
        title: 'Micro-Win setzen',
        description: 'Einen winzigen Erfolg für heute planen, der dir sicher gelingt. Selbst das Bett machen zählt.',
        duration: '1 Min',
      },
      {
        id: 'm2_move',
        emoji: '🚶',
        title: '5 Minuten Bewegung',
        description: 'Geh jetzt kurz nach draußen oder schüttle dich 60 Sekunden lang. Bewegung hebt die Stimmung zuverlässig.',
        duration: '5 Min',
      },
    ],
    evening: [
      {
        id: 'e2_grateful',
        emoji: '🙏',
        title: '3 konkrete Momente',
        description: 'Nicht allgemein — nenn drei ganz spezifische Momente von heute, auch kleine. "Der erste Kaffee" zählt.',
        duration: '3 Min',
      },
      {
        id: 'e2_tomorrow',
        emoji: '🌅',
        title: 'Morgen vorbereiten',
        description: 'Legs schon jetzt eine Sache bereit für morgen — Kleidung, Schlüssel, Aufgabe. Reduziert Morgenstress.',
        duration: '2 Min',
      },
    ],
  },

  // ── Mood 3 ──────────────────────────────────────────────────────────────────
  3: {
    morning: [
      {
        id: 'm3_peak',
        emoji: '⭐',
        title: 'Bester Moment des Tages?',
        description: 'Was wäre ein richtig guter Moment heute? Schreib ihn auf — und erhöhe die Chance, dass er passiert.',
        duration: '2 Min',
      },
      {
        id: 'm3_energy',
        emoji: '⚡',
        title: 'Energielevels optimieren',
        description: 'Trink jetzt ein großes Glas Wasser und iss in den nächsten 30 Min etwas Proteinreiches. Dein Gehirn läuft dann besser.',
        duration: '1 Min',
      },
    ],
    evening: [
      {
        id: 'e3_share',
        emoji: '💬',
        title: 'Mit jemandem reden',
        description: 'Schreib einer Person, die du magst, eine kurze Nachricht. Verbindung zu anderen hebt die Stimmung.',
        duration: '3 Min',
      },
      {
        id: 'e3_review',
        emoji: '📋',
        title: 'Kurze Tagesauswertung',
        description: 'Was lief gut? Was würdest du morgen anders machen? Zwei Sätze reichen.',
        duration: '3 Min',
      },
    ],
  },

  // ── Mood 4 ──────────────────────────────────────────────────────────────────
  4: {
    morning: [
      {
        id: 'm4_plan',
        emoji: '📝',
        title: 'Big 3 des Tages',
        description: 'Nenn die drei wichtigsten Aufgaben für heute — und priorisiere sie. Was muss als erstes passieren?',
        duration: '3 Min',
      },
      {
        id: 'm4_stretch',
        emoji: '🧘',
        title: '5 Minuten Dehnen',
        description: 'Starte mit einem kurzen Stretch: Schultern, Nacken, Hüfte. Guter Start für Körper und Geist.',
        duration: '5 Min',
      },
    ],
    evening: [
      {
        id: 'e4_learn',
        emoji: '📖',
        title: 'Etwas aufschreiben, das du gelernt hast',
        description: 'Was weißt du heute Abend, was du gestern noch nicht wusstest? Egal wie klein.',
        duration: '2 Min',
      },
      {
        id: 'e4_progress',
        emoji: '📈',
        title: 'Fortschritt würdigen',
        description: 'Nenn eine Sache, die du diese Woche vorangebracht hast. Fortschritt fühlt sich oft kleiner an, als er ist.',
        duration: '2 Min',
      },
    ],
  },

  // ── Mood 5 ──────────────────────────────────────────────────────────────────
  5: {
    morning: [
      {
        id: 'm5_document',
        emoji: '📸',
        title: 'Diesen Zustand festhalten',
        description: 'Schreib kurz auf: Was hat dich heute Morgen in diesen positiven Zustand gebracht? Das Wissen ist wertvoll fürs nächste Tief.',
        duration: '2 Min',
      },
      {
        id: 'm5_amplify',
        emoji: '🔥',
        title: 'Energie nutzen',
        description: 'Du bist in Flow — nutze es! Welche eine große Sache kannst du heute anpacken, die du sonst aufschiebst?',
        duration: '1 Min',
      },
    ],
    evening: [
      {
        id: 'e5_spread',
        emoji: '📞',
        title: 'Jemanden anrufen',
        description: 'Ruf eine Person an, die gerade eine schwere Zeit hat. Gute Energie verteilen — das ist das Beste, was du tun kannst.',
        duration: '10 Min',
      },
      {
        id: 'e5_plan',
        emoji: '🗓️',
        title: 'Morgen noch besser machen',
        description: 'Was war das Beste heute? Wie kannst du morgen früh direkt daran anknüpfen?',
        duration: '2 Min',
      },
    ],
  },
};

/** Pick one intervention card based on mood, context, and current hour. */
export function getIntervention(
  mood: Mood,
  context: CheckinContext,
  hour = new Date().getHours(),
): InterventionCard {
  const moodCards = MATRIX[mood]?.[context] ?? MATRIX[3].morning;
  // Use time-of-day to alternate between options deterministically
  const tod = getTimeOfDay(hour);
  const idx = tod === 'morning' || tod === 'midday' ? 0 : 1;
  // Pick second option in evenings, first otherwise
  return moodCards[idx % moodCards.length];
}
