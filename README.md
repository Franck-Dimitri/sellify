<div align="center">

---

## 📖 Sommaire

1. [À Propos de Sellify.me](#-à-propos-de-sellifyme)
2. [Les 4 Piliers Fondateurs](#-les-4-piliers-fondateurs)
3. [Architecture Fonctionnelle & Modules](#-architecture-fonctionnelle--modules)
4. [Cycle de Vie du Séquestre Escrow](#-cycle-de-vie-du-séquestre-escrow)
5. [Logistique Routière OSRM & Télémétrie](#-logistique-routière-osrm--télémétrie)
6. [Moteur Sellify AI 1.2 Flash](#-moteur-sellify-ai-12-flash)
7. [Comptes de Démonstration (Seeded Credentials)](#-comptes-de-démonstration-seeded-credentials)
8. [Stack Technique & Architecture Logicielle](#-stack-technique--architecture-logicielle)
9. [Guide d'Installation & Lancement Local](#-guide-dinstallation--lancement-local)
10. [Tests Automatisés & Assurance Qualité](#-tests-automatisés--assurance-qualité)
11. [Modèle Économique (Business Model)](#-modèle-économique-business-model)
12. [Feuille de Route Panafricaine](#-feuille-de-route-panafricaine)

---

## 🌟 À Propos de Sellify.me

**Sellify.me** est une infrastructure technologique et financière tout-en-un conçue pour éliminer les deux freins majeurs qui paralysent l'essor du e-commerce en Afrique francophone subsaharienne :

1. **La crise de confiance structurelle** entre acheteurs et vendeurs en ligne due aux arnaques et aux défaillances de livraison.
2. **L'inefficacité logistique et les pertes financières** causées par l'absence d'adresses formelles et le modèle destructeur du *Cash on Delivery (COD)* (plus de 35% de commandes refusées ou annulées à l'arrivée).

En combinant un **système de paiement sous séquestre (Escrow) adossé au Mobile Money (Orange Money / MTN MoMo)**, une **suite logicielle SaaS pour marchands**, un **moteur de guidage GPS routier embarqué (OSRM)** et un **copilote d'Intelligence Artificielle de pointe (Sellify AI 1.2 Flash)**, Sellify.me structure le commerce informel sur WhatsApp, TikTok et Facebook en une économie numérique de confiance, productive et pérenne.

---

## 🏛️ Les 4 Piliers Fondateurs

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   SELLIFY.ME CORE                                      │
├───────────────────┬───────────────────┬───────────────────┬────────────────────────────┤
│ 1. CONFIANCE      │ 2. LOGISTIQUE     │ 3. SUITE SAAS     │ 4. MOTEUR IA 1.2 FLASH     │
│ Séquestre Escrow  │ Guidage OSRM      │ Multi-Boutiques   │ Copilote Universel         │
│ Code Secret OTP   │ Suivi Télémétrique│ Smart-Links 1-Clic│ Support Vocal STT/TTS      │
│ KYC Multi-Niveaux │ Signature Tactile │ Grand Livre CSV   │ Détection Anti-Fraude      │
└───────────────────┴───────────────────┴───────────────────┴────────────────────────────┘
```

1. 🛡️ **Séquestre Escrow Mobile Money (Orange Money & MTN MoMo)** : Les fonds sont consignés de manière atomique dès la commande et libérés au vendeur uniquement après validation du code secret OTP à la livraison.
2. 🛵 **Logistique Géolocalisée & Guidage OSRM Turn-by-Turn** : Visualisation du tracé routier réel sur OpenStreetMap/Leaflet, calcul dynamique de l'ETA et télémétrie in-app sans quitter la plateforme.
3. 🛍️ **Suite SaaS Marchande & Smart-Links de Vente Sociale** : Administration multi-boutiques, suivi des stocks et variantes, liens de paiement 1-clic pour WhatsApp/TikTok et Grand Livre financier avec export CSV et Relevé PDF officiel certifié.
4. 🤖 **Moteur Sellify AI 1.2 Flash** : Assistant vocal et textuel multirôles supervisant les flux, guidant les chauffeurs, optimisant les prix et détectant les fraudes transactionnelles.



---

## 🧩 Architecture Fonctionnelle & Modules

### 👤 1. Module Client (Acheteur)

- Recherche en direct, filtres par quartier/ville et catalogue multi-boutiques.
- Panier intelligent avec application automatique des remises quantitatives.
- Paiement sous séquestre Mobile Money (Orange Money / MTN MoMo).
- Suivi de colis en direct sur carte routière réelle OSRM avec mise à jour continue de l'ETA.
- Réception sécurisée par code secret OTP à 6 chiffres.
- Programme de fidélité récompensant chaque achat (1 pt / 100 FCFA).

### 🏬 2. Module Vendeur (Marchand & Suite SaaS)

- Tableau de bord multi-boutiques avec isolation des inventaires.
- Gestion des articles avec déclinaisons de variantes (tailles, couleurs, capacités).
- Générateur de **Smart-Links 1-clic** pour vendre directement sur WhatsApp, TikTok, Facebook et Instagram.
- **Portefeuille & Grand Livre Comptable** : Séparation *Solde Disponible / Solde Bloqué Escrow*, graphiques des flux sur 6 mois, exports CSV et impression de Relevés de Compte Officiels certifiés (PDF).
- Gestion des codes promo, remises dégressives et bannières promotionnelles.

### 🛵 3. Module Livreur (Chauffeur & Télémétrie)

- Agrément et vérification KYC (CNI, permis de conduire, carte grise).
- Console chauffeur avec bascule de statut En Ligne / Hors Ligne et dispatch IA.
- **Guidage GPS Turn-by-Turn embarqué** sans dépendance externe à Google Maps.
- Clôture de course sécurisée : Saisie de l'OTP client + signature tactile sur écran + photo preuve.
- Portefeuille livreur avec rémunération à la course et 100 points de récompense par livraison.

### 🛡️ 4. Module SuperAdmin (Gouvernance & Arbitrage)

- Supervision en temps réel du volume global sous séquestre, du solde bloqué et des commissions (3%).
- Centre de validation KYC des marchands et des chauffeurs livreurs.
- Module d'arbitrage des litiges Escrow (libération forcée vendeur ou remboursement acheteur).
- Piste d'audit cryptographique et horodatée (`activity_logs`) avec conservation des adresses IP.

---

## 🔒 Cycle de Vie du Séquestre Escrow

```
1. Client commande & paie via Mobile Money
   ├── Fonds consignés sur pending_balance (Solde Bloqué)
   ├── Statut commande : 'escrow_held'
   └── Génération du Code Secret OTP à 6 chiffres
       │
2. Vendeur prépare & confie le colis au livreur
   └── Acheminement guidé par GPS OSRM temps réel
       │
3. Validation de Livraison
   ├── Option A : Le Livreur saisit l'OTP transmis par le Client + Signature tactile
   └── Option B : Le Client clique sur "Confirmer la Réception" sur son dashboard
       │
4. Déblocage Automatique
   ├── pending_balance  ──►  balance (Solde Disponible / Retirable)
   ├── Statut commande  ──►  'released' & 'delivered'
   ├── Livreur crédité des frais de course
   └── Client récompensé en points de fidélité
```

---

## 🗺️ Logistique Routière OSRM & Télémétrie

- **Routage OSRM In-App** : Tracé précis épousant les rues, boulevards et carrefours réels de Douala et Yaoundé.
- **Double Polyligne Dynamique** : Segment vert (parcouru) et segment jaune pointillé (restant).
- **Télémétrie en Direct** : Animation fluide du marqueur livreur et calcul permanent de la distance et de l'ETA.
- **Sécurité Triple-Lock** : Code OTP 6 chiffres + Signature client + Photo preuve.

---

## 🤖 Moteur Sellify AI 1.2 Flash

Assistant conversationnel multimodal intégré sous forme de page dédiée et de widget persistant sur tous les dashboards :

- 🎙️ **Reconnaissance Vocale (Speech-to-Text)** et **Synthèse Vocale (Text-to-Speech)**.
- 🛍️ **Copilote Acheteur** : Recherche naturelle de produits, statut de livraison et litiges.
- 🏬 **Copilote Vendeur** : Optimisation de pricing, génération de fiches produits et calcul de marge.
- 🛵 **Copilote Livreur** : Dictée vocale des étapes d'itinéraire et alerte embouteillages.
- 🛡️ **Copilote Admin** : Détection anti-fraude et audit des flux financiers sous séquestre.

---

## 🔑 Comptes de Démonstration (Seeded Credentials)

Tous les comptes de test sont pré-configurés avec le mot de passe standard : `password`.

| Rôle                     | Nom / Profil   | Email                           | Mot de passe | Rôle & Spécificités                                                                                                            |
| :------------------------ | :------------- | :------------------------------ | :----------: | :-------------------------------------------------------------------------------------------------------------------------------- |
| **Vendeur Pro**     | Jean Vendeur   | `vendeur.approved@sellify.me` | `password` | Compte Pro certifié, 2 boutiques actives (*Tech & Gadgets Express*, *Mode & Élégance Cameroun*), Grand Livre & Smart-Links |
| **Vendeur Pending** | Marc Pending   | `vendeur.pending@sellify.me`  | `password` | Compte vendeur en attente de validation KYC                                                                                       |
| **Livreur Moto**    | Pierre Livreur | `livreur.approved@sellify.me` | `password` | Chauffeur moto certifié Douala (Akwa/Bonapriso), console GPS active                                                              |
| **Livreur Auto**    | Alice Pending  | `livreur.pending@sellify.me`  | `password` | Chauffeur voiture en attente KYC (Yaoundé)                                                                                       |
| **Clients**         | Client 1 à 5  | `client1@sellify.me`          | `password` | Acheteurs avec commandes sous séquestre et points fidélité                                                                     |

> 🔒 *Note de Sécurité : Les accès d'administration SuperAdmin sont restreints et gérés de manière sécurisée en production via les variables d'environnement.*

---

## 💻 Stack Technique & Architecture Logicielle

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 STACK TECHNIQUE SELLIFY                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ • Backend Framework    : Laravel 11.x (PHP 8.3+, Architecture MVC & Service Layer)      │
│ • Frontend Framework   : React 19.x + Inertia.js (Single Page Application réactive)    │
│ • UI & Design System   : Tailwind CSS v4 + Cartes Bento + Micro-animations + Lucide    │
│ • Base de Données      : PostgreSQL 16 (Modélisation relationnelle & index géodésiques)│
│ • Cartographie & GPS   : Leaflet.js + OpenStreetMap + Serveur de routage OSRM          │
│ • Intelligence Artif.  : Moteur Sellify AI 1.2 Flash (Streaming SSE, Web Speech API)  │
│ • Sécurité & Auth      : Laravel Sanctum, Middleware KYC, Hachage Argon2id, OTP Secrets│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Guide d'Installation & Lancement Local

### Prérequis

- **PHP** >= 8.3 avec extensions (`pdo_pgsql`, `mbstring`, `openssl`, `curl`, `gd`)
- **Composer** >= 2.x
- **Node.js** >= 20.x & **NPM**
- **PostgreSQL** >= 15.x

### Étapes d'installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/Franck-Dimitri/sellify.git
cd sellify

# 2. Installer les dépendances PHP
composer install

# 3. Installer les dépendances JavaScript
npm install

# 4. Configurer les variables d'environnement
cp .env.example .env
php artisan key:generate

# 5. Configurer la base de données dans .env :
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=sellify_db
# DB_USERNAME=votre_utilisateur
# DB_PASSWORD=votre_mot_de_passe

# 6. Exécuter les migrations et le Seeder officiel
php artisan migrate:fresh --seed

# 7. Créer le lien de stockage pour les fichiers KYC et médias
php artisan storage:link

# 8. Lancer les serveurs de développement
# Dans un terminal :
php artisan serve --port=8001

# Dans un second terminal :
npm run dev
```

L'application est immédiatement accessible à l'adresse : **`http://127.0.0.1:8001`**.

---

## 🧪 Tests Automatisés & Assurance Qualité

Le projet intègre une suite de tests fonctionnels et d'intégration complète couvrant le cycle de vie de l'Escrow, le dispatch livreur, le panier et la sécurité :

```bash
# Exécuter l'ensemble des tests PHPUnit
./vendor/bin/phpunit
```

```
PASS  Tests\Feature\EscrowWorkflowTest
✓ hold escrow on checkout
✓ release escrow on customer confirmation
✓ release escrow on driver otp verification
✓ refund escrow on order cancellation

Tests:    47 passed (255 assertions)
Duration: 12.07s
Result:   100% Success
```

---

## 💰 Modèle Économique (Business Model)

Sellify.me génère ses revenus à travers **3 flux financiers scalables** :

1. **Commission Escrow (3%)** : Prélèvement de 3% sur chaque transaction sécurisée conclue via la marketplace ou les Smart-Links.
2. **Abonnements SaaS Marchands** :
   - *Starter* : Gratuit (jusqu'à 30 produits, 1 boutique).
   - *Pro* : 15 000 FCFA / mois (Boutiques illimitées, Smart-Links avancés, IA Copilote).
   - *Enterprise* : 45 000 FCFA / mois (Comptabilité multi-sites, API & support dédié).
3. **Marge Logistique (10% à 15%)** : Frais d'intermédiation et d'optimisation de tournée sur les livraisons.

---

## 🗺️ Feuille de Route Panafricaine

```
2026 Q3 (Actuel)                2026 Q4                         2027 Q1 - Q2
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│ • Lancement Douala/Ydé  │    │ • Extension Régionale   │    │ • Déploiement CEMAC     │
│ • Escrow OM / MTN MoMo  │ ──►│ • App Mobile Dédiée     │ ──►│   (Gabon, Congo, Tchad) │
│ • Moteur Sellify AI 1.2 │    │ • Hubs de Distribution  │    │ • Hubs de micro-storage │
│ • Smart-Links Sociaux   │    │ • Partenariats Métiers  │    │ • Sellify Cross-Border  │
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
```

---

<div align="center">
