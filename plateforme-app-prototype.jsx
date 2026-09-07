import { useState, useMemo } from "react";
import {
  Search, X, Lock, Unlock, Clock, BarChart3, Mail, Bell, ChevronDown,
  Menu, Circle, CheckCircle2, PlayCircle, FileText, ClipboardCheck,
  ArrowLeft, Star, Download, MapPin, ArrowUpRight, GraduationCap,
  Briefcase, Send, Users, FileCheck2, Radio, Calendar, ExternalLink,
  LayoutDashboard, Plus, Pencil, Trash2, BookOpen, DollarSign, Mail as MailIcon,
  Image as ImageIcon, FileDown,
} from "lucide-react";

/* ------------------------- DONNÉES PARTAGÉES ------------------------- */

const LOGO_DATA_URI = "data:image/png;base64,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";

const CATEGORIES = {
  Histoire: { color: "#B45309", tint: "#FEF3C7", text: "#92400E" },
  Droit: { color: "#1D4ED8", tint: "#DBEAFE", text: "#1E40AF" },
  Informatique: { color: "#059669", tint: "#D1FAE5", text: "#047857" },
  RH: { color: "#A21CAF", tint: "#FAE8FF", text: "#86198F" },
};

const LEVELS = ["L1", "L2", "L3", "Formation Pro"];

const COURSES = [
  { id: "HIS-101", cat: "Histoire", level: "L1", title: "Les grandes ruptures du XXe siècle", desc: "Des guerres mondiales à la décolonisation : comprendre un siècle qui a redessiné les frontières et les idées.", duration: "4h30", free: true, price: 0 },
  { id: "HIS-105", cat: "Histoire", level: "L1", title: "Introduction à l'historiographie", desc: "Comment se construit le savoir historique : sources, méthode critique, écoles de pensée.", duration: "3h", free: false, price: 8000 },
  { id: "HIS-201", cat: "Histoire", level: "L2", title: "Histoire de la Rome antique", desc: "De la fondation légendaire à la chute de l'Empire : institutions, société, héritage.", duration: "6h", free: false, price: 12000 },
  { id: "HIS-204", cat: "Histoire", level: "L2", title: "Histoire des institutions africaines précoloniales", desc: "Royaumes, empires et systèmes de gouvernance avant la colonisation : une histoire trop souvent effacée.", duration: "6h", free: false, price: 12000 },
  { id: "HIS-210", cat: "Histoire", level: "L2", title: "Histoire des civilisations médiévales", desc: "Féodalité, échanges, foi et pouvoir : l'Europe et ses voisins entre le Ve et le XVe siècle.", duration: "5h30", free: false, price: 11000 },
  { id: "HIS-301", cat: "Histoire", level: "L3", title: "Histoire de la Révolution française", desc: "1789 et ses suites : rupture politique, sociale et symbolique dont l'écho traverse encore le présent.", duration: "5h", free: false, price: 14000 },
  { id: "HIS-305", cat: "Histoire", level: "L3", title: "Histoire des relations internationales contemporaines", desc: "Des traités de paix aux organisations mondiales : la fabrique de l'ordre international depuis 1945.", duration: "6h30", free: false, price: 15000 },
  { id: "HIS-310", cat: "Histoire", level: "L3", title: "Histoire de la Guerre froide", desc: "Blocs, crises, équilibre de la terreur : anatomie d'un conflit qui n'a jamais eu lieu directement.", duration: "5h", free: false, price: 13000 },
  { id: "DRO-101", cat: "Droit", level: "L1", title: "Introduction générale au droit", desc: "Les fondations : sources du droit, hiérarchie des normes, organisation judiciaire.", duration: "4h", free: true, price: 0 },
  { id: "DRO-110", cat: "Droit", level: "L1", title: "Introduction au droit des contrats", desc: "Les bases essentielles pour comprendre, lire et négocier un contrat en toute confiance.", duration: "5h", free: true, price: 0 },
  { id: "DRO-205", cat: "Droit", level: "L2", title: "Droit constitutionnel", desc: "Séparation des pouvoirs, régimes politiques, contrôle de constitutionnalité — le socle du droit public.", duration: "6h", free: false, price: 13000 },
  { id: "DRO-210", cat: "Droit", level: "L2", title: "Droit des obligations", desc: "Contrats, responsabilité civile, engagements : le cœur du droit privé patrimonial.", duration: "7h", free: false, price: 14000 },
  { id: "DRO-215", cat: "Droit", level: "L2", title: "Droit pénal général", desc: "Infraction, responsabilité, sanction : les principes qui structurent le droit répressif.", duration: "6h30", free: false, price: 14000 },
  { id: "DRO-305", cat: "Droit", level: "L3", title: "Droit du travail appliqué", desc: "Contrats, licenciements, litiges : un cours concret pour salariés, RH et futurs juristes.", duration: "8h", free: false, price: 18000 },
  { id: "DRO-310", cat: "Droit", level: "L3", title: "Droit administratif", desc: "L'action de l'administration, ses actes, ses limites : comprendre le droit public en pratique.", duration: "7h", free: false, price: 16000 },
  { id: "DRO-315", cat: "Droit", level: "L3", title: "Droit des affaires", desc: "Sociétés commerciales, concurrence, contrats d'affaires : le droit au service de l'entreprise.", duration: "7h30", free: false, price: 17000 },
  { id: "DRO-320", cat: "Droit", level: "L3", title: "Libertés fondamentales", desc: "Droits de l'Homme, contrôle du pouvoir, protections constitutionnelles et internationales.", duration: "5h", free: false, price: 13000 },
  { id: "INF-101", cat: "Informatique", level: "L1", title: "Algorithmique 1 — Les fondamentaux", desc: "Variables, boucles, conditions, fonctions : penser comme un algorithme avant de coder.", duration: "6h", free: true, price: 0 },
  { id: "INF-105", cat: "Informatique", level: "L1", title: "Programmation en langage C", desc: "Le langage qui a forgé l'informatique moderne : pointeurs, mémoire, rigueur.", duration: "8h", free: false, price: 15000 },
  { id: "INF-201", cat: "Informatique", level: "L2", title: "Algorithmique 2 — Structures de données avancées", desc: "Listes chaînées, arbres, graphes : structurer la donnée pour des programmes efficaces.", duration: "7h", free: false, price: 16000 },
  { id: "INF-210", cat: "Informatique", level: "L2", title: "Java orienté objet", desc: "Classes, héritage, polymorphisme : construire des programmes robustes et réutilisables.", duration: "8h30", free: false, price: 17000 },
  { id: "INF-120", cat: "Informatique", level: "L2", title: "Bases de données relationnelles avec PostgreSQL", desc: "Modéliser, interroger et optimiser une base de données comme un professionnel.", duration: "7h", free: false, price: 15000 },
  { id: "INF-301", cat: "Informatique", level: "L3", title: "Python pour l'analyse de données", desc: "Pandas, NumPy, visualisation : transformer des données brutes en informations exploitables.", duration: "7h30", free: false, price: 16000 },
  { id: "INF-310", cat: "Informatique", level: "L3", title: "Introduction à la Data Science", desc: "Statistiques appliquées, premiers modèles prédictifs, méthodologie d'un projet data.", duration: "9h", free: false, price: 19000 },
  { id: "INF-P01", cat: "Informatique", level: "Formation Pro", title: "Git & GitHub pour débutants", desc: "Versionner son code sereinement, collaborer sans écraser le travail des autres.", duration: "2h30", free: true, price: 0 },
  { id: "INF-P02", cat: "Informatique", level: "Formation Pro", title: "Développement Front-End avec React", desc: "Composants, état, interactions : construire des interfaces web modernes et réactives.", duration: "10h", free: false, price: 22000 },
  { id: "INF-P03", cat: "Informatique", level: "Formation Pro", title: "Développement Back-End avec Node.js", desc: "API REST, gestion de serveur, connexion à une base de données : le back-end de A à Z.", duration: "10h", free: false, price: 22000 },
  { id: "RH-P01", cat: "RH", level: "Formation Pro", title: "Fondamentaux de la gestion des talents", desc: "Comprendre les enjeux RH modernes : rétention, motivation, montée en compétences.", duration: "3h", free: true, price: 0 },
  { id: "RH-P02", cat: "RH", level: "Formation Pro", title: "Recrutement et évaluation des compétences", desc: "Structurer un processus de recrutement juste, efficace et aligné avec la stratégie de l'entreprise.", duration: "5h30", free: false, price: 14000 },
  { id: "RH-P03", cat: "RH", level: "Formation Pro", title: "Gestion de la paie", desc: "Bulletins, cotisations, obligations légales : les fondamentaux d'une paie fiable.", duration: "6h", free: false, price: 15000 },
  { id: "RH-P04", cat: "RH", level: "Formation Pro", title: "Formation et développement des compétences", desc: "Construire un plan de formation qui fait grandir les équipes et l'entreprise.", duration: "4h30", free: false, price: 12000 },
  { id: "RH-P05", cat: "RH", level: "Formation Pro", title: "Communication interne et marque employeur", desc: "Fédérer en interne, attirer en externe : la communication au service des RH.", duration: "4h", free: false, price: 11000 },
  { id: "RH-P06", cat: "RH", level: "Formation Pro", title: "Gestion des conflits en entreprise", desc: "Désamorcer les tensions, arbitrer avec justesse, restaurer un climat de travail sain.", duration: "3h30", free: false, price: 10000 },
  { id: "RH-P07", cat: "RH", level: "Formation Pro", title: "Droit social pour les RH", desc: "Le droit du travail vu du côté RH : ce qu'il faut savoir au quotidien.", duration: "5h", free: false, price: 13000 },
];

