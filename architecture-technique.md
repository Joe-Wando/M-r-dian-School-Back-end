# Architecture technique — Plateforme personnelle

**Version :** 0.1
**Date :** Juillet 2026
**Basé sur :** le cahier des charges (v0.1) et les prototypes validés (catalogue, lecture de cours, accompagnement, vitrine, admin)

---

## 1. Stack confirmée

| Couche | Technologie |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | NestJS (TypeScript) — API REST |
| Base de données | PostgreSQL |
| ORM | Prisma (migrations simples, requêtes typées) |
| Authentification | JWT (via `@nestjs/passport` + `passport-jwt`) |
| Paiement | Naboopay (API + webhooks) — intégration repoussée à plus tard |
| Stockage vidéo | Service de streaming dédié (Cloudflare Stream / Mux / Bunny Stream — à trancher) |
| Stockage fichiers (photos, PDF, CV) | Stockage compatible S3 |
| Déploiement | Vercel (frontend) + Railway ou Render (backend + PostgreSQL) |

---

## 2. Schéma de base de données

### 2.1 Utilisateurs et rôles

**`users`**
| Champ | Type | Description |
|---|---|---|
| id | uuid | Identifiant unique |
| name | text | Nom affiché |
| email | text (unique) | Email de connexion |
| password_hash | text | Mot de passe chiffré (bcrypt/argon2) |
| role | enum(`user`, `admin`) | Contrôle l'accès au tableau de bord |
| created_at | timestamp | |

### 2.2 Cours, modules, sections

**`courses`**
| Champ | Type | Description |
|---|---|---|
| id | uuid | |
| code | text | Ex : `HIS-101` (repère lisible) |
| title | text | |
| category | enum(`Histoire`,`Droit`,`Informatique`,`RH`) | |
| level | enum(`L1`,`L2`,`L3`,`Formation Pro`) | |
| template | enum(`Théorique illustré`,`Pratique guidée`,`Mixte`) | Guide le type de contenu attendu |
| is_free | boolean | |
| price | integer | En FCFA, 0 si gratuit |
| duration | text | Ex : `"5h"` |
| description | text | |
| pdf_resource_url | text (nullable) | Support téléchargeable |
| created_at / updated_at | timestamp | |

**`modules`**
| Champ | Type | Description |
|---|---|---|
| id | uuid | |
| course_id | uuid (FK → courses) | |
| title | text | |
| order_index | integer | Ordre d'affichage |

**`sections`**
| Champ | Type | Description |
|---|---|---|
| id | uuid | |
| module_id | uuid (FK → modules) | |
| title | text | |
| type | enum(`reading`,`image`,`video`,`quiz`) | |
| order_index | integer | |
| duration | text | Ex : `"12 min"` ou `"12 photos"` |
| practical | boolean | Vidéo pratique obligatoire (parties code) |
| body | text (nullable) | Contenu si type = `reading` |
| video_url | text (nullable) | Lien vers la vidéo hébergée si type = `video` |

**`section_photos`** (si type = `image`)
| Champ | Type | Description |
|---|---|---|
| id | uuid | |
| section_id | uuid (FK → sections) | |
| url | text | |
| caption | text | |
| order_index | integer | |

**`quiz_questions`** (si type = `quiz`)
| Champ | Type | Description |
|---|---|---|
| id | uuid | |
| section_id | uuid (FK → sections) | |
| question | text | |
| options | jsonb | Tableau des choix |
| correct_index | integer | |
| order_index | integer | |

### 2.3 Suivi et progression

**`enrollments`**
| Champ | Type | Description |
|---|---|---|
| id | uuid | |
| user_id | uuid (FK → users) | |
| course_id | uuid (FK → courses) | |
| enrolled_at | timestamp | |

**`section_completions`**
| Champ | Type | Description |
|---|---|---|
| id | uuid | |
| user_id | uuid (FK → users) | |
| section_id | uuid (FK → sections) | |
| completed_at | timestamp | |

