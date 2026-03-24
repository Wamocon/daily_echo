import { CheckinContext } from '@/types';

export interface Question {
  id: string;
  text: string;
  context: CheckinContext | 'both';
  category: 'focus' | 'reflection' | 'growth';
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