const MODULES_BY_COURSE = {
  "HIS-101": [
    { id: "m1", title: "Le monde avant la rupture", status: "done", template: "Théorique illustré", sections: [
      { title: "L'ordre européen en 1900", type: "image", duration: "12 photos" },
      { title: "Tensions et rivalités impériales", type: "reading", duration: "8 min" },
    ]},
    { id: "m2", title: "Les deux guerres mondiales", status: "done", template: "Théorique illustré", sections: [
      { title: "La Première Guerre mondiale : causes et bouleversements", type: "image", duration: "15 photos" },
      { title: "La Seconde Guerre mondiale : un basculement global", type: "image", duration: "18 photos" },
      { title: "Cartes et bilans chiffrés", type: "reading", duration: "10 min" },
    ]},
    { id: "m3", title: "La décolonisation", status: "current", template: "Théorique illustré", sections: [
      { title: "Les mouvements d'indépendance en Afrique et en Asie", type: "image", duration: "14 photos" },
      { title: "Étude de cas : l'indépendance de l'Inde", type: "reading", duration: "12 min" },
      { title: "Chronologie commentée", type: "quiz", duration: "1 évaluation" },
    ]},
    { id: "m4", title: "Un siècle qui redessine le monde", status: "locked", template: "Théorique illustré", sections: [
      { title: "Guerre froide et nouvel ordre mondial", type: "image", duration: "10 photos" },
      { title: "Synthèse et mise en perspective", type: "reading", duration: "8 min" },
    ]},
  ],
  "INF-105": [
    { id: "m1", title: "Comprendre le langage C", status: "done", template: "Pratique guidée", sections: [
      { title: "Pourquoi apprendre le C ?", type: "reading", duration: "6 min" },
      { title: "Syntaxe de base et compilation", type: "reading", duration: "8 min" },
    ]},
    { id: "m2", title: "Premiers programmes", status: "done", template: "Pratique guidée", sections: [
      { title: "Écrire et compiler son premier programme", type: "video", practical: true, duration: "14 min" },
      { title: "Boucles et conditions en pratique", type: "video", practical: true, duration: "16 min" },
    ]},
    { id: "m3", title: "Manipuler la mémoire", status: "current", template: "Pratique guidée", sections: [
      { title: "Comprendre les pointeurs", type: "reading", duration: "9 min" },
      { title: "Débugger un pointeur en direct", type: "video", practical: true, duration: "18 min" },
      { title: "Exercice noté", type: "quiz", duration: "1 évaluation" },
    ]},
    { id: "m4", title: "Projet guidé", status: "locked", template: "Pratique guidée", sections: [
      { title: "Construire un petit programme complet", type: "video", practical: true, duration: "22 min" },
    ]},
  ],
};

const DEMO_MODULES = [
  { id: "m1", title: "Introduction", status: "done", sections: [
    { title: "Présentation du cours", type: "video", duration: "8 min" },
    { title: "Notions clés", type: "video", duration: "12 min" },
  ]},
  { id: "m2", title: "Approfondissement", status: "done", sections: [
    { title: "Concepts avancés", type: "video", duration: "14 min" },
    { title: "Support de lecture", type: "reading", duration: "10 min" },
  ]},
  { id: "m3", title: "Mise en pratique", status: "current", sections: [
    { title: "Étude de cas guidée", type: "video", duration: "16 min" },
    { title: "Application concrète", type: "video", duration: "18 min" },
    { title: "Exercice noté", type: "quiz", duration: "1 évaluation" },
  ]},
  { id: "m4", title: "Pour aller plus loin", status: "locked", sections: [
    { title: "Cas complexes", type: "video", duration: "11 min" },
    { title: "Ressources complémentaires", type: "reading", duration: "9 min" },
  ]},
];

const TIMELINE = [
  { year: "2024 — présent", type: "formation", title: "Licence 2, Génie Informatique", place: "Université de Zurich" },
  { year: "2023", type: "experience", title: "Stage — Développement web", place: "Cabinet indépendant" },
  { year: "2022", type: "formation", title: "Baccalauréat, série Sciences", place: "Lycée [Nom]" },
];

const SKILLS = {
  Informatique: ["React", "Node.js", "PostgreSQL", "Python", "Git"],
  Droit: ["Rédaction contractuelle", "Veille juridique"],
  RH: ["Recrutement", "Communication interne"],
  Histoire: ["Recherche documentaire", "Analyse historique"],
};

const WORKS = [
  { id: "TRV-01", cat: "Informatique", title: "Plateforme de cours en ligne", desc: "Conception et développement de ce projet même — catalogue, paiement, vitrine." },
  { id: "TRV-02", cat: "Droit", title: "Note de synthèse — droit des contrats", desc: "Analyse comparée des clauses résolutoires en droit OHADA." },
  { id: "TRV-03", cat: "Informatique", title: "API de gestion de bibliothèque", desc: "API REST avec authentification, développée en Node.js et PostgreSQL." },
  { id: "TRV-04", cat: "RH", title: "Étude — fidélisation des jeunes talents", desc: "Enquête et recommandations pour une PME locale." },
];

const MENTORING_OPTIONS = [
  { id: "MEN-30", duration: "30 min", desc: "Une question précise, un blocage à débloquer rapidement.", price: 8000 },
  { id: "MEN-60", duration: "60 min", desc: "Un accompagnement approfondi : projet, orientation, plan de progression.", price: 14000 },
];

const QA_SESSIONS = [
  { id: "QA-1", topic: "Bases de données & SQL", date: "Jeudi 6 août", time: "18h00 — 19h00", spots: 12 },
  { id: "QA-2", topic: "Droit des contrats — questions d'examen", date: "Mardi 11 août", time: "19h00 — 20h00", spots: 8 },
  { id: "QA-3", topic: "Orientation carrière en informatique", date: "Samedi 15 août", time: "10h00 — 11h00", spots: 20 },
];

const FILIERE_INFO = {
  Histoire: {
    intro: "Vous voici plongés dans l'étude du temps long : comprendre le présent à la lumière du passé.",
    levels: {
      L1: "Poser les bases : repères chronologiques et méthode historique.",
      L2: "Approfondir : civilisations, institutions et sociétés à travers les âges.",
      L3: "Analyser des enjeux contemporains à la lumière de l'histoire récente.",
    },
  },
  Droit: {
    intro: "Vos premiers pas dans le raisonnement juridique : rigueur, logique, argumentation.",
    levels: {
      L1: "Les fondations du droit : sources, institutions, vocabulaire juridique.",
      L2: "Le cœur de la matière : droit public et droit privé approfondis.",
      L3: "Spécialisation : droit appliqué à des situations professionnelles concrètes.",
    },
  },
  Informatique: {
    intro: "Vous voici en train de faire vos premiers pas en informatique. Prenez le temps d'apprendre les bases : elles vous serviront toute votre carrière.",
    levels: {
      L1: "Les fondamentaux : algorithmique et premiers langages de programmation.",
      L2: "Structurer sa pensée : structures de données, bases de données, programmation orientée objet.",
      L3: "Se spécialiser : data, analyse, projets concrets.",
      "Formation Pro": "Des compétences directement applicables en entreprise : outils, frameworks, bonnes pratiques.",
    },
    certification: "Cette filière peut t'orienter vers une certification professionnelle externe reconnue.",
  },
  RH: {
    intro: "Des compétences RH concrètes, pensées pour le terrain : recrutement, paie, gestion des équipes.",
    levels: {
      "Formation Pro": "Des modules pratiques, indépendants les uns des autres, à suivre selon tes besoins du moment.",
    },
  },
};

function formatPrice(price) {
  if (price === 0) return "Gratuit";
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
}

/* ------------------------------ NAV ------------------------------ */

