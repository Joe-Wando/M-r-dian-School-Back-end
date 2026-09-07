/**
 * Données de démonstration — reprises telles quelles du prototype frontend
 * (plateforme-app-prototype.jsx : constantes COURSES, MODULES_BY_COURSE, SKILLS,
 * WORKS, MENTORING_OPTIONS, QA_SESSIONS, TIMELINE).
 */

export type SeedCategory = 'Histoire' | 'Droit' | 'Informatique' | 'RH';
export type SeedLevel = 'L1' | 'L2' | 'L3' | 'Formation Pro';

export interface SeedCourse {
  code: string;
  cat: SeedCategory;
  level: SeedLevel;
  title: string;
  desc: string;
  duration: string;
  free: boolean;
  price: number;
}

// Constante COURSES du prototype (identifiants d'origine conservés dans `code`).
export const COURSES: SeedCourse[] = [
  { code: 'HIS-101', cat: 'Histoire', level: 'L1', title: 'Les grandes ruptures du XXe siècle', desc: "Des guerres mondiales à la décolonisation : comprendre un siècle qui a redessiné les frontières et les idées.", duration: '4h30', free: true, price: 0 },
  { code: 'HIS-105', cat: 'Histoire', level: 'L1', title: "Introduction à l'historiographie", desc: 'Comment se construit le savoir historique : sources, méthode critique, écoles de pensée.', duration: '3h', free: false, price: 8000 },
  { code: 'HIS-201', cat: 'Histoire', level: 'L2', title: 'Histoire de la Rome antique', desc: "De la fondation légendaire à la chute de l'Empire : institutions, société, héritage.", duration: '6h', free: false, price: 12000 },
  { code: 'HIS-204', cat: 'Histoire', level: 'L2', title: 'Histoire des institutions africaines précoloniales', desc: "Royaumes, empires et systèmes de gouvernance avant la colonisation : une histoire trop souvent effacée.", duration: '6h', free: false, price: 12000 },
  { code: 'HIS-210', cat: 'Histoire', level: 'L2', title: 'Histoire des civilisations médiévales', desc: "Féodalité, échanges, foi et pouvoir : l'Europe et ses voisins entre le Ve et le XVe siècle.", duration: '5h30', free: false, price: 11000 },
  { code: 'HIS-301', cat: 'Histoire', level: 'L3', title: 'Histoire de la Révolution française', desc: "1789 et ses suites : rupture politique, sociale et symbolique dont l'écho traverse encore le présent.", duration: '5h', free: false, price: 14000 },
  { code: 'HIS-305', cat: 'Histoire', level: 'L3', title: 'Histoire des relations internationales contemporaines', desc: "Des traités de paix aux organisations mondiales : la fabrique de l'ordre international depuis 1945.", duration: '6h30', free: false, price: 15000 },
  { code: 'HIS-310', cat: 'Histoire', level: 'L3', title: 'Histoire de la Guerre froide', desc: "Blocs, crises, équilibre de la terreur : anatomie d'un conflit qui n'a jamais eu lieu directement.", duration: '5h', free: false, price: 13000 },
  { code: 'DRO-101', cat: 'Droit', level: 'L1', title: 'Introduction générale au droit', desc: 'Les fondations : sources du droit, hiérarchie des normes, organisation judiciaire.', duration: '4h', free: true, price: 0 },
  { code: 'DRO-110', cat: 'Droit', level: 'L1', title: 'Introduction au droit des contrats', desc: 'Les bases essentielles pour comprendre, lire et négocier un contrat en toute confiance.', duration: '5h', free: true, price: 0 },
  { code: 'DRO-205', cat: 'Droit', level: 'L2', title: 'Droit constitutionnel', desc: 'Séparation des pouvoirs, régimes politiques, contrôle de constitutionnalité — le socle du droit public.', duration: '6h', free: false, price: 13000 },
  { code: 'DRO-210', cat: 'Droit', level: 'L2', title: 'Droit des obligations', desc: 'Contrats, responsabilité civile, engagements : le cœur du droit privé patrimonial.', duration: '7h', free: false, price: 14000 },
  { code: 'DRO-215', cat: 'Droit', level: 'L2', title: 'Droit pénal général', desc: 'Infraction, responsabilité, sanction : les principes qui structurent le droit répressif.', duration: '6h30', free: false, price: 14000 },
  { code: 'DRO-305', cat: 'Droit', level: 'L3', title: 'Droit du travail appliqué', desc: 'Contrats, licenciements, litiges : un cours concret pour salariés, RH et futurs juristes.', duration: '8h', free: false, price: 18000 },
  { code: 'DRO-310', cat: 'Droit', level: 'L3', title: 'Droit administratif', desc: "L'action de l'administration, ses actes, ses limites : comprendre le droit public en pratique.", duration: '7h', free: false, price: 16000 },
  { code: 'DRO-315', cat: 'Droit', level: 'L3', title: 'Droit des affaires', desc: "Sociétés commerciales, concurrence, contrats d'affaires : le droit au service de l'entreprise.", duration: '7h30', free: false, price: 17000 },
  { code: 'DRO-320', cat: 'Droit', level: 'L3', title: 'Libertés fondamentales', desc: "Droits de l'Homme, contrôle du pouvoir, protections constitutionnelles et internationales.", duration: '5h', free: false, price: 13000 },
  { code: 'INF-101', cat: 'Informatique', level: 'L1', title: 'Algorithmique 1 — Les fondamentaux', desc: 'Variables, boucles, conditions, fonctions : penser comme un algorithme avant de coder.', duration: '6h', free: true, price: 0 },
  { code: 'INF-105', cat: 'Informatique', level: 'L1', title: 'Programmation en langage C', desc: "Le langage qui a forgé l'informatique moderne : pointeurs, mémoire, rigueur.", duration: '8h', free: false, price: 15000 },
  { code: 'INF-201', cat: 'Informatique', level: 'L2', title: 'Algorithmique 2 — Structures de données avancées', desc: 'Listes chaînées, arbres, graphes : structurer la donnée pour des programmes efficaces.', duration: '7h', free: false, price: 16000 },
  { code: 'INF-210', cat: 'Informatique', level: 'L2', title: 'Java orienté objet', desc: 'Classes, héritage, polymorphisme : construire des programmes robustes et réutilisables.', duration: '8h30', free: false, price: 17000 },
  { code: 'INF-120', cat: 'Informatique', level: 'L2', title: 'Bases de données relationnelles avec PostgreSQL', desc: 'Modéliser, interroger et optimiser une base de données comme un professionnel.', duration: '7h', free: false, price: 15000 },
  { code: 'INF-301', cat: 'Informatique', level: 'L3', title: "Python pour l'analyse de données", desc: 'Pandas, NumPy, visualisation : transformer des données brutes en informations exploitables.', duration: '7h30', free: false, price: 16000 },
  { code: 'INF-310', cat: 'Informatique', level: 'L3', title: 'Introduction à la Data Science', desc: "Statistiques appliquées, premiers modèles prédictifs, méthodologie d'un projet data.", duration: '9h', free: false, price: 19000 },
  { code: 'INF-P01', cat: 'Informatique', level: 'Formation Pro', title: 'Git & GitHub pour débutants', desc: 'Versionner son code sereinement, collaborer sans écraser le travail des autres.', duration: '2h30', free: true, price: 0 },
  { code: 'INF-P02', cat: 'Informatique', level: 'Formation Pro', title: 'Développement Front-End avec React', desc: 'Composants, état, interactions : construire des interfaces web modernes et réactives.', duration: '10h', free: false, price: 22000 },
  { code: 'INF-P03', cat: 'Informatique', level: 'Formation Pro', title: 'Développement Back-End avec Node.js', desc: 'API REST, gestion de serveur, connexion à une base de données : le back-end de A à Z.', duration: '10h', free: false, price: 22000 },
  { code: 'RH-P01', cat: 'RH', level: 'Formation Pro', title: 'Fondamentaux de la gestion des talents', desc: 'Comprendre les enjeux RH modernes : rétention, motivation, montée en compétences.', duration: '3h', free: true, price: 0 },
  { code: 'RH-P02', cat: 'RH', level: 'Formation Pro', title: 'Recrutement et évaluation des compétences', desc: "Structurer un processus de recrutement juste, efficace et aligné avec la stratégie de l'entreprise.", duration: '5h30', free: false, price: 14000 },
  { code: 'RH-P03', cat: 'RH', level: 'Formation Pro', title: 'Gestion de la paie', desc: 'Bulletins, cotisations, obligations légales : les fondamentaux d\'une paie fiable.', duration: '6h', free: false, price: 15000 },
  { code: 'RH-P04', cat: 'RH', level: 'Formation Pro', title: 'Formation et développement des compétences', desc: "Construire un plan de formation qui fait grandir les équipes et l'entreprise.", duration: '4h30', free: false, price: 12000 },
  { code: 'RH-P05', cat: 'RH', level: 'Formation Pro', title: 'Communication interne et marque employeur', desc: 'Fédérer en interne, attirer en externe : la communication au service des RH.', duration: '4h', free: false, price: 11000 },
  { code: 'RH-P06', cat: 'RH', level: 'Formation Pro', title: 'Gestion des conflits en entreprise', desc: 'Désamorcer les tensions, arbitrer avec justesse, restaurer un climat de travail sain.', duration: '3h30', free: false, price: 10000 },
  { code: 'RH-P07', cat: 'RH', level: 'Formation Pro', title: 'Droit social pour les RH', desc: "Le droit du travail vu du côté RH : ce qu'il faut savoir au quotidien.", duration: '5h', free: false, price: 13000 },
];

