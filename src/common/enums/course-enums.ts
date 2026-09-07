import { CourseCategory, CourseLevel, CourseTemplate } from '@prisma/client';

/**
 * Les enums Prisma ne peuvent pas contenir d'espaces ni d'accents dans leurs
 * identifiants ; la base stocke la valeur lisible via `@map`, mais le client
 * Prisma manipule l'identifiant. Ces tables font le pont pour que l'API parle
 * les mêmes libellés que le frontend ("Formation Pro", "Théorique illustré"...).
 */

export const CATEGORY_LABELS = ['Histoire', 'Droit', 'Informatique', 'RH'] as const;
export type CategoryLabel = (typeof CATEGORY_LABELS)[number];

export const LEVEL_LABELS = ['L1', 'L2', 'L3', 'Formation Pro'] as const;
export type LevelLabel = (typeof LEVEL_LABELS)[number];

export const TEMPLATE_LABELS = [
  'Théorique illustré',
  'Pratique guidée',
  'Mixte',
] as const;
export type TemplateLabel = (typeof TEMPLATE_LABELS)[number];

const LEVEL_TO_PRISMA: Record<LevelLabel, CourseLevel> = {
  L1: CourseLevel.L1,
  L2: CourseLevel.L2,
  L3: CourseLevel.L3,
  'Formation Pro': CourseLevel.FormationPro,
};

const TEMPLATE_TO_PRISMA: Record<TemplateLabel, CourseTemplate> = {
  'Théorique illustré': CourseTemplate.TheoriqueIllustre,
  'Pratique guidée': CourseTemplate.PratiqueGuidee,
  Mixte: CourseTemplate.Mixte,
};

const PRISMA_TO_LEVEL = invert(LEVEL_TO_PRISMA);
const PRISMA_TO_TEMPLATE = invert(TEMPLATE_TO_PRISMA);

function invert<K extends string, V extends string>(map: Record<K, V>): Record<V, K> {
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k])) as Record<V, K>;
}

export const toPrismaCategory = (label: CategoryLabel): CourseCategory =>
  label as CourseCategory;
export const toPrismaLevel = (label: LevelLabel): CourseLevel => LEVEL_TO_PRISMA[label];
export const toPrismaTemplate = (label: TemplateLabel): CourseTemplate =>
  TEMPLATE_TO_PRISMA[label];

export const fromPrismaLevel = (value: CourseLevel): LevelLabel => PRISMA_TO_LEVEL[value];
export const fromPrismaTemplate = (value: CourseTemplate): TemplateLabel =>
  PRISMA_TO_TEMPLATE[value];
