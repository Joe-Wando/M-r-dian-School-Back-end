# Cahier des charges — Plateforme personnelle (Cours & Portfolio)

**Version :** 0.1 (document évolutif)
**Date :** Juillet 2026
**Porteur du projet :** [Ton nom]

---

## 1. Présentation du projet

Plateforme web personnelle combinant :
- un **catalogue de cours en ligne** (gratuits et payants),
- un **espace vitrine professionnelle** (CV, compétences, réalisations),
- un **système de paiement en ligne** (Naboopay),
- un **moyen de contact direct**.

L'objectif est de créer un outil qui reflète et accompagne l'évolution de ta carrière : à la fois plateforme de partage de connaissances et portfolio professionnel.

---

## 2. Objectifs

| Objectif | Description |
|---|---|
| Partager des connaissances | Mettre à disposition des cours en histoire, droit, informatique, RH |
| Générer des revenus | Permettre la vente de cours premium via paiement en ligne |
| Se positionner professionnellement | Vitrine CV / compétences / travaux, visible par recruteurs, clients, partenaires |
| Faciliter le contact | Formulaire ou canal direct pour être contacté |
| Évoluer avec toi | Architecture pensée pour grandir (nouveaux cours, nouvelles fonctionnalités) |

---

## 3. Public cible

- Étudiants et autodidactes intéressés par l'histoire, le droit, l'informatique, les RH
- Recruteurs / clients potentiels consultant ton profil
- Professionnels en reconversion ou en formation continue

---

## 4. Périmètre fonctionnel

### 4.1 MVP — Version 1 (priorité : catalogue de cours)

**Catalogue de cours**
- Liste des cours avec filtres par catégorie (Histoire, Droit, Informatique, RH)
- Fiche détaillée par cours : description, programme, durée, niveau, aperçu gratuit
- Distinction claire cours gratuit / cours payant
- Lecture de contenu (vidéo, PDF, texte) pour les cours gratuits ou achetés
- Barre de recherche simple

**Paiement**
- Intégration Naboopay pour l'achat de cours payants
- Page de confirmation / reçu après paiement
- Historique des achats (côté utilisateur)

**Authentification**
- Inscription / connexion (email + mot de passe, éventuellement Google)
- Espace "Mes cours" pour l'utilisateur connecté

**Vitrine personnelle**
- Page "À propos" : présentation, parcours
- CV consultable / téléchargeable
- Section compétences
- Section travaux / réalisations (portfolio)

**Contact**
- Formulaire de contact (nom, email, message → envoi par email ou stockage en base)

### 4.2 Évolutions futures (V2+)

- Espace admin pour gérer les cours (ajout, édition, statistiques de vente)
- Système d'avis / notes sur les cours
- Certificats de complétion
- Newsletter / blog
- Tableau de bord analytics (visites, ventes, cours populaires)
- Multi-langue (FR / EN)
- Application mobile (plus tard, hors périmètre initial)

---

## 5. Architecture technique

### 5.1 Stack retenue

| Couche | Technologie |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | API REST (Node.js/Express recommandé, à confirmer) |
| Base de données | PostgreSQL |
| Authentification | JWT (JSON Web Tokens) ou solution type Auth0/Clerk à évaluer |
| Paiement | Naboopay (intégration API) |
| Stockage fichiers | Cloud storage (ex : S3-compatible) pour vidéos/PDF/CV |
| Déploiement | À définir (ex : Vercel pour le frontend, Railway/Render pour backend + DB) |

### 5.2 Découpage des services

```
[ Frontend React/Tailwind ]
          │  (REST API)
          ▼
[ Backend API (Node/Express) ]
     │         │         │
     ▼         ▼         ▼
[PostgreSQL] [Naboopay] [Stockage fichiers]
```

### 5.3 Points à trancher ensemble

- Langage backend définitif (Node.js pressenti, cohérent avec React)
- ORM pour PostgreSQL (Prisma recommandé pour la simplicité + migrations)
- Solution d'authentification (custom JWT vs service tiers)
- Hébergement final (impact coût / simplicité de déploiement)

---

## 6. Modèle de données (esquisse initiale)

**Entités principales :**

- **User** (id, nom, email, mot_de_passe_hash, rôle, date_inscription)
- **Course** (id, titre, description, catégorie, prix, est_gratuit, contenu, niveau)
- **Enrollment** (id, user_id, course_id, date_achat, statut_paiement)
- **Payment** (id, user_id, course_id, montant, référence_naboopay, statut, date)
- **Portfolio** (id, user_id, cv_url, compétences[], travaux[])
- **ContactMessage** (id, nom, email, message, date)

*(Ce modèle sera affiné lors de la phase de conception détaillée.)*

---

## 7. Sécurité & paiement

- Chiffrement des mots de passe (bcrypt ou argon2)
- HTTPS obligatoire sur l'ensemble du site
- Validation des webhooks Naboopay pour confirmer les paiements côté serveur (ne jamais faire confiance uniquement au frontend)
- Protection des routes API (middleware d'authentification)
- Sauvegarde régulière de la base de données

---

## 8. Roadmap proposée

| Phase | Contenu | Statut |
|---|---|---|
| 1. Cahier des charges | Ce document | ✅ En cours |
| 2. Maquettes / prototype | Wireframes + prototype interactif (catalogue de cours en priorité) | À venir |
| 3. Architecture technique détaillée | Choix définitifs stack, schéma BDD complet | À venir |
| 4. Développement MVP | Catalogue de cours → Paiement → Vitrine → Contact | À venir |
| 5. Tests & déploiement | Mise en ligne version 1 | À venir |
| 6. Évolutions | Fonctionnalités V2 | Plus tard |

---

## 9. Critères de succès du MVP

- Un visiteur peut consulter le catalogue et voir le détail d'un cours
- Un utilisateur peut s'inscrire, se connecter, acheter un cours payant via Naboopay
- Un utilisateur peut accéder au contenu des cours qu'il a achetés ou qui sont gratuits
- Un visiteur peut consulter ton CV, tes compétences, tes travaux
- Un visiteur peut te contacter via le formulaire

---

## 10. Points ouverts à discuter

- [ ] Nom du projet / plateforme
- [ ] Choix final du framework backend (Node/Express vs alternative)
- [ ] Choix de l'hébergement
- [ ] Format des contenus de cours (vidéo héberegée où ? PDF ? texte enrichi ?)
- [ ] Design / identité visuelle (couleurs, logo, ton)