*(Le pourcentage de progression d'un cours se calcule à la volée : sections complétées / total des sections.)*

### 2.4 Paiements

**`payments`**
| Champ | Type | Description |
|---|---|---|
| id | uuid | |
| user_id | uuid (FK → users) | |
| item_type | enum(`course`,`mentoring`,`correction`) | |
| item_id | uuid | Référence vers le cours, la réservation ou la soumission |
| amount | integer | |
| naboopay_reference | text | |
| status | enum(`pending`,`confirmed`,`failed`) | Confirmé uniquement via webhook serveur, jamais côté frontend |
| created_at | timestamp | |

### 2.5 Accompagnement personnel

**`mentoring_bookings`**
| Champ | Type | Description |
|---|---|---|
| id | uuid | |
| user_id | uuid (FK → users) | |
| duration_minutes | integer | 30 ou 60 |
| price | integer | |
| scheduled_at | timestamp | |
| meeting_link | text (nullable) | Généré après confirmation du paiement |
| status | enum(`pending`,`confirmed`,`completed`,`cancelled`) | |

**`qa_sessions`**
| Champ | Type | Description |
|---|---|---|
| id | uuid | |
| topic | text | |
| scheduled_at | timestamp | |
| duration_minutes | integer | |
| max_spots | integer | |

**`qa_registrations`**
| Champ | Type | Description |
|---|---|---|
| id | uuid | |
| session_id | uuid (FK → qa_sessions) | |
| user_id | uuid (FK → users) | |

**`work_submissions`** (correction de travaux)
| Champ | Type | Description |
|---|---|---|
| id | uuid | |
| user_id | uuid (FK → users) | |
| file_url | text | |
| note | text | Contexte fourni par l'utilisateur |
| status | enum(`pending`,`in_review`,`completed`) | |
| price | integer | |
| created_at | timestamp | |

### 2.6 Vitrine personnelle

**`profile`** (une seule ligne, c'est ton profil)
| Champ | Type | Description |
|---|---|---|
| id | uuid | |
| bio | text | |
| cv_url | text | |
| pitch_video_url | text | |
| location | text | |
| email_contact | text | |

**`skills`**
| Champ | Type | Description |
|---|---|---|
| id | uuid | |
| category | text | |
| name | text | |

**`works`** (travaux/réalisations)
| Champ | Type | Description |
|---|---|---|
| id | uuid | |
| title | text | |
| category | text | |
| description | text | |
| link | text (nullable) | |

**`contact_messages`**
| Champ | Type | Description |
|---|---|---|
| id | uuid | |
| name | text | |
| email | text | |
| message | text | |
| is_read | boolean | |
| created_at | timestamp | |

### 2.7 Filières (contenu des bandeaux du catalogue)

**`filieres`**
| Champ | Type | Description |
|---|---|---|
| id | uuid | |
| category | enum(`Histoire`,`Droit`,`Informatique`,`RH`) (unique) | |
| intro | text | Texte d'introduction affiché dans le bandeau du catalogue |
| video_url | text (nullable) | Vidéo de présentation de la filière |
| levels | jsonb | Ex : `{"L1": "...", "L2": "...", "L3": "...", "Formation Pro": "..."}` |
| certification_text | text (nullable) | Ex : orientation vers une certification externe |
| certification_url | text (nullable) | |
| updated_at | timestamp | |

---

## 3. API — Liste des endpoints

### Authentification
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Catalogue de cours (public)
- `GET /courses` — filtres `?category=&level=&query=`
- `GET /courses/:id`
- `GET /courses/:id/modules` — structure complète avec sections
- `GET /filieres` — contenu des bandeaux par matière (intro, vidéo, niveaux, certification)
- `GET /filieres/:category`

### Filières (admin uniquement)
- `PATCH /filieres/:category`

### Cours (admin uniquement — protégé par middleware de rôle)
- `POST /courses`
- `PATCH /courses/:id`
- `DELETE /courses/:id`
- `POST /courses/:id/modules`
- `PATCH /modules/:id`
- `DELETE /modules/:id`
- `POST /modules/:id/sections`
- `PATCH /sections/:id` — met à jour `body`, `video_url`, photos ou questions selon le type
- `DELETE /sections/:id`

### Progression (utilisateur connecté)
- `POST /courses/:id/enroll`
- `GET /users/me/courses` — cours suivis + progression
- `POST /sections/:id/complete`

### Paiements
- `POST /payments/checkout` — initie un paiement Naboopay (cours, mentorat, ou correction)
- `POST /payments/webhook` — reçoit la confirmation de Naboopay, **seule source de vérité** pour valider un paiement

### Accompagnement
- `GET /mentoring/slots`
- `POST /mentoring/bookings`
- `GET /qa-sessions`
- `POST /qa-sessions/:id/register`
- `POST /work-submissions`

### Vitrine et contact
- `GET /profile`
- `PATCH /profile` (admin)
- `POST /contact`
- `GET /admin/contact-messages` (admin)

### Statistiques admin
- `GET /admin/stats` — cours publiés, ventes, revenu, messages non lus

---

## 4. Sécurité

- Mots de passe chiffrés avec bcrypt ou argon2
- Authentification par JWT, vérifié à chaque requête sensible
- Middleware `requireAdmin` sur toutes les routes de gestion (cours, modules, stats, messages) — **vérifié côté serveur**, jamais seulement côté interface
- HTTPS obligatoire sur l'ensemble du site
- Le statut d'un paiement n'est confirmé que via le **webhook Naboopay signé**, jamais sur simple confirmation du frontend
- Sauvegardes régulières de la base de données

---

## 5. Ce qui reste à trancher

- [ ] Choix définitif du service d'hébergement vidéo (Cloudflare Stream / Mux / Bunny Stream)
- [ ] Choix définitif de l'hébergement backend (Railway vs Render)
- [ ] Lien(s) de certification externe pour la filière Informatique
- [ ] Design final des emails transactionnels (confirmation d'achat, rappel de session Q&R...)
