import { CheckinContext, Mood, MoodSuggestion } from '@/types';

type SuggestionMap = Record<Mood, Record<CheckinContext, MoodSuggestion[]>>;

export const MOOD_SUGGESTIONS: SuggestionMap = {
  1: {
    morning: [
      { title: 'Box Breathing', description: '5 Minuten: 4 Sekunden einatmen, 4 halten, 4 ausatmen, 4 halten.' },
      { title: 'Ein kontrollierbares Ziel', description: 'Schreib 1 Sache auf, die du heute beeinflussen kannst.' },
      { title: 'Kurze Auszeit einplanen', description: 'Plant bewusst eine 10-minütige Pause in deinen Tag ein.' },
    ],
    evening: [
      { title: 'Kein Bildschirm', description: 'Leg alle Geräte 30 Minuten vor dem Schlafen weg.' },
      { title: 'Dankbarkeitsliste', description: 'Schreib 3 kleine Dinge auf, für die du heute dankbar bist.' },
      { title: 'Atemübung', description: '4-7-8 Methode: 4s einatmen, 7s halten, 8s ausatmen.' },
    ],
  },
  2: {
    morning: [
      { title: 'Kurzer Spaziergang', description: '10 Minuten frische Luft können die Stimmung merklich heben.' },
      { title: '1 erreichbares Tagesziel', description: 'Setze dir ein einziges, klar definierbares Ziel für heute.' },
      { title: 'Lieblingssong hören', description: 'Starte mit einem Song, der dich aufmuntert.' },
    ],
    evening: [
      { title: 'Energievampire reflektieren', description: 'Was hat heute am meisten Energie gekostet?' },
      { title: 'Ruhige Musik', description: 'Entspannungsmusik hilft beim Runterkommen.' },
      { title: 'Morgen ohne Druck schreiben', description: 'Schreib einfach drauflos — kein Ziel, kein Anspruch.' },
    ],
  },
  3: {
    morning: [
      { title: 'Bester Moment?', description: 'Was soll heute dein bester Moment sein?' },
      { title: 'Wasser trinken', description: 'Ein großes Glas Wasser jetzt gibt Energie für den Start.' },
      { title: '5 Minuten Stretching', description: 'Kurzes Dehnen aktiviert Körper und Geist.' },
    ],
    evening: [
      { title: 'Überraschend Gutes', description: 'Was war heute überraschend besser als erwartet?' },
      { title: 'Morgen vorbereiten', description: '5 Minuten Vorbereitung für morgen reduzieren Stress.' },
    ],
  },
  4: {
    morning: [
      { title: 'Energie einsetzen', description: 'Du bist in der Flow-Zone. Was willst du heute wirklich anpacken?' },
      { title: 'Jemanden motivieren', description: 'Teile deine positive Energie — wem kannst du heute helfen?' },
    ],
    evening: [
      { title: 'Energie weitergeben', description: 'Wem kannst du heute Abend noch danken oder schreiben?' },
      { title: 'Quick Win dokumentieren', description: 'Du hast heute etwas Wichtiges geleistet — halte es fest!' },
    ],
  },
  5: {
    morning: [
      { title: 'Dokumentiere deinen Zustand', description: 'Was hat dich in diese gute Stimmung gebracht? Halte es fest!' },
      { title: 'Große Aufgabe angehen', description: 'Nutze diesen Energie-Peak für eine Aufgabe, die sonst wartet.' },
    ],
    evening: [
      { title: 'Feiere deinen Quick Win', description: 'Das ist ein perfekter Tag für einen Quick Win Eintrag!' },
      { title: 'Teile deine Energie', description: 'Ruf jemanden an oder schreib eine nette Nachricht.' },
    ],
  },
};

export function getSuggestions(mood: Mood, context: CheckinContext): MoodSuggestion[] {
  return MOOD_SUGGESTIONS[mood][context];
}