type SeedSectionType = 'reading' | 'image' | 'video' | 'quiz';

export interface SeedSection {
  title: string;
  type: SeedSectionType;
  duration: string;
  practical?: boolean;
}

export interface SeedModule {
  title: string;
  template: 'Théorique illustré' | 'Pratique guidée' | 'Mixte';
  sections: SeedSection[];
}

// Constante MODULES_BY_COURSE du prototype (2 cours détaillés).
export const MODULES_BY_COURSE: Record<string, SeedModule[]> = {
  'HIS-101': [
    {
      title: 'Le monde avant la rupture',
      template: 'Théorique illustré',
      sections: [
        { title: "L'ordre européen en 1900", type: 'image', duration: '12 photos' },
        { title: 'Tensions et rivalités impériales', type: 'reading', duration: '8 min' },
      ],
    },
    {
      title: 'Les deux guerres mondiales',
      template: 'Théorique illustré',
      sections: [
        { title: 'La Première Guerre mondiale : causes et bouleversements', type: 'image', duration: '15 photos' },
        { title: 'La Seconde Guerre mondiale : un basculement global', type: 'image', duration: '18 photos' },
        { title: 'Cartes et bilans chiffrés', type: 'reading', duration: '10 min' },
      ],
    },
    {
      title: 'La décolonisation',
      template: 'Théorique illustré',
      sections: [
        { title: "Les mouvements d'indépendance en Afrique et en Asie", type: 'image', duration: '14 photos' },
        { title: "Étude de cas : l'indépendance de l'Inde", type: 'reading', duration: '12 min' },
        { title: 'Chronologie commentée', type: 'quiz', duration: '1 évaluation' },
      ],
    },
    {
      title: 'Un siècle qui redessine le monde',
      template: 'Théorique illustré',
      sections: [
        { title: 'Guerre froide et nouvel ordre mondial', type: 'image', duration: '10 photos' },
        { title: 'Synthèse et mise en perspective', type: 'reading', duration: '8 min' },
      ],
    },
  ],
  'INF-105': [
    {
      title: 'Comprendre le langage C',
      template: 'Pratique guidée',
      sections: [
        { title: 'Pourquoi apprendre le C ?', type: 'reading', duration: '6 min' },
        { title: 'Syntaxe de base et compilation', type: 'reading', duration: '8 min' },
      ],
    },
    {
      title: 'Premiers programmes',
      template: 'Pratique guidée',
      sections: [
        { title: 'Écrire et compiler son premier programme', type: 'video', practical: true, duration: '14 min' },
        { title: 'Boucles et conditions en pratique', type: 'video', practical: true, duration: '16 min' },
      ],
    },
    {
      title: 'Manipuler la mémoire',
      template: 'Pratique guidée',
      sections: [
        { title: 'Comprendre les pointeurs', type: 'reading', duration: '9 min' },
        { title: 'Débugger un pointeur en direct', type: 'video', practical: true, duration: '18 min' },
        { title: 'Exercice noté', type: 'quiz', duration: '1 évaluation' },
      ],
    },
    {
      title: 'Projet guidé',
      template: 'Pratique guidée',
      sections: [
        { title: 'Construire un petit programme complet', type: 'video', practical: true, duration: '22 min' },
      ],
    },
  ],
};

