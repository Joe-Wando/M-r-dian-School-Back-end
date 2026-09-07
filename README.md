# Meredian — Backend (API NestJS)

API REST de la plateforme **Meredian** : catalogue de cours (Histoire, Droit,
Informatique, RH), accompagnement personnel (mentorat, sessions Q&R, correction de
travaux), vitrine professionnelle, contact et paiements.

- **Stack** : NestJS (TypeScript) · PostgreSQL · Prisma · JWT (`@nestjs/passport`) · class-validator
- Schéma de base et liste des endpoints : voir [`architecture-technique.md`](./architecture-technique.md) (source de vérité)
- Contexte métier : voir [`cahier-des-charges-plateforme.md`](./cahier-des-charges-plateforme.md)

---

## 1. Prérequis

| Outil | Version |
|---|---|
| Node.js | ≥ 18 (testé sur 20 / 24) |
| npm | ≥ 9 |
| PostgreSQL | ≥ 14 (local, Docker, ou hébergé) |

---

## 2. Installation

```bash
npm install
cp .env.example .env      # puis renseigner les valeurs (voir §3)
npm run prisma:generate   # génère le client Prisma typé
```

### Base de données locale via Docker (optionnel)

```bash
docker run -d --name meredian-pg \
  -e POSTGRES_USER=meredian -e POSTGRES_PASSWORD=meredian -e POSTGRES_DB=meredian \
  -p 5432:5432 postgres:16-alpine
```

---

## 3. Variables d'environnement

Toutes les variables sont listées dans [`.env.example`](./.env.example). Le fichier
`.env` **n'est jamais committé** (voir `.gitignore`).

| Variable | Rôle | Obligatoire |
|---|---|---|
| `DATABASE_URL` | Chaîne de connexion PostgreSQL | ✅ |
| `JWT_SECRET` | Secret de signature des JWT | ✅ en production |
| `JWT_EXPIRES_IN` | Durée de validité du token (défaut `7d`) | — |
| `PORT` / `API_PREFIX` | Port HTTP / préfixe des routes (défaut `4000` / `api`) | — |
| `CORS_ORIGIN` | Origines autorisées, séparées par des virgules (ou `*`) | — |
| `MOCK_PAYMENTS` | `true` = paiements simulés, confirmés immédiatement (voir §6) | — |
| `NABOOPAY_API_URL` / `NABOOPAY_API_KEY` | Intégration Naboopay (repoussée) | — |
| `NABOOPAY_WEBHOOK_SECRET` | Secret HMAC de vérification du webhook | ✅ en production |
| `NABOOPAY_WEBHOOK_SIGNATURE_HEADER` | Nom du header portant la signature (défaut `x-naboopay-signature`) | — |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_NAME` | Compte admin créé par le seed | — |

L'application **valide ces variables au démarrage** et refuse de démarrer si une
variable critique manque (voir `src/config/env.validation.ts`).

---

## 4. Migrations & seed

```bash
# Crée / applique les migrations (dev) — génère prisma/migrations/*
npm run prisma:migrate         # = prisma migrate dev

# En production / CI : applique les migrations existantes sans en créer
npm run prisma:deploy          # = prisma migrate deploy

# Insère les données de démonstration (28+ cours du prototype, profil, Q&R, admin)
npm run seed

# Repartir de zéro (drop + migrate + seed)
npm run db:reset
```

Le seed est **idempotent** (upserts) et crée :

- un compte **admin** (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`),
- un compte utilisateur de démo (`etudiant@meredian.io` / `Etudiant!2026`),
- l'ensemble des cours de la constante `COURSES` du prototype frontend
  (Histoire / Droit / Informatique / RH, niveaux L1–L3 + Formation Pro, prix et
  statut gratuit/payant), dont deux cours entièrement détaillés en modules/sections
  (`HIS-101`, `INF-105`),
- le profil de vitrine, les compétences et les réalisations,
- trois sessions Q&R planifiées dans les deux prochaines semaines,
- les 4 filières (contenu des bandeaux du catalogue, constante `FILIERE_INFO`).

> **Note** : le prompt mentionnait « 28 cours » ; la constante `COURSES` du
> prototype en contient en réalité **34**. Le seed reprend la liste exacte du
> prototype (source de vérité désignée).

---

## 5. Lancer en local

```bash
npm run start:dev     # watch mode, http://localhost:4000
npm run start         # sans watch
npm run build && npm run start:prod   # build puis exécution de dist/
```

Vérification rapide : `GET http://localhost:4000/api/health`

Le fichier [`requests.http`](./requests.http) (extension VS Code *REST Client*)
contient une requête par endpoint, prête à l'emploi.

---

## 6. Paiements (Naboopay) — état actuel

**L'intégration réelle avec Naboopay est repoussée** : identifiants marchand et
documentation officielle (schéma exact de signature du webhook) pas encore
disponibles. La structure complète est néanmoins en place :

- table `payments`, `POST /payments/checkout`, `POST /payments/webhook` ;
- **`MOCK_PAYMENTS=true`** : `checkout` crée un paiement `pending` puis le confirme
  immédiatement, **sans appeler l'API Naboopay** (pratique en développement) ;
- le webhook vérifie une **signature HMAC-SHA256 générique** :
  `signature = hex(HMAC_SHA256(NABOOPAY_WEBHOOK_SECRET, corps_brut))`, transmise
  dans le header `NABOOPAY_WEBHOOK_SIGNATURE_HEADER`. **Ce schéma est à ajuster une
  fois la documentation officielle Naboopay obtenue** (nom du header, algorithme,
  contenu signé).
