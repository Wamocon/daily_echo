import { CheckinContext } from '@/types';
import type { UserValue } from '@/types';

export interface Question {
  id: string;
  text: string;
  context: CheckinContext | 'both';
  category: 'focus' | 'reflection' | 'growth';
  value?: UserValue; // Sprint 5: links this question to a value
}

export const MORNING_CORE: Question[] = [
  { id: 'm1', text: 'Was ist deine Intention für heute?', context: 'morning', category: 'focus' },
  { id: 'm2', text: 'Was ist das Erste, worauf du dich heute freust?', context: 'morning', category: 'focus' },
  { id: 'm3', text: 'Was könnte heute herausfordernd werden – und wie gehst du damit um?', context: 'morning', category: 'growth' },
];

export const EVENING_CORE: Question[] = [
  { id: 'e1', text: 'Was war heute dein schönster Moment?', context: 'evening', category: 'reflection' },
  { id: 'e2', text: 'Was hat dich heute belastet oder Energie gekostet?', context: 'evening', category: 'reflection' },
  { id: 'e3', text: 'Was nimmst du dir aus dem heutigen Tag mit?', context: 'evening', category: 'growth' },
];

export const MORNING_OPTIONAL: Question[] = [
  { id: 'mo1', text: 'Wem möchtest du heute eine positive Nachricht schicken?', context: 'morning', category: 'growth' },
  { id: 'mo2', text: 'Welche Aufgabe hast du zuletzt aufgeschoben – kannst du sie heute angehen?', context: 'morning', category: 'focus' },
  { id: 'mo3', text: 'Was würde diesen Tag zu einem außergewöhnlichen Tag machen?', context: 'morning', category: 'focus' },
  { id: 'mo4', text: 'Wie hoch ist dein Energielevel gerade – und was beeinflusst es?', context: 'morning', category: 'reflection' },
  { id: 'mo5', text: 'Was ist deine wichtigste Priorität für heute?', context: 'morning', category: 'focus' },
  { id: 'mo6', text: 'Was willst du heute Abend auf dich stolz sein lassen?', context: 'morning', category: 'growth' },
];

export const EVENING_OPTIONAL: Question[] = [
  { id: 'eo1', text: 'Was habe ich heute über mich gelernt?', context: 'evening', category: 'growth' },
  { id: 'eo2', text: 'Wofür bin ich heute dankbar?', context: 'evening', category: 'reflection' },
  { id: 'eo3', text: 'Was würde ich heute anders machen?', context: 'evening', category: 'reflection' },
  { id: 'eo4', text: 'Wer hat heute einen positiven Unterschied in meinem Tag gemacht?', context: 'evening', category: 'reflection' },
  { id: 'eo5', text: 'Was hat mich heute stolz gemacht?', context: 'evening', category: 'growth' },
  { id: 'eo6', text: 'Welche Energie möchte ich morgen mit in den Tag nehmen?', context: 'evening', category: 'focus' },
];

export function getCoreQuestions(context: CheckinContext): Question[] {
  return context === 'morning' ? MORNING_CORE : EVENING_CORE;
}

export function getOptionalQuestions(context: CheckinContext, excludeIds: string[] = []): Question[] {
  const pool = context === 'morning' ? MORNING_OPTIONAL : EVENING_OPTIONAL;
  return pool.filter((q) => !excludeIds.includes(q.id));
}