// Constante SKILLS du prototype.
export const SKILLS: Record<string, string[]> = {
  Informatique: ['React', 'Node.js', 'PostgreSQL', 'Python', 'Git'],
  Droit: ['Rédaction contractuelle', 'Veille juridique'],
  RH: ['Recrutement', 'Communication interne'],
  Histoire: ['Recherche documentaire', 'Analyse historique'],
};

// Constante WORKS du prototype.
export const WORKS = [
  { title: 'Plateforme de cours en ligne', category: 'Informatique', description: 'Conception et développement de ce projet même — catalogue, paiement, vitrine.', link: null },
  { title: 'Note de synthèse — droit des contrats', category: 'Droit', description: 'Analyse comparée des clauses résolutoires en droit OHADA.', link: null },
  { title: 'API de gestion de bibliothèque', category: 'Informatique', description: 'API REST avec authentification, développée en Node.js et PostgreSQL.', link: null },
  { title: 'Étude — fidélisation des jeunes talents', category: 'RH', description: 'Enquête et recommandations pour une PME locale.', link: null },
];

// Constante QA_SESSIONS du prototype (dates régénérées dans le futur au seed).
export const QA_SESSIONS = [
  { topic: 'Bases de données & SQL', inDays: 7, hourUtc: 18, durationMinutes: 60, maxSpots: 12 },
  { topic: "Droit des contrats — questions d'examen", inDays: 12, hourUtc: 19, durationMinutes: 60, maxSpots: 8 },
  { topic: 'Orientation carrière en informatique', inDays: 16, hourUtc: 10, durationMinutes: 60, maxSpots: 20 },
];

