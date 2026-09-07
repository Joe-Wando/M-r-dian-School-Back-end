# Prompt pour Claude Code — Backend Meredian

À utiliser avec `architecture-technique.md` (schéma de base de données et endpoints),
`plateforme-app-prototype.jsx` (référence des données de cours pour le seed), et
`cahier-des-charges-plateforme.md` (contexte métier) joints en référence.

---

## Contexte du projet

Construis le backend de **Meredian**, une plateforme personnelle combinant catalogue de cours
(Histoire, Droit, Informatique, RH), accompagnement personnel (mentorat, correction de travaux,
sessions Q&R), vitrine professionnelle, et paiement en ligne via Naboopay.

Le schéma de base de données et la liste des endpoints sont **déjà définis** dans
`architecture-technique.md` — respecte-le comme source de vérité plutôt que d'inventer ta propre
structure. Si un point n'est pas assez précis dans ce document pour l'implémenter, demande une
clarification plutôt que de deviner.

---

## Stack technique imposée

- Node.js + Express (API REST)
- PostgreSQL
- Prisma comme ORM (schéma + migrations)
- JWT pour l'authentification
- bcrypt (ou argon2) pour le hash des mots de passe
- Intégration Naboopay pour les paiements

---

## Ce qu'il faut construire

### 1. Schéma Prisma
Traduis intégralement le schéma de `architecture-technique.md` (section 2) en `schema.prisma` :
les 14 tables (users, courses, modules, sections, section_photos, quiz_questions, enrollments,
section_completions, payments, mentoring_bookings, qa_sessions, qa_registrations,
work_submissions, profile, skills, works, contact_messages), avec les bonnes relations et enums.

### 2. Authentification
- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- Mots de passe hashés, jamais stockés en clair
- JWT signé, avec expiration raisonnable (ex : 7 jours) et refresh à prévoir si le temps le permet
- Middleware `requireAuth` (route protégée, utilisateur connecté) et `requireAdmin` (route
  protégée, rôle admin uniquement) — **la vérification du rôle se fait toujours côté serveur**,
  jamais seulement en te fiant à ce que le frontend affiche

### 3. Endpoints
Implémente l'intégralité de la liste définie dans `architecture-technique.md` (section 3),
organisée par domaine : catalogue public, gestion admin des cours/modules/sections, progression,
paiements, accompagnement, vitrine/contact, statistiques admin.

Points d'attention spécifiques :
- **Paiements** : le statut d'un paiement ne doit **jamais** être confirmé par une requête directe
  du frontend. Seul le webhook Naboopay (signé et vérifié) peut passer un paiement en `confirmed`.
  Implémente la vérification de signature du webhook.
- **Sections de cours** : le endpoint de mise à jour d'une section doit gérer les 4 types de
  contenu différemment (`body` texte pour `reading`, `video_url` pour `video`, sous-ressources
  `section_photos` pour `image`, sous-ressources `quiz_questions` pour `quiz`).
- **Progression** : le pourcentage de complétion d'un cours pour un utilisateur se calcule à la
  volée (sections complétées / total des sections du cours), pas stocké en dur.

### 4. Données de démonstration (seed)
Crée un script de seed Prisma qui recrée les données déjà validées dans le prototype frontend
(28 cours répartis en Histoire/Droit/Informatique/RH, avec leurs niveaux L1/L2/L3/Formation Pro,
prix, et statut gratuit/payant) — la liste exacte est dans `plateforme-app-prototype.jsx`
(constante `COURSES`), fourni en référence.

### 5. Sécurité
- HTTPS en production (configuration du reverse proxy/hébergeur, pas au niveau applicatif)
- Validation des entrées sur toutes les routes (ex : avec zod ou express-validator)
- Gestion d'erreurs centralisée, pas de fuite de stack trace en production
- Variables sensibles (secrets JWT, clés Naboopay, URL de base de données) en variables
  d'environnement, jamais commitées

---

## Organisation Git — à respecter pour tout le développement

Même stratégie que côté frontend, à appliquer ici aussi :

- **`main`** — stable, déployable, protégée. Uniquement des merges via pull request depuis `dev`
  ou `hotfix/*`.
- **`dev`** — branche d'intégration, toutes les fonctionnalités y sont fusionnées avant `main`.
- **`feature/<nom-court>`** — une branche par fonctionnalité, créée depuis `dev`
  (ex : `feature/auth-jwt`, `feature/payments-naboopay`, `feature/courses-crud`).
- **`hotfix/<nom-court>`** — correctifs urgents sur `main`, fusionnés dans `main` **et** `dev`.
- **`release/<version>`** *(optionnel)* — gèle `dev` avant mise en production.

**Conventions de commit** : `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`.

**Pull requests** systématiques vers `dev`, avec description claire, avant tout merge.

---

## Livrables attendus

1. Projet Express structuré (routes/controllers/middleware séparés, pas tout dans un seul fichier)
2. `schema.prisma` complet + migrations
3. Script de seed avec les données de démonstration
4. Authentification JWT fonctionnelle avec rôles
5. Tous les endpoints de `architecture-technique.md` implémentés et testables (ex : via un fichier
   `.http` ou une collection Postman/Insomnia)
6. `.env.example` listant toutes les variables d'environnement nécessaires
7. `README.md` : installation, lancement en local, migrations, seed, et stratégie de branches