function GlobalNav({ page, onNavigate, isAdmin, onToggleAdmin }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    { label: "Accueil", page: "accueil" },
    { label: "Catalogue de cours", page: "catalogue" },
    { label: "Accompagnement", page: "accompagnement" },
    { label: "À propos", page: "profil" },
    { label: "Contact", page: "contact" },
    ...(isAdmin ? [{ label: "Tableau de bord", page: "admin" }] : []),
  ];

  return (
    <div>
      <header className="flex items-center justify-between gap-4 px-4 md:px-8 py-3 border-b bg-white sticky top-0 z-40" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
            <Menu size={20} />
          </button>
          <button onClick={() => onNavigate("accueil")} className="flex items-center gap-2" aria-label="Meredian — accueil">
            <img src={LOGO_DATA_URI} alt="Meredian" className="w-8 h-8 rounded-full object-cover" />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-md flex-1 max-w-md" style={{ background: "#F3F4F6" }}>
          <Search size={16} style={{ color: "#6B7280" }} />
          <input placeholder="Rechercher un cours" className="bg-transparent outline-none text-sm w-full" />
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => onNavigate(link.page)}
              className="text-sm font-medium transition-colors"
              style={{ color: page === link.page ? "#0056D2" : "#374151" }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={onToggleAdmin}
            className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border"
            style={{
              borderColor: isAdmin ? "#0056D2" : "#D1D5DB",
              background: isAdmin ? "#EFF6FF" : "white",
              color: isAdmin ? "#0056D2" : "#6B7280",
            }}
            title="Bascule de démonstration — dans le vrai site, le rôle est vérifié côté serveur"
          >
            <LayoutDashboard size={12} /> Vue {isAdmin ? "Admin" : "Utilisateur"}
          </button>
          <button aria-label="Notifications" className="relative">
            <Bell size={19} style={{ color: "#374151" }} />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center" style={{ background: "#DC2626" }}>2</span>
          </button>
          <button onClick={() => onNavigate("profil")} className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ background: "#0056D2" }}>J</div>
            <ChevronDown size={14} style={{ color: "#6B7280" }} />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="md:hidden bg-white border-b flex flex-col" style={{ borderColor: "#E5E7EB" }}>
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => { onNavigate(link.page); setMobileOpen(false); }}
              className="px-4 py-3 text-sm font-medium text-left border-t"
              style={{ color: "#374151", borderColor: "#E5E7EB" }}
            >
              {link.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------------- CATALOGUE --------------------------- */

/* ---------------------------- ACCUEIL ---------------------------- */

function HomePage({ onOpenCourse, onNavigate }) {
  const featured = COURSES.filter((c) => c.free).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="px-4 md:px-8 py-12 md:py-16 bg-white border-b" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex flex-col md:flex-row items-center gap-10 max-w-5xl mx-auto">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
              Apprends l'Histoire, le Droit, l'Informatique et les RH — à ton rythme, avec un accompagnement humain.
            </h1>
            <p className="mt-4 text-base" style={{ color: "#6B7280" }}>
              Des cours clairs, du contenu gratuit pour démarrer, et un accompagnement personnel
              (mentorat, corrections, sessions en direct) quand tu veux aller plus loin.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <button onClick={() => onNavigate("catalogue")} className="text-sm font-medium px-5 py-3 rounded-md text-white" style={{ background: "#0056D2" }}>
                Explorer le catalogue
              </button>
              <button onClick={() => onNavigate("accompagnement")} className="text-sm font-medium px-5 py-3 rounded-md border" style={{ borderColor: "#D1D5DB", color: "#374151" }}>
                Découvrir l'accompagnement
              </button>
            </div>
          </div>
          <div className="w-full md:w-80 aspect-video shrink-0 rounded-lg flex items-center justify-center relative overflow-hidden" style={{ background: "#1A1A1A" }}>
            <PlayCircle size={40} style={{ color: "white" }} />
            <span className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded-full text-white" style={{ background: "rgba(255,255,255,0.15)" }}>
              Pitch — 45 sec
            </span>
          </div>
        </div>
      </section>

      {/* Featured free courses */}
      <section className="px-4 md:px-8 py-10 bg-white border-b" style={{ borderColor: "#E5E7EB" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Pour commencer, gratuitement</p>
            <button onClick={() => onNavigate("catalogue")} className="text-sm font-medium" style={{ color: "#0056D2" }}>Voir tout le catalogue →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured.map((course) => {
              const cat = CATEGORIES[course.cat];
              return (
                <button
                  key={course.id}
                  onClick={() => onOpenCourse(course)}
                  className="text-left rounded-lg border p-4 flex flex-col gap-2 hover:shadow-md transition-shadow"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  <span className="text-xs font-medium px-2 py-1 rounded-full w-fit" style={{ background: cat.tint, color: cat.text }}>{course.cat}</span>
                  <p className="font-semibold text-base">{course.title}</p>
                  <p className="text-sm" style={{ color: "#6B7280" }}>{course.desc}</p>
                  <span className="text-xs font-semibold mt-1" style={{ color: "#059669" }}>Gratuit</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Accompagnement teaser */}
      <section className="px-4 md:px-8 py-10 bg-white border-b" style={{ borderColor: "#E5E7EB" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wide mb-5" style={{ color: "#6B7280" }}>Au-delà des cours</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Users, title: "Mentorat 1-à-1", desc: "Un créneau individuel pour débloquer ce qui te bloque vraiment." },
              { icon: FileCheck2, title: "Correction de travaux", desc: "Un retour détaillé sur tes devoirs, mémoires ou projets." },
              { icon: Radio, title: "Sessions Q&R en direct", desc: "Pose tes questions en direct, gratuitement, en petit groupe." },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border p-4" style={{ borderColor: "#E5E7EB" }}>
                <item.icon size={20} style={{ color: "#0056D2" }} />
                <p className="font-semibold text-base mt-2">{item.title}</p>
                <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{item.desc}</p>
              </div>
            ))}
          </div>
          <button onClick={() => onNavigate("accompagnement")} className="mt-5 text-sm font-medium" style={{ color: "#0056D2" }}>
            Voir l'accompagnement en détail →
          </button>
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-4 md:px-8 py-10 bg-white">
        <div className="max-w-5xl mx-auto rounded-lg border p-6 flex flex-col md:flex-row items-start md:items-center gap-4" style={{ borderColor: "#E5E7EB" }}>
          <div className="flex items-center gap-1 shrink-0" style={{ color: "#F59E0B" }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#F59E0B" strokeWidth={0} />)}
          </div>
          <div>
            <p className="text-sm" style={{ color: "#374151" }}>
              « Le mentorat m'a fait gagner des mois sur mon projet — bien plus efficace qu'un cours seul. »
            </p>
            <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>— Aïcha K., étudiante L3</p>
          </div>
        </div>
      </section>

      <footer className="px-4 md:px-8 py-6 flex items-center gap-2 border-t" style={{ borderColor: "#E5E7EB" }}>
        <img src={LOGO_DATA_URI} alt="Meredian" className="w-6 h-6 rounded-full object-cover" />
        <span className="text-sm" style={{ color: "#9CA3AF" }}>Meredian</span>
      </footer>
    </div>
  );
}

function CatalogPage({ onOpenCourse }) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("Tous");
  const [activeLevel, setActiveLevel] = useState("Tous");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return COURSES.filter((c) => {
      const matchCat = activeCat === "Tous" || c.cat === activeCat;
      const matchLevel = activeLevel === "Tous" || c.level === activeLevel;
      const matchQuery = query.trim() === "" ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.desc.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchLevel && matchQuery;
    });
  }, [query, activeCat, activeLevel]);

  return (
    <div>
      <header className="px-4 md:px-8 pt-10 pb-6 bg-white border-b" style={{ borderColor: "#E5E7EB" }}>
        <h1 className="text-2xl md:text-3xl font-semibold">Catalogue de cours</h1>
        <p className="mt-1.5 text-sm" style={{ color: "#6B7280" }}>
          Histoire, Droit, Informatique et Ressources Humaines — {COURSES.length} cours disponibles, gratuits et payants.
        </p>
      </header>

      <div className="px-4 md:px-8 py-5 flex flex-col gap-4 bg-white border-b" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveCat("Tous")} className="text-sm font-medium px-3 py-1.5 rounded-full border transition-colors"
              style={{ borderColor: activeCat === "Tous" ? "#0056D2" : "#D1D5DB", background: activeCat === "Tous" ? "#0056D2" : "white", color: activeCat === "Tous" ? "white" : "#374151" }}>
              Toutes matières
            </button>
            {Object.entries(CATEGORIES).map(([name, c]) => (
              <button key={name} onClick={() => setActiveCat(name)} className="text-sm font-medium px-3 py-1.5 rounded-full border transition-colors"
                style={{ borderColor: activeCat === name ? c.color : "#D1D5DB", background: activeCat === name ? c.color : "white", color: activeCat === name ? "white" : "#374151" }}>
                {name}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md border" style={{ borderColor: "#D1D5DB", background: "#F9FAFB", maxWidth: 280 }}>
            <Search size={16} style={{ color: "#9CA3AF" }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un cours" className="bg-transparent outline-none text-sm w-full" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-medium" style={{ color: "#9CA3AF" }}>Niveau :</span>
          <button onClick={() => setActiveLevel("Tous")} className="text-xs font-medium px-2.5 py-1 rounded-full border"
            style={{ borderColor: "#D1D5DB", background: activeLevel === "Tous" ? "#374151" : "white", color: activeLevel === "Tous" ? "white" : "#6B7280" }}>
            Tous
          </button>
          {LEVELS.map((lvl) => (
            <button key={lvl} onClick={() => setActiveLevel(lvl)} className="text-xs font-medium px-2.5 py-1 rounded-full border"
              style={{ borderColor: "#D1D5DB", background: activeLevel === lvl ? "#374151" : "white", color: activeLevel === lvl ? "white" : "#6B7280" }}>
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {activeCat !== "Tous" && FILIERE_INFO[activeCat] && (
        <div className="px-4 md:px-8 py-6 bg-white border-b" style={{ borderColor: "#E5E7EB" }}>
          <div className="flex flex-col md:flex-row gap-5">
            <div
              className="w-full md:w-56 aspect-video md:aspect-square shrink-0 rounded-lg flex items-center justify-center"
              style={{ background: "#1A1A1A" }}
            >
              <PlayCircle size={36} style={{ color: "white" }} />
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: CATEGORIES[activeCat].tint, color: CATEGORIES[activeCat].text }}>
                {activeCat}
              </span>
              <p className="text-sm mt-2 max-w-2xl" style={{ color: "#374151" }}>{FILIERE_INFO[activeCat].intro}</p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(FILIERE_INFO[activeCat].levels).map(([lvl, text]) => (
                  <div key={lvl} className="rounded-md border p-3" style={{ borderColor: "#E5E7EB" }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: "#0056D2" }}>{lvl}</p>
                    <p className="text-xs" style={{ color: "#6B7280" }}>{text}</p>
                  </div>
                ))}
              </div>

              {FILIERE_INFO[activeCat].certification && (
                <div className="mt-4 flex items-center gap-2 text-xs px-3 py-2 rounded-md" style={{ background: "#EFF6FF", color: "#1E40AF" }}>
                  <ExternalLink size={13} />
                  {FILIERE_INFO[activeCat].certification}
                  <a href="#" className="underline font-medium ml-1">Voir la certification</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="px-4 md:px-8 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <p className="text-sm py-10 text-center col-span-full" style={{ color: "#9CA3AF" }}>Aucun cours ne correspond à cette recherche.</p>
        )}
        {filtered.map((course) => {
          const cat = CATEGORIES[course.cat];
          return (
            <button key={course.id} onClick={() => setSelected(course)} className="text-left rounded-lg border bg-white p-4 flex flex-col gap-3 hover:shadow-md transition-shadow" style={{ borderColor: "#E5E7EB" }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: cat.tint, color: cat.text }}>{course.cat}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded border" style={{ borderColor: "#D1D5DB", color: "#6B7280" }}>{course.level}</span>
              </div>
              <h3 className="font-semibold text-base leading-snug">{course.title}</h3>
              <p className="text-sm flex-1" style={{ color: "#6B7280" }}>{course.desc}</p>
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "#F3F4F6" }}>
                <span className="text-xs flex items-center gap-1" style={{ color: "#9CA3AF" }}><Clock size={12} /> {course.duration}</span>
                <span className="text-xs font-semibold flex items-center gap-1" style={{ color: course.free ? "#059669" : "#1A1A1A" }}>
                  {course.free ? <Unlock size={12} /> : <Lock size={12} />}
                  {formatPrice(course.price)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-50" style={{ background: "rgba(17,24,39,0.5)" }} onClick={() => setSelected(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-w-lg w-full rounded-lg bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#E5E7EB" }}>
              <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: CATEGORIES[selected.cat].tint, color: CATEGORIES[selected.cat].text }}>
                {selected.cat} · {selected.level}
              </span>
              <button onClick={() => setSelected(null)} aria-label="Fermer"><X size={18} style={{ color: "#6B7280" }} /></button>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold">{selected.title}</h2>
              <p className="mt-3 text-sm" style={{ color: "#6B7280" }}>{selected.desc}</p>
              <div className="flex gap-4 mt-5 text-xs" style={{ color: "#9CA3AF" }}>
                <span className="flex items-center gap-1"><BarChart3 size={13} /> {selected.level}</span>
                <span className="flex items-center gap-1"><Clock size={13} /> {selected.duration}</span>
              </div>
              <button
                onClick={() => { onOpenCourse(selected); setSelected(null); }}
                className="mt-6 w-full py-3 rounded-md font-medium text-sm text-white"
                style={{ background: "#0056D2" }}
              >
                {selected.free ? "Accéder au cours" : `Acheter — ${formatPrice(selected.price)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="px-4 md:px-8 py-6 flex items-center justify-between border-t bg-white" style={{ borderColor: "#E5E7EB" }}>
        <p className="text-xs" style={{ color: "#9CA3AF" }}>{COURSES.length} cours au catalogue</p>
        <a href="#" className="text-xs font-medium flex items-center gap-1.5" style={{ color: "#0056D2" }}><Mail size={13} /> Me contacter</a>
      </footer>
    </div>
  );
}

/* ------------------------- LECTURE DE COURS ------------------------- */

function ModuleIcon({ status }) {
  if (status === "done") return <CheckCircle2 size={16} style={{ color: "#059669" }} />;
  if (status === "locked") return <Lock size={13} style={{ color: "#D1D5DB" }} />;
  return <Circle size={16} style={{ color: "#0056D2" }} />;
}

function SectionIcon({ type }) {
  if (type === "video") return <PlayCircle size={14} />;
  if (type === "image") return <ImageIcon size={14} />;
  if (type === "quiz") return <ClipboardCheck size={14} />;
  return <FileText size={14} />;
}

function CoursePlayerPage({ course, onBack }) {
  const modules = MODULES_BY_COURSE[course.id] || DEMO_MODULES;
  const [openModule, setOpenModule] = useState(modules.find((m) => m.status === "current")?.id || modules[0]?.id);
  const cat = CATEGORIES[course.cat];
  const currentModule = modules.find((m) => m.status === "current") || modules[0];

  return (
    <div>
      <div className="flex items-center justify-between px-4 md:px-8 py-3 bg-white border-b" style={{ borderColor: "#E5E7EB" }}>
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium" style={{ color: "#6B7280" }}>
          <ArrowLeft size={15} /> Retour au catalogue
        </button>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: cat.tint, color: cat.text }}>
          {course.cat} · {course.level}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row">
        <aside className="w-full lg:w-72 shrink-0 bg-white border-r" style={{ borderColor: "#E5E7EB" }}>
          <div className="p-5 border-b" style={{ borderColor: "#E5E7EB" }}>
            <h2 className="font-semibold text-base leading-snug">{course.title}</h2>
          </div>
          <nav className="py-2">
            {modules.map((mod, i) => {
              const isOpen = openModule === mod.id;
              const isLocked = mod.status === "locked";
              return (
                <div key={mod.id} className="border-b" style={{ borderColor: "#F3F4F6" }}>
                  <button disabled={isLocked} onClick={() => setOpenModule(isOpen ? null : mod.id)} className="w-full flex items-center justify-between px-5 py-3 text-left" style={{ opacity: isLocked ? 0.5 : 1 }}>
                    <span className="flex items-center gap-2.5 text-sm">
                      <ModuleIcon status={mod.status} />
                      <span style={{ fontWeight: mod.status === "current" ? 600 : 500 }}>Module {i + 1} — {mod.title}</span>
                    </span>
                    {!isLocked && <ChevronDown size={14} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s", color: "#9CA3AF" }} />}
                  </button>
                  {isOpen && !isLocked && (
                    <div className="pb-3 pl-11 pr-4 flex flex-col gap-2">
                      {mod.sections.map((s, si) => (
                        <div key={si} className="flex items-center gap-2 text-xs" style={{ color: "#6B7280" }}>
                          <SectionIcon type={s.type} />
                          <span className="flex-1">{s.title}</span>
                          {s.practical && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: "#FEF3C7", color: "#92400E" }}>Pratique</span>
                          )}
                          <span style={{ color: "#9CA3AF" }}>{s.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 px-4 md:px-10 py-8 max-w-3xl">
          <p className="text-xs font-medium" style={{ color: "#9CA3AF" }}>
            {currentModule.title.toUpperCase()} · {currentModule.sections[0].title}
          </p>
          <h1 className="text-2xl font-semibold mt-2">{currentModule.sections[0].title}</h1>
          <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: "#6B7280" }}>
            <span className="flex items-center gap-1"><SectionIcon type={currentModule.sections[0].type} /> {currentModule.sections[0].duration}</span>
            {currentModule.sections[0].practical && (
              <span className="font-medium px-2 py-0.5 rounded-full" style={{ background: "#FEF3C7", color: "#92400E" }}>Vidéo pratique obligatoire</span>
            )}
          </div>

          {currentModule.sections[0].type === "video" && (
            <div className="mt-6 aspect-video rounded-lg flex items-center justify-center" style={{ background: "#1A1A1A" }}>
              <PlayCircle size={48} style={{ color: "white" }} />
            </div>
          )}

          {currentModule.sections[0].type === "image" && (
            <div className="mt-6 grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square rounded-md flex items-center justify-center" style={{ background: "#E5E7EB" }}>
                  <ImageIcon size={22} style={{ color: "#9CA3AF" }} />
                </div>
              ))}
            </div>
          )}

          {currentModule.sections[0].type === "quiz" && (
            <div className="mt-6 rounded-lg border p-6" style={{ borderColor: "#E5E7EB", background: "#F9FAFB" }}>
              <p className="text-sm font-medium flex items-center gap-2"><ClipboardCheck size={16} style={{ color: "#0056D2" }} /> Évaluation notée</p>
              <p className="text-sm mt-2" style={{ color: "#6B7280" }}>Les questions de cette évaluation apparaîtront ici une fois le contenu rédigé.</p>
            </div>
          )}

          <p className="mt-6 text-sm leading-relaxed" style={{ color: "#374151" }}>{course.desc}</p>

          <button className="mt-6 flex items-center gap-2 text-sm font-medium" style={{ color: "#0056D2" }}>
            <ChevronDown size={14} /> Afficher les objectifs d'apprentissage
          </button>

          <a
            href="#"
            className="mt-4 flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-md border w-fit"
            style={{ borderColor: "#D1D5DB", color: "#374151" }}
          >
            <FileDown size={15} /> Télécharger le support PDF du cours
          </a>

          {course.cat === "Informatique" && (
            <div className="mt-6 flex items-center gap-2 text-xs px-3 py-2.5 rounded-md" style={{ background: "#EFF6FF", color: "#1E40AF" }}>
              <ExternalLink size={13} />
              En fin de parcours, tu seras orienté vers une certification professionnelle externe si tu souhaites aller plus loin.
              <a href="#" className="underline font-medium ml-1">En savoir plus</a>
            </div>
          )}
        </main>

        <aside className="w-full lg:w-80 shrink-0 px-4 md:px-6 py-8 flex flex-col gap-5">
          {course.free ? (
            <div className="rounded-lg p-5 text-white" style={{ background: "#059669" }}>
              <p className="text-lg font-semibold">Ce cours est gratuit</p>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                {["Accès à toutes les vidéos et exercices", "Support de cours téléchargeable", "Aucune inscription payante requise"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={15} style={{ marginTop: 2, flexShrink: 0, color: "#A7F3D0" }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-5 w-full py-2.5 rounded-md font-medium text-sm" style={{ background: "white", color: "#059669" }}>Accéder au cours</button>
            </div>
          ) : (
            <div className="rounded-lg p-5 text-white" style={{ background: "#0056D2" }}>
              <p className="text-lg font-semibold">Débloquer le cours complet</p>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                {["Accès à tous les modules et exercices notés", "Support de cours téléchargeable", "Suivi de ta progression"].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={15} style={{ marginTop: 2, flexShrink: 0, color: "#93C5FD" }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xl font-semibold mt-5">{formatPrice(course.price)}</p>
              <button className="mt-4 w-full py-2.5 rounded-md font-medium text-sm" style={{ background: "white", color: "#0056D2" }}>Acheter via Naboopay</button>
            </div>
          )}
          <div className="rounded-lg p-5 bg-white border" style={{ borderColor: "#E5E7EB" }}>
            <div className="flex items-center gap-1 mb-2" style={{ color: "#F59E0B" }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#F59E0B" strokeWidth={0} />)}
            </div>
            <p className="text-sm" style={{ color: "#374151" }}>« Ce cours m'a aidé à comprendre des notions que je bloquais depuis longtemps. »</p>
            <p className="text-xs mt-3" style={{ color: "#9CA3AF" }}>— Aïcha K., étudiante L3</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------- ACCOMPAGNEMENT ------------------------- */

function SupportPage() {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [uploadNote, setUploadNote] = useState("");

  return (
    <div>
      <header className="px-4 md:px-8 pt-10 pb-6 bg-white border-b" style={{ borderColor: "#E5E7EB" }}>
        <h1 className="text-2xl md:text-3xl font-semibold">Accompagnement personnel</h1>
        <p className="mt-1.5 text-sm max-w-2xl" style={{ color: "#6B7280" }}>
          Au-delà des cours, un suivi individuel pour avancer plus vite : mentorat, retours sur tes
          travaux, et sessions de questions en direct.
        </p>
      </header>

      <section className="px-4 md:px-8 py-8 bg-white border-b" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex items-center gap-2 mb-1">
          <Users size={18} style={{ color: "#0056D2" }} />
          <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Mentorat 1-à-1</p>
        </div>
        <p className="text-sm mb-5" style={{ color: "#6B7280" }}>Réserve un créneau individuel, en visio, pour avancer sur ce qui te bloque vraiment.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MENTORING_OPTIONS.map((opt) => (
            <div key={opt.id} className="rounded-lg border p-5 flex flex-col gap-3" style={{ borderColor: "#E5E7EB" }}>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#374151" }}>
                  <Clock size={14} /> {opt.duration}
                </span>
                <span className="text-lg font-semibold">{formatPrice(opt.price)}</span>
              </div>
              <p className="text-sm" style={{ color: "#6B7280" }}>{opt.desc}</p>
              <button
                onClick={() => setSelectedSlot(opt)}
                className="mt-1 flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-md text-white"
                style={{ background: "#0056D2" }}
              >
                Réserver ce créneau <ArrowUpRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-8 py-8 bg-white border-b" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex items-center gap-2 mb-1">
          <FileCheck2 size={18} style={{ color: "#0056D2" }} />
          <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Correction de travaux</p>
        </div>
        <p className="text-sm mb-5" style={{ color: "#6B7280" }}>
          Envoie un devoir, un mémoire, un projet de code ou une note de synthèse : retour détaillé sous 48h.
        </p>

        <div className="rounded-lg border p-5 max-w-xl" style={{ borderColor: "#E5E7EB" }}>
          <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center gap-2 text-center" style={{ borderColor: "#D1D5DB" }}>
            <FileCheck2 size={22} style={{ color: "#9CA3AF" }} />
            <p className="text-sm font-medium">Dépose ton fichier ici</p>
            <p className="text-xs" style={{ color: "#9CA3AF" }}>PDF, Word, ou fichier de code — 10 Mo max</p>
          </div>
          <textarea
            value={uploadNote}
            onChange={(e) => setUploadNote(e.target.value)}
            placeholder="Un mot sur ce que tu attends de cette correction…"
            rows={3}
            className="mt-3 w-full px-3 py-2.5 rounded-md border text-sm outline-none resize-none"
            style={{ borderColor: "#D1D5DB" }}
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm font-semibold">6 000 FCFA / correction</span>
            <button className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-md text-white" style={{ background: "#0056D2" }}>
              Envoyer pour correction
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 py-8 bg-white">
        <div className="flex items-center gap-2 mb-1">
          <Radio size={18} style={{ color: "#0056D2" }} />
          <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Sessions Q&amp;R en direct</p>
        </div>
        <p className="text-sm mb-5" style={{ color: "#6B7280" }}>
          Des créneaux collectifs en visio pour poser tes questions en direct, gratuits pour les inscrits.
        </p>

        <div className="flex flex-col gap-3">
          {QA_SESSIONS.map((s) => (
            <div key={s.id} className="rounded-lg border p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-6" style={{ borderColor: "#E5E7EB" }}>
              <div className="flex items-center gap-2 text-sm font-medium w-full md:w-48 shrink-0" style={{ color: "#374151" }}>
                <Calendar size={14} style={{ color: "#0056D2" }} /> {s.date}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{s.topic}</p>
                <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{s.time} · {s.spots} places restantes</p>
              </div>
              <button className="text-sm font-medium px-4 py-2 rounded-md border shrink-0" style={{ borderColor: "#0056D2", color: "#0056D2" }}>
                S'inscrire
              </button>
            </div>
          ))}
        </div>
      </section>

      {selectedSlot && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-50" style={{ background: "rgba(17,24,39,0.5)" }} onClick={() => setSelectedSlot(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-w-sm w-full rounded-lg bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#E5E7EB" }}>
              <span className="text-sm font-semibold">Réserver — {selectedSlot.duration}</span>
              <button onClick={() => setSelectedSlot(null)}><X size={18} style={{ color: "#6B7280" }} /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm mb-4" style={{ color: "#059669" }}>
                <CheckCircle2 size={16} /> Créneau disponible cette semaine
              </div>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Tu seras redirigé vers le paiement Naboopay, puis tu recevras un lien de visio après confirmation.
              </p>
              <button className="mt-5 w-full py-3 rounded-md font-medium text-sm text-white" style={{ background: "#0056D2" }}>
                Continuer — {formatPrice(selectedSlot.price)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------- PROFIL ---------------------------- */

function ProfilePage({ onNavigate }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <div>
      <header className="px-4 md:px-8 pt-12 pb-8 bg-white border-b" style={{ borderColor: "#E5E7EB" }}>
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div
            className="w-full md:w-56 aspect-video shrink-0 rounded-lg flex items-center justify-center relative overflow-hidden"
            style={{ background: "#1A1A1A" }}
          >
            <PlayCircle size={40} style={{ color: "white" }} />
            <span className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded-full text-white" style={{ background: "rgba(255,255,255,0.15)" }}>
              Pitch — 45 sec
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-semibold">[Ton nom]</h1>
            <p className="mt-2 text-base max-w-xl" style={{ color: "#6B7280" }}>
              Étudiant en Génie Informatique, formateur en Histoire, Droit, Informatique et RH.
              Je construis des ponts entre disciplines — et cette plateforme en est le reflet.
            </p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm" style={{ color: "#9CA3AF" }}>
              <span className="flex items-center gap-1"><MapPin size={14} /> Zurich, Suisse</span>
              <span className="flex items-center gap-1"><Mail size={14} /> contact@exemple.com</span>
            </div>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-md text-white shrink-0" style={{ background: "#0056D2" }}>
            <Download size={15} /> Télécharger le CV
          </button>
        </div>
      </header>

      <section className="px-4 md:px-8 py-8 bg-white border-b" style={{ borderColor: "#E5E7EB" }}>
        <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Parcours</p>
        <div className="mt-4 flex flex-col">
          {TIMELINE.map((item, i) => (
            <div key={i} className="flex gap-4 md:gap-8 py-3.5 border-t" style={{ borderColor: "#F3F4F6" }}>
              <span className="text-xs w-28 shrink-0 pt-1" style={{ color: "#9CA3AF" }}>{item.year}</span>
              <div className="flex items-start gap-3">
                {item.type === "formation" ? <GraduationCap size={16} className="mt-0.5" style={{ color: "#1D4ED8" }} /> : <Briefcase size={16} className="mt-0.5" style={{ color: "#059669" }} />}
                <div>
                  <p className="font-medium text-base">{item.title}</p>
                  <p className="text-sm" style={{ color: "#6B7280" }}>{item.place}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-8 py-8 bg-white border-b" style={{ borderColor: "#E5E7EB" }}>
        <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Compétences</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
          {Object.entries(SKILLS).map(([cat, skills]) => (
            <div key={cat}>
              <p className="text-xs font-semibold mb-2" style={{ color: CATEGORIES[cat].text }}>{cat.toUpperCase()}</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s} className="text-sm px-3 py-1.5 rounded-full" style={{ background: CATEGORIES[cat].tint, color: CATEGORIES[cat].text }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 md:px-8 py-8 bg-white border-b" style={{ borderColor: "#E5E7EB" }}>
        <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Travaux et réalisations</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {WORKS.map((w) => {
            const cat = CATEGORIES[w.cat];
            return (
              <a key={w.id} href="#" className="rounded-lg border p-4 hover:shadow-md transition-shadow flex flex-col gap-2" style={{ borderColor: "#E5E7EB" }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: cat.tint, color: cat.text }}>{w.cat}</span>
                  <ArrowUpRight size={15} style={{ color: "#9CA3AF" }} />
                </div>
                <p className="font-semibold text-base">{w.title}</p>
                <p className="text-sm" style={{ color: "#6B7280" }}>{w.desc}</p>
              </a>
            );
          })}
        </div>
      </section>

      <section className="px-4 md:px-8 py-8 bg-white flex items-center justify-between">
        <p className="text-sm" style={{ color: "#6B7280" }}>Une question, un projet en tête ?</p>
        <button onClick={() => onNavigate("contact")} className="text-sm font-medium px-4 py-2 rounded-md border" style={{ borderColor: "#0056D2", color: "#0056D2" }}>
          Voir la page Contact
        </button>
      </section>

      <footer className="px-4 md:px-8 py-5 border-t text-xs bg-white" style={{ borderColor: "#E5E7EB", color: "#9CA3AF" }}>© 2026 — [Ton nom]</footer>
    </div>
  );
}

/* ---------------------------- CONTACT ---------------------------- */

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <div>
      <header className="px-4 md:px-8 pt-10 pb-6 bg-white border-b" style={{ borderColor: "#E5E7EB" }}>
        <h1 className="text-2xl md:text-3xl font-semibold">Contact</h1>
        <p className="mt-1.5 text-sm max-w-xl" style={{ color: "#6B7280" }}>
          Une question sur un cours, un projet de collaboration, ou juste envie d'échanger — écris-moi.
        </p>
      </header>

      <div className="px-4 md:px-8 py-8 bg-white flex flex-col md:flex-row gap-10">
        <div className="flex-1 max-w-lg flex flex-col gap-3">
          <input placeholder="Nom" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2.5 rounded-md border text-sm outline-none" style={{ borderColor: "#D1D5DB" }} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-3 py-2.5 rounded-md border text-sm outline-none" style={{ borderColor: "#D1D5DB" }} />
          <textarea placeholder="Message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="px-3 py-2.5 rounded-md border text-sm outline-none resize-none" style={{ borderColor: "#D1D5DB" }} />
          <button className="flex items-center justify-center gap-2 text-sm font-medium px-4 py-3 rounded-md text-white self-start" style={{ background: "#0056D2" }}>
            <Send size={14} /> Envoyer
          </button>
        </div>

        <div className="w-full md:w-64 shrink-0 flex flex-col gap-4">
          <div className="rounded-lg border p-4" style={{ borderColor: "#E5E7EB" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9CA3AF" }}>Coordonnées</p>
            <p className="text-sm flex items-center gap-2" style={{ color: "#374151" }}><Mail size={14} /> contact@exemple.com</p>
            <p className="text-sm flex items-center gap-2 mt-1.5" style={{ color: "#374151" }}><MapPin size={14} /> Zurich, Suisse</p>
          </div>
          <div className="rounded-lg border p-4" style={{ borderColor: "#E5E7EB" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#9CA3AF" }}>Délai de réponse</p>
            <p className="text-sm" style={{ color: "#374151" }}>Généralement sous 24 à 48h.</p>
          </div>
        </div>
      </div>

      <footer className="px-4 md:px-8 py-5 border-t text-xs bg-white" style={{ borderColor: "#E5E7EB", color: "#9CA3AF" }}>© 2026 — [Ton nom]</footer>
    </div>
  );
}

/* ---------------------------- ADMIN ---------------------------- */

function AdminPage() {
  const [courseList, setCourseList] = useState(COURSES);
  const [managingModules, setManagingModules] = useState(null); // course object
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({ title: "", cat: "Informatique", level: "L1", price: "", duration: "", free: false, desc: "", template: "Théorique illustré" });
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [adminModules, setAdminModules] = useState({}); // { [courseId]: modules[] }
  const [expandedModuleId, setExpandedModuleId] = useState(null);
  const [newSection, setNewSection] = useState({ title: "", type: "reading", practical: false, duration: "" });
  const [editingSection, setEditingSection] = useState(null); // { moduleId, index }

  function isSectionFilled(s) {
    if (s.type === "reading") return !!(s.body && s.body.trim());
    if (s.type === "video") return !!(s.videoUrl && s.videoUrl.trim());
    if (s.type === "image") return !!(s.photos && s.photos.length > 0);
    if (s.type === "quiz") return !!(s.questions && s.questions.length > 0);
    return false;
  }

  function saveSectionContent(moduleId, index, data) {
    setCurrentModuleList((list) =>
      list.map((m) => (m.id === moduleId ? { ...m, sections: m.sections.map((s, i) => (i === index ? { ...s, ...data } : s)) } : m))
    );
  }

  function openModuleManager(course) {
    setManagingModules(course);
    setExpandedModuleId(null);
    setAdminModules((prev) => {
      if (prev[course.id]) return prev;
      const base = MODULES_BY_COURSE[course.id] || DEMO_MODULES;
      return { ...prev, [course.id]: base.map((m) => ({ ...m, sections: [...m.sections] })) };
    });
  }

  const currentModuleList = managingModules ? adminModules[managingModules.id] || [] : [];

  function setCurrentModuleList(updater) {
    setAdminModules((prev) => ({ ...prev, [managingModules.id]: updater(prev[managingModules.id] || []) }));
  }

  function updateCourseField(id, field, value) {
    setCourseList(courseList.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  function toggleFree(id) {
    setCourseList(courseList.map((c) => (c.id === id ? { ...c, free: !c.free, price: !c.free ? 0 : c.price } : c)));
  }

  const stats = [
    { label: "Cours publiés", value: courseList.length, icon: BookOpen },
    { label: "Ventes ce mois", value: "37", icon: DollarSign },
    { label: "Revenu total", value: "412 000 FCFA", icon: DollarSign },
    { label: "Messages non lus", value: "5", icon: MailIcon },
  ];

  function handleAddCourse() {
    const id = `${CATEGORIES[newCourse.cat] ? newCourse.cat.slice(0, 3).toUpperCase() : "NEW"}-${Math.floor(Math.random() * 900 + 100)}`;
    setCourseList([{ ...newCourse, id, price: Number(newCourse.price) || 0 }, ...courseList]);
    setShowAddCourse(false);
    setNewCourse({ title: "", cat: "Informatique", level: "L1", price: "", duration: "", free: false, desc: "", template: "Théorique illustré" });
  }

  function handleSaveEdit() {
    setCourseList(courseList.map((c) => (c.id === editingCourse.id ? { ...editingCourse, price: Number(editingCourse.price) || 0 } : c)));
    setEditingCourse(null);
  }

  function handleAddModule() {
    if (!newModuleTitle.trim()) return;
    setCurrentModuleList((list) => [...list, { id: `m${list.length + 1}-${Date.now()}`, title: newModuleTitle, status: "locked", sections: [] }]);
    setNewModuleTitle("");
  }

  function removeModule(id) {
    setCurrentModuleList((list) => list.filter((m) => m.id !== id));
    if (expandedModuleId === id) setExpandedModuleId(null);
  }

  function handleAddSection(moduleId) {
    if (!newSection.title.trim()) return;
    setCurrentModuleList((list) =>
      list.map((m) =>
        m.id === moduleId
          ? { ...m, sections: [...m.sections, { ...newSection, practical: newSection.type === "video" ? newSection.practical : false }] }
          : m
      )
    );
    setNewSection({ title: "", type: "reading", practical: false, duration: "" });
  }

  function removeSection(moduleId, index) {
    setCurrentModuleList((list) =>
      list.map((m) => (m.id === moduleId ? { ...m, sections: m.sections.filter((_, i) => i !== index) } : m))
    );
  }

  return (
    <div>
      <header className="px-4 md:px-8 pt-10 pb-6 bg-white border-b" style={{ borderColor: "#E5E7EB" }}>
        <h1 className="text-2xl md:text-3xl font-semibold">Tableau de bord</h1>
        <p className="mt-1.5 text-sm" style={{ color: "#6B7280" }}>
          Vue réservée au propriétaire de la plateforme — invisible pour les utilisateurs normaux.
        </p>
      </header>

      {/* Stats */}
      <div className="px-4 md:px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white border-b" style={{ borderColor: "#E5E7EB" }}>
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border p-4" style={{ borderColor: "#E5E7EB" }}>
            <div className="flex items-center gap-2 mb-1" style={{ color: "#9CA3AF" }}>
              <s.icon size={14} />
              <span className="text-xs font-medium">{s.label}</span>
            </div>
            <p className="text-xl font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Course management */}
      <div className="px-4 md:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: "#6B7280" }}>Gestion des cours</p>
          <button
            onClick={() => setShowAddCourse(true)}
            className="flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-md text-white"
            style={{ background: "#0056D2" }}
          >
            <Plus size={14} /> Ajouter un cours
          </button>
        </div>

        <div className="rounded-lg border overflow-hidden bg-white" style={{ borderColor: "#E5E7EB" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "#F9FAFB" }}>
                <th className="text-left px-4 py-2.5 font-medium" style={{ color: "#6B7280" }}>Cours</th>
                <th className="text-left px-4 py-2.5 font-medium" style={{ color: "#6B7280" }}>Matière</th>
                <th className="text-left px-4 py-2.5 font-medium" style={{ color: "#6B7280" }}>Niveau</th>
                <th className="text-left px-4 py-2.5 font-medium" style={{ color: "#6B7280" }}>Statut</th>
                <th className="text-left px-4 py-2.5 font-medium" style={{ color: "#6B7280" }}>Prix (FCFA)</th>
                <th className="text-right px-4 py-2.5 font-medium" style={{ color: "#6B7280" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courseList.slice(0, 8).map((c) => (
                <tr key={c.id} className="border-t" style={{ borderColor: "#F3F4F6" }}>
                  <td className="px-4 py-2.5">{c.title}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: CATEGORIES[c.cat]?.tint, color: CATEGORIES[c.cat]?.text }}>{c.cat}</span>
                  </td>
                  <td className="px-4 py-2.5" style={{ color: "#6B7280" }}>{c.level}</td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => toggleFree(c.id)}
                      className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full border"
                      style={{
                        borderColor: c.free ? "#059669" : "#D1D5DB",
                        background: c.free ? "#D1FAE5" : "white",
                        color: c.free ? "#047857" : "#6B7280",
                      }}
                      title="Cliquer pour basculer gratuit / payant"
                    >
                      {c.free ? <Unlock size={11} /> : <Lock size={11} />} {c.free ? "Gratuit" : "Payant"}
                    </button>
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="number"
                      disabled={c.free}
                      value={c.free ? 0 : c.price}
                      onChange={(e) => updateCourseField(c.id, "price", Number(e.target.value) || 0)}
                      className="w-24 px-2 py-1.5 rounded-md border text-sm outline-none"
                      style={{ borderColor: "#D1D5DB", background: c.free ? "#F3F4F6" : "white", color: c.free ? "#9CA3AF" : "#1A1A1A" }}
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openModuleManager(c)} className="text-xs font-medium" style={{ color: "#0056D2" }}>Modules</button>
                      <button onClick={() => setEditingCourse({ ...c })} aria-label="Modifier" style={{ color: "#9CA3AF" }}><Pencil size={14} /></button>
                      <button
                        aria-label="Supprimer"
                        onClick={() => setCourseList(courseList.filter((x) => x.id !== c.id))}
                        style={{ color: "#9CA3AF" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>Affichage des 8 premiers cours sur {courseList.length} — pagination à prévoir sur le vrai site.</p>
      </div>

      {/* Add course modal */}
      {showAddCourse && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-50" style={{ background: "rgba(17,24,39,0.5)" }} onClick={() => setShowAddCourse(false)}>
          <div onClick={(e) => e.stopPropagation()} className="max-w-lg w-full rounded-lg bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#E5E7EB" }}>
              <span className="text-sm font-semibold">Ajouter un cours</span>
              <button type="button" onClick={() => setShowAddCourse(false)}><X size={18} style={{ color: "#6B7280" }} /></button>
            </div>
            <div className="p-6 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
              <input required placeholder="Titre du cours" value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} className="px-3 py-2.5 rounded-md border text-sm outline-none" style={{ borderColor: "#D1D5DB" }} />
              <div className="grid grid-cols-2 gap-3">
                <select value={newCourse.cat} onChange={(e) => setNewCourse({ ...newCourse, cat: e.target.value })} className="px-3 py-2.5 rounded-md border text-sm outline-none" style={{ borderColor: "#D1D5DB" }}>
                  {Object.keys(CATEGORIES).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={newCourse.level} onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })} className="px-3 py-2.5 rounded-md border text-sm outline-none" style={{ borderColor: "#D1D5DB" }}>
                  {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium" style={{ color: "#6B7280" }}>Modèle de cours</label>
                <select value={newCourse.template} onChange={(e) => setNewCourse({ ...newCourse, template: e.target.value })} className="mt-1 w-full px-3 py-2.5 rounded-md border text-sm outline-none" style={{ borderColor: "#D1D5DB" }}>
                  <option value="Théorique illustré">Théorique illustré (texte + photos)</option>
                  <option value="Pratique guidée">Pratique guidée (vidéo obligatoire)</option>
                  <option value="Mixte">Mixte</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Prix (FCFA)" type="number" disabled={newCourse.free} value={newCourse.free ? 0 : newCourse.price} onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })} className="px-3 py-2.5 rounded-md border text-sm outline-none" style={{ borderColor: "#D1D5DB", background: newCourse.free ? "#F3F4F6" : "white", color: newCourse.free ? "#9CA3AF" : "#1A1A1A" }} />
                <input placeholder="Durée (ex: 5h)" value={newCourse.duration} onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })} className="px-3 py-2.5 rounded-md border text-sm outline-none" style={{ borderColor: "#D1D5DB" }} />
              </div>
              <label className="flex items-center gap-2 text-sm" style={{ color: "#374151" }}>
                <input type="checkbox" checked={newCourse.free} onChange={(e) => setNewCourse({ ...newCourse, free: e.target.checked, price: e.target.checked ? 0 : newCourse.price })} />
                Cours gratuit
              </label>
              <textarea placeholder="Description" rows={3} value={newCourse.desc} onChange={(e) => setNewCourse({ ...newCourse, desc: e.target.value })} className="px-3 py-2.5 rounded-md border text-sm outline-none resize-none" style={{ borderColor: "#D1D5DB" }} />
            </div>
            <div className="px-6 pb-6">
              <button type="button" onClick={handleAddCourse} className="w-full py-2.5 rounded-md font-medium text-sm text-white" style={{ background: "#0056D2" }}>Publier le cours</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit course modal */}
      {editingCourse && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-50" style={{ background: "rgba(17,24,39,0.5)" }} onClick={() => setEditingCourse(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-w-lg w-full rounded-lg bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#E5E7EB" }}>
              <span className="text-sm font-semibold">Modifier — {editingCourse.id}</span>
              <button type="button" onClick={() => setEditingCourse(null)}><X size={18} style={{ color: "#6B7280" }} /></button>
            </div>
            <div className="p-6 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
              <input required placeholder="Titre du cours" value={editingCourse.title} onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })} className="px-3 py-2.5 rounded-md border text-sm outline-none" style={{ borderColor: "#D1D5DB" }} />
              <div className="grid grid-cols-2 gap-3">
                <select value={editingCourse.cat} onChange={(e) => setEditingCourse({ ...editingCourse, cat: e.target.value })} className="px-3 py-2.5 rounded-md border text-sm outline-none" style={{ borderColor: "#D1D5DB" }}>
                  {Object.keys(CATEGORIES).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={editingCourse.level} onChange={(e) => setEditingCourse({ ...editingCourse, level: e.target.value })} className="px-3 py-2.5 rounded-md border text-sm outline-none" style={{ borderColor: "#D1D5DB" }}>
                  {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Prix (FCFA)" type="number" disabled={editingCourse.free} value={editingCourse.free ? 0 : editingCourse.price} onChange={(e) => setEditingCourse({ ...editingCourse, price: Number(e.target.value) || 0 })} className="px-3 py-2.5 rounded-md border text-sm outline-none" style={{ borderColor: "#D1D5DB", background: editingCourse.free ? "#F3F4F6" : "white" }} />
                <input placeholder="Durée (ex: 5h)" value={editingCourse.duration} onChange={(e) => setEditingCourse({ ...editingCourse, duration: e.target.value })} className="px-3 py-2.5 rounded-md border text-sm outline-none" style={{ borderColor: "#D1D5DB" }} />
              </div>
              <label className="flex items-center gap-2 text-sm" style={{ color: "#374151" }}>
                <input type="checkbox" checked={editingCourse.free} onChange={(e) => setEditingCourse({ ...editingCourse, free: e.target.checked, price: e.target.checked ? 0 : editingCourse.price })} />
                Cours gratuit
              </label>
              <textarea placeholder="Description" rows={3} value={editingCourse.desc} onChange={(e) => setEditingCourse({ ...editingCourse, desc: e.target.value })} className="px-3 py-2.5 rounded-md border text-sm outline-none resize-none" style={{ borderColor: "#D1D5DB" }} />
            </div>
            <div className="px-6 pb-6">
              <button type="button" onClick={handleSaveEdit} className="w-full py-2.5 rounded-md font-medium text-sm text-white" style={{ background: "#0056D2" }}>Enregistrer les modifications</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage modules panel */}
      {managingModules && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-50" style={{ background: "rgba(17,24,39,0.5)" }} onClick={() => setManagingModules(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-w-xl w-full rounded-lg bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#E5E7EB" }}>
              <div>
                <span className="text-sm font-semibold">Modules — {managingModules.title}</span>
                <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>
                  Modèle : {managingModules.template || "non défini"}
                </p>
              </div>
              <button onClick={() => setManagingModules(null)}><X size={18} style={{ color: "#6B7280" }} /></button>
            </div>

            <div className="p-6 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
              {currentModuleList.map((m, i) => {
                const isExpanded = expandedModuleId === m.id;
                return (
                  <div key={m.id} className="rounded-md border" style={{ borderColor: "#E5E7EB" }}>
                    <div className="flex items-center justify-between px-3 py-2.5">
                      <button
                        onClick={() => setExpandedModuleId(isExpanded ? null : m.id)}
                        className="flex items-center gap-2 text-sm flex-1 text-left select-none cursor-pointer"
                      >
                        <ChevronDown size={14} style={{ transform: isExpanded ? "rotate(180deg)" : "none", color: "#9CA3AF" }} />
                        Module {i + 1} — {m.title}
                        <span className="text-xs" style={{ color: "#9CA3AF" }}>({m.sections.length} section{m.sections.length > 1 ? "s" : ""})</span>
                      </button>
                      <button onClick={() => removeModule(m.id)} aria-label="Supprimer le module" style={{ color: "#9CA3AF" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="px-3 pb-3 flex flex-col gap-2 border-t" style={{ borderColor: "#F3F4F6" }}>
                        {m.sections.map((s, si) => (
                          <div key={si} className="flex items-center gap-2 text-xs mt-2" style={{ color: "#374151" }}>
                            <SectionIcon type={s.type} />
                            <button
                              onClick={() => setEditingSection({ moduleId: m.id, index: si })}
                              className="flex-1 text-left hover:underline select-none cursor-pointer"
                            >
                              {s.title}
                            </button>
                            {isSectionFilled(s) ? (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: "#D1FAE5", color: "#047857" }}>Rempli</span>
                            ) : (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: "#FEE2E2", color: "#991B1B" }}>Vide</span>
                            )}
                            {s.practical && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: "#FEF3C7", color: "#92400E" }}>Pratique</span>
                            )}
                            <span style={{ color: "#9CA3AF" }}>{s.duration}</span>
                            <button onClick={() => removeSection(m.id, si)} aria-label="Supprimer la section" style={{ color: "#9CA3AF" }}>
                              <X size={13} />
                            </button>
                          </div>
                        ))}
                        {m.sections.length === 0 && (
                          <p className="text-xs mt-2" style={{ color: "#9CA3AF" }}>Aucune section pour l'instant.</p>
                        )}

                        <div className="mt-2 flex flex-col gap-2 rounded-md p-2.5" style={{ background: "#F9FAFB" }}>
                          <input
                            placeholder="Titre de la section"
                            value={newSection.title}
                            onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                            className="px-2.5 py-2 rounded-md border text-xs outline-none"
                            style={{ borderColor: "#D1D5DB" }}
                          />
                          <div className="flex gap-2">
                            <select
                              value={newSection.type}
                              onChange={(e) => setNewSection({ ...newSection, type: e.target.value })}
                              className="flex-1 px-2.5 py-2 rounded-md border text-xs outline-none"
                              style={{ borderColor: "#D1D5DB" }}
                            >
                              <option value="reading">Lecture (texte)</option>
                              <option value="image">Photo / galerie</option>
                              <option value="video">Vidéo</option>
                              <option value="quiz">Quiz / évaluation</option>
                            </select>
                            <input
                              placeholder="Durée (ex: 10 min)"
                              value={newSection.duration}
                              onChange={(e) => setNewSection({ ...newSection, duration: e.target.value })}
                              className="w-32 px-2.5 py-2 rounded-md border text-xs outline-none"
                              style={{ borderColor: "#D1D5DB" }}
                            />
                          </div>
                          {newSection.type === "video" && (
                            <label className="flex items-center gap-2 text-xs" style={{ color: "#374151" }}>
                              <input type="checkbox" checked={newSection.practical} onChange={(e) => setNewSection({ ...newSection, practical: e.target.checked })} />
                              Vidéo pratique obligatoire (démonstration en direct)
                            </label>
                          )}
                          <button type="button" onClick={() => handleAddSection(m.id)} className="flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md text-white self-start" style={{ background: "#0056D2" }}>
                            <Plus size={13} /> Ajouter la section
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {currentModuleList.length === 0 && (
                <p className="text-sm text-center py-4" style={{ color: "#9CA3AF" }}>Aucun module pour l'instant.</p>
              )}
            </div>

            <div className="px-6 pb-6 flex gap-2 border-t pt-4" style={{ borderColor: "#E5E7EB" }}>
              <input
                placeholder="Titre du nouveau module"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-md border text-sm outline-none"
                style={{ borderColor: "#D1D5DB" }}
              />
              <button type="button" onClick={handleAddModule} className="flex items-center gap-1.5 text-sm font-medium px-3 py-2.5 rounded-md text-white" style={{ background: "#0056D2" }}>
                <Plus size={14} /> Ajouter le module
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section content editor */}
      {editingSection && (() => {
        const mod = currentModuleList.find((m) => m.id === editingSection.moduleId);
        const section = mod?.sections[editingSection.index];
        if (!section) return null;
        return (
          <SectionContentEditor
            section={section}
            onClose={() => setEditingSection(null)}
            onSave={(data) => {
              saveSectionContent(editingSection.moduleId, editingSection.index, data);
              setEditingSection(null);
            }}
          />
        );
      })()}
    </div>
  );
}

function SectionContentEditor({ section, onClose, onSave }) {
  const [body, setBody] = useState(section.body || "");
  const [videoUrl, setVideoUrl] = useState(section.videoUrl || "");
  const [photos, setPhotos] = useState(section.photos || []);
  const [questions, setQuestions] = useState(section.questions || []);

  function addPhoto() {
    setPhotos([...photos, { caption: "" }]);
  }
  function updatePhotoCaption(i, caption) {
    setPhotos(photos.map((p, idx) => (idx === i ? { ...p, caption } : p)));
  }
  function removePhoto(i) {
    setPhotos(photos.filter((_, idx) => idx !== i));
  }

  function addQuestion() {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctIndex: 0 }]);
  }
  function updateQuestion(i, field, value) {
    setQuestions(questions.map((q, idx) => (idx === i ? { ...q, [field]: value } : q)));
  }
  function updateOption(qi, oi, value) {
    setQuestions(questions.map((q, idx) => (idx === qi ? { ...q, options: q.options.map((o, x) => (x === oi ? value : o)) } : q)));
  }
  function removeQuestion(i) {
    setQuestions(questions.filter((_, idx) => idx !== i));
  }

  function handleSave() {
    if (section.type === "reading") onSave({ body });
    else if (section.type === "video") onSave({ videoUrl });
    else if (section.type === "image") onSave({ photos });
    else if (section.type === "quiz") onSave({ questions });
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 z-50" style={{ background: "rgba(17,24,39,0.5)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="max-w-lg w-full rounded-lg bg-white overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#E5E7EB" }}>
          <span className="text-sm font-semibold">{section.title}</span>
          <button onClick={onClose}><X size={18} style={{ color: "#6B7280" }} /></button>
        </div>

        <div className="p-6 flex flex-col gap-3 max-h-[65vh] overflow-y-auto">
          {section.type === "reading" && (
            <>
              <label className="text-xs font-medium" style={{ color: "#6B7280" }}>Contenu de la lecture</label>
              <textarea
                autoFocus
                rows={10}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Écris ici le texte de cette section, comme dans un traitement de texte…"
                className="px-3 py-2.5 rounded-md border text-sm outline-none resize-none"
                style={{ borderColor: "#D1D5DB" }}
              />
            </>
          )}

          {section.type === "video" && (
            <>
              <label className="text-xs font-medium" style={{ color: "#6B7280" }}>Lien de la vidéo hébergée</label>
              <input
                autoFocus
                placeholder="https://..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="px-3 py-2.5 rounded-md border text-sm outline-none"
                style={{ borderColor: "#D1D5DB" }}
              />
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                Uploade d'abord ta vidéo sur ton service d'hébergement (Cloudflare Stream, Mux, Bunny…), puis colle le lien généré ici.
              </p>
            </>
          )}

          {section.type === "image" && (
            <>
              <label className="text-xs font-medium" style={{ color: "#6B7280" }}>Photos de la galerie</label>
              {photos.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-14 h-14 rounded-md border flex items-center justify-center shrink-0" style={{ borderColor: "#D1D5DB", background: "#F9FAFB" }}>
                    <ImageIcon size={18} style={{ color: "#9CA3AF" }} />
                  </div>
                  <input
                    placeholder="Légende de la photo"
                    value={p.caption}
                    onChange={(e) => updatePhotoCaption(i, e.target.value)}
                    className="flex-1 px-3 py-2 rounded-md border text-sm outline-none"
                    style={{ borderColor: "#D1D5DB" }}
                  />
                  <button onClick={() => removePhoto(i)} aria-label="Retirer la photo" style={{ color: "#9CA3AF" }}><X size={14} /></button>
                </div>
              ))}
              <button onClick={addPhoto} className="flex items-center justify-center gap-1.5 text-sm font-medium py-2.5 rounded-md border" style={{ borderColor: "#D1D5DB", color: "#374151" }}>
                <Plus size={14} /> Ajouter une photo
              </button>
            </>
          )}

          {section.type === "quiz" && (
            <>
              <label className="text-xs font-medium" style={{ color: "#6B7280" }}>Questions</label>
              {questions.map((q, qi) => (
                <div key={qi} className="rounded-md border p-3 flex flex-col gap-2" style={{ borderColor: "#E5E7EB" }}>
                  <div className="flex items-center gap-2">
                    <input
                      placeholder={`Question ${qi + 1}`}
                      value={q.question}
                      onChange={(e) => updateQuestion(qi, "question", e.target.value)}
                      className="flex-1 px-2.5 py-2 rounded-md border text-sm outline-none"
                      style={{ borderColor: "#D1D5DB" }}
                    />
                    <button onClick={() => removeQuestion(qi)} aria-label="Supprimer la question" style={{ color: "#9CA3AF" }}><Trash2 size={14} /></button>
                  </div>
                  {q.options.map((opt, oi) => (
                    <label key={oi} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={`correct-${qi}`}
                        checked={q.correctIndex === oi}
                        onChange={() => updateQuestion(qi, "correctIndex", oi)}
                      />
                      <input
                        placeholder={`Choix ${oi + 1}`}
                        value={opt}
                        onChange={(e) => updateOption(qi, oi, e.target.value)}
                        className="flex-1 px-2.5 py-1.5 rounded-md border text-xs outline-none"
                        style={{ borderColor: "#D1D5DB" }}
                      />
                    </label>
                  ))}
                  <p className="text-[10px]" style={{ color: "#9CA3AF" }}>Coche la bonne réponse à gauche du choix.</p>
                </div>
              ))}
              <button onClick={addQuestion} className="flex items-center justify-center gap-1.5 text-sm font-medium py-2.5 rounded-md border" style={{ borderColor: "#D1D5DB", color: "#374151" }}>
                <Plus size={14} /> Ajouter une question
              </button>
            </>
          )}
        </div>

        <div className="px-6 pb-6">
          <button onClick={handleSave} className="w-full py-2.5 rounded-md font-medium text-sm text-white" style={{ background: "#0056D2" }}>
            Enregistrer le contenu
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- APP ----------------------------- */

export default function App() {
  const [page, setPage] = useState("accueil");
  const [activeCourse, setActiveCourse] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  function openCourse(course) {
    setActiveCourse(course);
    setPage("cours");
  }

  return (
    <div style={{ background: "#F9FAFB", minHeight: "100%", fontFamily: "Inter, system-ui, sans-serif", color: "#1A1A1A" }}>
      <GlobalNav
        page={page}
        onNavigate={setPage}
        isAdmin={isAdmin}
        onToggleAdmin={() => {
          setIsAdmin(!isAdmin);
          if (page === "admin" && isAdmin) setPage("catalogue");
        }}
      />
      {page === "accueil" && <HomePage onOpenCourse={openCourse} onNavigate={setPage} />}
      {page === "catalogue" && <CatalogPage onOpenCourse={openCourse} />}
      {page === "cours" && activeCourse && <CoursePlayerPage course={activeCourse} onBack={() => setPage("catalogue")} />}
      {page === "accompagnement" && <SupportPage />}
      {page === "profil" && <ProfilePage onNavigate={setPage} />}
      {page === "contact" && <ContactPage />}
      {page === "admin" && isAdmin && <AdminPage />}
    </div>
  );
}