export function pickRandomOptional(context: CheckinContext, excludeIds: string[]): Question | null {
  const available = getOptionalQuestions(context, excludeIds);
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

// ─── Sprint 5: Values-based question pool ────────────────────────────────────

export const VALUES_QUESTIONS: Question[] = [
  // Familie
  { id: 'v_fam_m', text: 'Was kannst du heute für jemanden tun, der dir am Herzen liegt?', context: 'morning', category: 'growth', value: 'Familie' },
  { id: 'v_fam_e', text: 'Hast du heute Zeit für wichtige Menschen in deinem Leben gefunden?', context: 'evening', category: 'reflection', value: 'Familie' },
  // Karriere
  { id: 'v_kar_m', text: 'Welcher Schritt heute bringt dich beruflich weiter?', context: 'morning', category: 'focus', value: 'Karriere' },
  { id: 'v_kar_e', text: 'Was hast du heute für deine berufliche Entwicklung getan?', context: 'evening', category: 'reflection', value: 'Karriere' },
  // Gesundheit
  { id: 'v_ges_m', text: 'Was tust du heute Gutes für deinen Körper oder Geist?', context: 'morning', category: 'focus', value: 'Gesundheit' },
  { id: 'v_ges_e', text: 'Wie war dein Energielevel heute – was hat es beeinflusst?', context: 'evening', category: 'reflection', value: 'Gesundheit' },
  // Kreativität
  { id: 'v_kre_m', text: 'Wo kannst du heute kreativ denken oder etwas Neues ausprobieren?', context: 'morning', category: 'growth', value: 'Kreativität' },
  { id: 'v_kre_e', text: 'Hattest du heute einen kreativen Moment oder eine neue Idee?', context: 'evening', category: 'reflection', value: 'Kreativität' },
  // Freundschaft
  { id: 'v_frd_m', text: 'Wem könntest du heute eine aufmunternde Nachricht schicken?', context: 'morning', category: 'growth', value: 'Freundschaft' },
  { id: 'v_frd_e', text: 'Hast du heute eine echte Verbindung zu jemandem erlebt?', context: 'evening', category: 'reflection', value: 'Freundschaft' },
  // Sinn
  { id: 'v_sin_m', text: 'Was ist heute deine sinnvollste Aufgabe – warum tust du sie?', context: 'morning', category: 'focus', value: 'Sinn' },
  { id: 'v_sin_e', text: 'Was heute hatte wirklich Bedeutung für dich?', context: 'evening', category: 'reflection', value: 'Sinn' },
  // Wachstum
  { id: 'v_wac_m', text: 'Wo könntest du heute über dich hinauswachsen?', context: 'morning', category: 'growth', value: 'Wachstum' },
  { id: 'v_wac_e', text: 'Was hast du heute über dich selbst gelernt?', context: 'evening', category: 'growth', value: 'Wachstum' },
  // Ruhe
  { id: 'v_ruh_m', text: 'Wie schützt du heute deine innere Ruhe?', context: 'morning', category: 'focus', value: 'Ruhe' },
  { id: 'v_ruh_e', text: 'Wann hast du heute bewusst abgeschaltet oder dich erholt?', context: 'evening', category: 'reflection', value: 'Ruhe' },
  // Abenteuer
  { id: 'v_abe_m', text: 'Was ist heute neu oder unbekannt – und was reizt dich daran?', context: 'morning', category: 'focus', value: 'Abenteuer' },
  { id: 'v_abe_e', text: 'Hattest du heute einen Moment, der dich überrascht oder begeistert hat?', context: 'evening', category: 'reflection', value: 'Abenteuer' },
  // Finanzen
  { id: 'v_fin_m', text: 'Was kannst du heute tun, das langfristig deiner finanziellen Sicherheit dient?', context: 'morning', category: 'focus', value: 'Finanzen' },
  { id: 'v_fin_e', text: 'Hast du heute eine bewusste Entscheidung rund ums Geld getroffen?', context: 'evening', category: 'reflection', value: 'Finanzen' },
];

/**
 * Returns core questions + optionally 1 values-based question.
 * The values question replaces the last optional slot to keep the flow short.
 */
export function getQuestionsForUser(
  context: CheckinContext,
  userValues: UserValue[] = [],
): Question[] {
  const core = getCoreQuestions(context);
  if (userValues.length === 0) return core;

  // Pick a values question matching one of the user's values (rotate daily by date)
  const dayIndex = new Date().getDate() % userValues.length;
  const targetValue = userValues[dayIndex];
  const valueQ = VALUES_QUESTIONS.find((q) => q.value === targetValue && q.context === context);

  return valueQ ? [...core, valueQ] : core;
}
