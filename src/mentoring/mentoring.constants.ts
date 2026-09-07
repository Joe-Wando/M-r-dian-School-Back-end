/**
 * Offre de mentorat (reprise du prototype frontend — constante MENTORING_OPTIONS).
 * Le prix est déterminé côté serveur à partir de la durée choisie.
 */
export interface MentoringOption {
  id: string;
  durationMinutes: 30 | 60;
  label: string;
  description: string;
  price: number; // FCFA
}

export const MENTORING_OPTIONS: MentoringOption[] = [
  {
    id: 'MEN-30',
    durationMinutes: 30,
    label: '30 min',
    description: 'Une question précise, un blocage à débloquer rapidement.',
    price: 8000,
  },
  {
    id: 'MEN-60',
    durationMinutes: 60,
    label: '60 min',
    description: 'Un accompagnement approfondi : projet, orientation, plan de progression.',
    price: 14000,
  },
];

export const getMentoringOption = (durationMinutes: number): MentoringOption | undefined =>
  MENTORING_OPTIONS.find((o) => o.durationMinutes === durationMinutes);