// Constante FILIERE_INFO du prototype — contenu éditorial des bandeaux du catalogue.
export interface SeedFiliere {
  category: SeedCategory;
  intro: string;
  levels: Record<string, string>;
  certificationText?: string;
  certificationUrl?: string;
}

export const FILIERE_INFO: SeedFiliere[] = [
  {
    category: 'Histoire',
    intro:
      "Vous voici plongés dans l'étude du temps long : comprendre le présent à la lumière du passé.",
    levels: {
      L1: 'Poser les bases : repères chronologiques et méthode historique.',
      L2: 'Approfondir : civilisations, institutions et sociétés à travers les âges.',
      L3: "Analyser des enjeux contemporains à la lumière de l'histoire récente.",
    },
  },
  {
    category: 'Droit',
    intro:
      'Vos premiers pas dans le raisonnement juridique : rigueur, logique, argumentation.',
    levels: {
      L1: 'Les fondations du droit : sources, institutions, vocabulaire juridique.',
      L2: 'Le cœur de la matière : droit public et droit privé approfondis.',
      L3: 'Spécialisation : droit appliqué à des situations professionnelles concrètes.',
    },
  },
  {
    category: 'Informatique',
    intro:
      "Vous voici en train de faire vos premiers pas en informatique. Prenez le temps d'apprendre les bases : elles vous serviront toute votre carrière.",
    levels: {
      L1: 'Les fondamentaux : algorithmique et premiers langages de programmation.',
      L2: 'Structurer sa pensée : structures de données, bases de données, programmation orientée objet.',
      L3: 'Se spécialiser : data, analyse, projets concrets.',
      'Formation Pro':
        'Des compétences directement applicables en entreprise : outils, frameworks, bonnes pratiques.',
    },
    certificationText:
      "Cette filière peut t'orienter vers une certification professionnelle externe reconnue.",
  },
  {
    category: 'RH',
    intro:
      'Des compétences RH concrètes, pensées pour le terrain : recrutement, paie, gestion des équipes.',
    levels: {
      'Formation Pro':
        'Des modules pratiques, indépendants les uns des autres, à suivre selon tes besoins du moment.',
    },
  },
];

export const PROFILE = {
  bio: "Étudiant en génie informatique et passionné de transmission. Je conçois Meredian pour partager ce que j'apprends en histoire, droit, informatique et RH — et pour accompagner celles et ceux qui veulent progresser.",
  cvUrl: 'https://meredian.io/cv.pdf',
  pitchVideoUrl: 'https://meredian.io/pitch.mp4',
  location: 'Zurich, Suisse',
  emailContact: 'contact@meredian.io',
};