- Le statut d'un paiement **n'est jamais confirmé sur simple demande du frontend** :
  hors mode mock, seul le webhook signé fait passer un paiement en `confirmed`.

### À faire quand la doc Naboopay sera disponible

1. Implémenter l'appel réel de création de transaction dans
   `src/payments/naboopay.service.ts` (`createTransaction`).
2. Adapter `verifyWebhookSignature` au schéma de signature réel.
3. **Ajouter une vérification serveur supplémentaire** : à réception du webhook,
   rappeler l'API Naboopay (`GET .../transaction/{reference}`) pour reconfirmer le
   statut réel avant de passer le paiement en `confirmed` — la signature seule ne
   doit pas être l'unique rempart.

---

## 7. Sécurité

- Mots de passe hachés avec **bcrypt** (12 rounds), jamais stockés en clair.
- **JWT** vérifié à chaque requête sensible ; le rôle est **relu depuis la base**
  à chaque requête (jamais tiré du seul token) — voir `src/auth/jwt.strategy.ts`.
- Autorisation par rôle **côté serveur uniquement** : `JwtAuthGuard` + `RolesGuard`
  avec `@Roles('admin')` sur toutes les routes de gestion (cours, modules, sections,
  profil, stats, messages). Le frontend ne fait qu'afficher — il ne décide rien.
- **Validation des entrées** sur toutes les routes via `class-validator` + DTOs et
  un `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`, `transform`).
- **Gestion d'erreurs centralisée** (`src/common/filters/all-exceptions.filter.ts`) :
  format d'erreur homogène, traduction des erreurs Prisma, **aucune stack trace en
  production**.
- `helmet`, CORS restreint par `CORS_ORIGIN`, `trust proxy` pour l'hébergeur.
- **HTTPS** : géré au niveau du reverse proxy / hébergeur (Railway, Render), pas
  dans l'application.
- Secrets (JWT, Naboopay, `DATABASE_URL`) uniquement en variables d'environnement.

---

## 8. Structure du projet

```
src/
  main.ts                 amorçage (ValidationPipe global, helmet, filtres, prefix)
  app.module.ts           module racine
  config/                 configuration + validation des variables d'env
  prisma/                 PrismaModule + PrismaService (global)
  common/                 decorators (@Roles, @CurrentUser), guards, filtre d'exception
  auth/                   register / login / me, JwtStrategy, JwtAuthGuard
  users/                  GET /users/me/courses
  courses/               catalogue public + CRUD admin
  filieres/              contenu éditorial des bandeaux du catalogue (public + PATCH admin)
  modules/               modules de cours (CRUD admin)
  sections/              sections de cours (CRUD admin, contenu selon le type)
  enrollments/           progression : enroll, complete, calcul du %
  payments/              checkout + webhook (+ NaboopayService stub)
  mentoring/             créneaux + réservations
  qa-sessions/           sessions Q&R + inscriptions
  work-submissions/      dépôt de travaux à corriger
  profile/               vitrine (profil, compétences, réalisations)
  contact/               formulaire de contact
  admin/                 statistiques + messages de contact
prisma/
  schema.prisma           tables + enums (users, courses, modules, sections, ...,
                          filieres)
  migrations/             init + table filieres + champs name/headline/timeline du profil
  seed.ts / seed-data.ts  données de démonstration (issues du prototype)
requests.http             une requête de test par endpoint
```

### Endpoints

Liste complète et à jour dans [`architecture-technique.md`](./architecture-technique.md) §3.
Toutes les routes sont préfixées par `/api` (configurable via `API_PREFIX`).

**Détails d'intégration frontend :**

- `POST /auth/login` et `/auth/register` renvoient `token` (et `accessToken`, même
  valeur) + `user`.
- `GET /courses/:id/modules` renvoie **la liste ordonnée des modules** (tableau) ;
  authentification **facultative** : si un token valide est fourni, chaque section
  porte `completed` et chaque module un `status` (`done` / `current` / `locked`)
  calculés à la volée.
- `GET /users/me/courses` : `progress` est un objet
  `{ completedSections, totalSections, percentage }`.
- `POST /mentoring/bookings` : `scheduledAt` est **facultatif** — le prochain
  créneau libre est attribué automatiquement s'il est absent.
- `GET /profile` renvoie `{ profile, skills, works }` ; `profile` inclut
  `name`, `headline`, `timeline`.

---

## 9. Stratégie de branches Git

| Branche | Rôle |
|---|---|
| `main` | Stable, déployable, protégée. Fusions **uniquement via pull request** depuis `dev` ou `hotfix/*`. |
| `dev` | Branche d'intégration. Toutes les fonctionnalités y sont fusionnées avant `main`. |
| `feature/<nom-court>` | Une branche par fonctionnalité, créée depuis `dev` (ex : `feature/auth-jwt`, `feature/payments-stub`, `feature/courses-crud`). |
| `hotfix/<nom-court>` | Correctif urgent sur `main`, fusionné dans `main` **et** `dev`. |
| `release/<version>` | *(optionnel)* Gèle `dev` avant une mise en production. |

**Convention de commits** : `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`.

**Workflow** :

```bash
git checkout dev && git pull
git checkout -b feature/ma-fonctionnalite
# ... commits ...
git push -u origin feature/ma-fonctionnalite
# ouvrir une Pull Request vers dev, description claire, revue, puis merge
```

`main` ne reçoit que des merges de `dev` (release) ou de `hotfix/*`, toujours par
pull request.
