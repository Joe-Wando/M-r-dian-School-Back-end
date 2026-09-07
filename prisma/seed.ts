import { PrismaClient, CourseLevel, CourseTemplate, SectionType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

import {
  COURSES,
  FILIERE_INFO,
  MODULES_BY_COURSE,
  PROFILE,
  QA_SESSIONS,
  SKILLS,
  WORKS,
  type SeedLevel,
} from './seed-data';

dotenv.config();

const prisma = new PrismaClient();

const LEVEL_MAP: Record<SeedLevel, CourseLevel> = {
  L1: CourseLevel.L1,
  L2: CourseLevel.L2,
  L3: CourseLevel.L3,
  'Formation Pro': CourseLevel.FormationPro,
};

const TEMPLATE_MAP: Record<string, CourseTemplate> = {
  'Théorique illustré': CourseTemplate.TheoriqueIllustre,
  'Pratique guidée': CourseTemplate.PratiqueGuidee,
  Mixte: CourseTemplate.Mixte,
};

function futureDate(inDays: number, hourUtc: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + inDays);
  d.setUTCHours(hourUtc, 0, 0, 0);
  return d;
}

async function seedAdmin(): Promise<void> {
  const email = (process.env.ADMIN_EMAIL ?? 'admin@meredian.io').toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? 'Admin Meredian';

  if (!password || password.length < 12) {
    throw new Error(
      'ADMIN_PASSWORD est absent ou trop court. Renseignez un mot de passe fort ' +
        '(>= 12 caractères) dans le fichier .env avant de lancer le seed.',
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { role: 'admin', name },
    create: { email, name, passwordHash, role: 'admin' },
  });
  console.log(`  ✓ admin : ${email}`);

  // Un utilisateur de démonstration (rôle user).
  const demoEmail = 'etudiant@meredian.io';
  await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      name: 'Étudiant Démo',
      passwordHash: await bcrypt.hash('Etudiant!2026', 12),
      role: 'user',
    },
  });
  console.log(`  ✓ user  : ${demoEmail} (mot de passe : Etudiant!2026)`);
}

async function seedCourses(): Promise<void> {
  for (const c of COURSES) {
    const hasDetailedModules = Boolean(MODULES_BY_COURSE[c.code]);
    const template = hasDetailedModules
      ? TEMPLATE_MAP[MODULES_BY_COURSE[c.code][0].template]
      : CourseTemplate.Mixte;

    const course = await prisma.course.upsert({
      where: { code: c.code },
      update: {
        title: c.title,
        category: c.cat,
        level: LEVEL_MAP[c.level],
        template,
        isFree: c.free,
        price: c.price,
        duration: c.duration,
        description: c.desc,
      },
      create: {
        code: c.code,
        title: c.title,
        category: c.cat,
        level: LEVEL_MAP[c.level],
        template,
        isFree: c.free,
        price: c.price,
        duration: c.duration,
        description: c.desc,
      },
    });

    const modules = MODULES_BY_COURSE[c.code];
    if (!modules) continue;

    // Recrée proprement l'arborescence de modules/sections pour ce cours.
    await prisma.module.deleteMany({ where: { courseId: course.id } });

    for (const [mIndex, m] of modules.entries()) {
      const createdModule = await prisma.module.create({
        data: { courseId: course.id, title: m.title, orderIndex: mIndex },
      });

      for (const [sIndex, s] of m.sections.entries()) {
        const type = s.type as SectionType;
        await prisma.section.create({
          data: {
            moduleId: createdModule.id,
            title: s.title,
            type,
            orderIndex: sIndex,
            duration: s.duration,
            practical: s.practical ?? false,
            body:
              type === SectionType.reading
                ? `# ${s.title}\n\nContenu de démonstration à compléter par l'administrateur.`
                : null,
            videoUrl:
              type === SectionType.video
                ? 'https://stream.meredian.io/demo/placeholder.m3u8'
                : null,
            photos:
              type === SectionType.image
                ? {
                    create: Array.from({ length: 3 }).map((_, i) => ({
                      url: `https://cdn.meredian.io/demo/${c.code}/${createdModule.id}-${i + 1}.jpg`,
                      caption: `Illustration ${i + 1} — ${s.title}`,
                      orderIndex: i,
                    })),
                  }
                : undefined,
            quiz:
              type === SectionType.quiz
                ? {
                    create: [
                      {
                        question: `Question de démonstration — ${s.title}`,
                        options: ['Proposition A', 'Proposition B', 'Proposition C'],
                        correctIndex: 0,
                        orderIndex: 0,
                      },
                    ],
                  }
                : undefined,
          },
        });
      }
    }
  }
  console.log(`  ✓ ${COURSES.length} cours (dont ${Object.keys(MODULES_BY_COURSE).length} détaillés avec modules/sections)`);
}

async function seedVitrine(): Promise<void> {
  const existing = await prisma.profile.findFirst();
  if (existing) {
    await prisma.profile.update({ where: { id: existing.id }, data: PROFILE });
  } else {
    await prisma.profile.create({ data: PROFILE });
  }

  await prisma.skill.deleteMany();
  for (const [category, names] of Object.entries(SKILLS)) {
    for (const name of names) {
      await prisma.skill.create({ data: { category, name } });
    }
  }

  await prisma.work.deleteMany();
  for (const w of WORKS) {
    await prisma.work.create({
      data: { title: w.title, category: w.category, description: w.description, link: w.link },
    });
  }
  console.log('  ✓ profil, compétences, réalisations');
}

async function seedQaSessions(): Promise<void> {
  // Idempotent sur le couple (topic) — supprime les sessions de démo à venir puis recrée.
  for (const s of QA_SESSIONS) {
    const scheduledAt = futureDate(s.inDays, s.hourUtc);
    const existing = await prisma.qaSession.findFirst({ where: { topic: s.topic } });
    if (existing) {
      await prisma.qaSession.update({
        where: { id: existing.id },
        data: { scheduledAt, durationMinutes: s.durationMinutes, maxSpots: s.maxSpots },
      });
    } else {
      await prisma.qaSession.create({
        data: {
          topic: s.topic,
          scheduledAt,
          durationMinutes: s.durationMinutes,
          maxSpots: s.maxSpots,
        },
      });
    }
  }
  console.log(`  ✓ ${QA_SESSIONS.length} sessions Q&R`);
}

async function seedFilieres(): Promise<void> {
  for (const f of FILIERE_INFO) {
    await prisma.filiere.upsert({
      where: { category: f.category },
      update: {
        intro: f.intro,
        levels: f.levels,
        certificationText: f.certificationText ?? null,
        certificationUrl: f.certificationUrl ?? null,
      },
      create: {
        category: f.category,
        intro: f.intro,
        levels: f.levels,
        certificationText: f.certificationText ?? null,
        certificationUrl: f.certificationUrl ?? null,
      },
    });
  }
  console.log(`  ✓ ${FILIERE_INFO.length} filières (contenu des bandeaux)`);
}

async function main(): Promise<void> {
  console.log('Seed Meredian —');
  await seedAdmin();
  await seedCourses();
  await seedVitrine();
  await seedQaSessions();
  await seedFilieres();
  console.log('Seed terminé.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
