# CAHIER DES CHARGES FONCTIONNEL ET TECHNIQUE (CDCF / CDCT)
## Plateforme Technologique TTSFR
### *Un Modèle Évolutif pour la Transformation Durable des Coopératives Marocaines*

---

| Métadonnée | Détail |
| :--- | :--- |
| **Projet** | Plateforme TTSFR (Transformation Technique & Sociale des Filières Résilientes) |
| **Client Commanditaire** | Université Mohammed VI Polytechnique (UM6P) & Green Tech Institute (GTI) |
| **Partenaires Institutionnels** | Fondation OCP & Office du Développement de la Coopération (ODCO) |
| **Auteur / Prestataire** | Issam ZITOUNI (*Architecte en Technologies du Numérique*) |
| **Contrat** | Prestation d'Ingénierie Numérique — Livrable 1 (Mois 9) |
| **Version** | 1.0 (Validée / Conforme au contrat) |
| **Date** | 28 Octobre 2026 |

---

## 1. Contexte, Enjeux et Objectifs Généraux

### 1.1 Contexte du Projet
Dans le cadre de l'accompagnement stratégique et technique des coopératives marocaines, l'**Université Mohammed VI Polytechnique (UM6P)** et le **Green Tech Institute (GTI)**, en partenariat avec la **Fondation OCP** et l'**ODCO**, ont conceptualisé un modèle d'évaluation et de transformation durable. 

Ce modèle repose sur une approche holistique combinant l'analyse institutionnelle (secteurs d'activité nationaux), l'évaluation multidimensionnelle de la maturité (Matrice 4D) et la classification algorithmique en 6 archétypes fonctionnels (Clusters).

### 1.2 Objectif de la Plateforme Numérique
La plateforme TTSFR est un portail SaaS web full-stack sécurisé destiné à :
1. **Digitaliser le diagnostic de maturité** des coopératives à travers un parcours interactif et intuitif en 5 étapes.
2. **Calculer automatiquement les scores de maturité factoriels** sur 4 dimensions clés (Gouvernance, Économie, Climat/Énergie, Social).
3. **Assigner de façon déterministe un Cluster technico-fonctionnel** (parmi 6 archétypes) via un moteur de règles mathématiques calibré.
4. **Prescrire un plan d'action personnalisé** et orienter la coopérative vers les familles de modules d'accompagnement prioritaires.
5. **Offrir un outil de pilotage et d'audit pour le comité scientifique de l'UM6P / GTI**, permettant le suivi de cohortes pilotes (Benguerir, Taroudant).

---

## 2. Cahier des Charges Fonctionnel (CDCF)

### 2.1 Gestion des Utilisateurs et Rôles (RBAC)
La plateforme distingue deux espaces majeurs avec contrôle strict des accès :
1. **Rôle Coopérative (`COOPERATIVE`) :**
   * Création de compte autonome ou accès direct 1-clic pour les coopératives pilotes.
   * Renseignement et mise à jour du profil coopérative (raison sociale, secteur ODCO, région, ville, effectif total, femmes membres, descriptif d'activité).
   * Passation du diagnostic en 5 étapes avec auto-sauvegarde automatique.
   * Consultation des résultats (score global, décomposition 4D, cluster attribué, plan d'action et recommandations de modules).
2. **Rôle Superviseur / Administrateur (`ADMIN`, `COORDINATOR`, `EXPERT`) :**
   * Vue consolidée de la cohorte des coopératives enregistrées.
   * Recherche, tri et filtrage multicritères par cluster et par secteur d'activité.
   * Audit approfondi de la fiche détaillée de chaque coopérative et de ses réponses au diagnostic.
   * Export des données consolidées vers Excel (`.xlsx`).

### 2.2 Référentiel Sectoriel National ODCO
La plateforme intègre la nomenclature officielle de l'ODCO comprenant :
* **24 secteurs d'activité institutionnels** (Agriculture, Artisanat, Denrées alimentaires, Plantes aromatiques et médicinales - PAM, Pêche maritime, Tourisme, Forêt, Conseil, etc.).
* **237 sous-secteurs d'activité proposés**, assurant une granularité métier fine (ex. *Production primaire céréalière*, *Arboriculture*, *Apiculture*, *Élevage*, *Extraction d'huiles*, *Tissage traditionnel*, etc.).

### 2.3 Parcours de Diagnostic Interactif en 5 Étapes
Le diagnostic se décompose selon l'arborescence officielle :
* **Étape 1 : Rattachement Sectoriel & Profilage Métier (P1 à P5)**
  * Sélection du secteur et sous-secteur ODCO.
  * 5 questions de profilage cluster avec pondération mathématique :
    * *P1 : Type de processus principal* (Poids : 35%).
    * *P2 : Intensité énergétique de l'activité* (Poids : 15%).
    * *P3 : Niveau de digitalisation des opérations* (Poids : 20%).
    * *P4 : Échelle de commercialisation* (Poids : 15%).
    * *P5 : Régularité des flux de production* (Poids : 15%).
* **Étape 2 : Performance Opérationnelle (O1 à O5)**
  * 5 critères notés de 0 à 4 : Standardisation des méthodes, maîtrise des cadences, hygiène et traçabilité, gestion des stocks, maintenance des équipements.
* **Étape 3 : Performance Économique & Financière (E1 à E5)**
  * 5 critères notés de 0 à 4 : Tenue comptable régulière, rentabilité et marges, gestion du besoin en fonds de roulement (BFR), diversification des clients, accès aux financements.
* **Étape 4 : Maturité Organisationnelle & Gouvernance (G1 à G5)**
  * 5 critères notés de 0 à 4 : Tenue des assemblées générales, répartition claire des rôles, participation des adhérents, conformité légale Law 112-12, gestion prévisionnelle des compétences.
* **Étape 5 : Maturité Technologique & Écologique (T1 à T5)**
  * 5 critères notés de 0 à 4 : Équipements mécanisés, efficacité énergétique, gestion de la ressource en eau et déchets, utilisation des outils numériques, démarche éco-responsable.

### 2.4 Moteur Mathématique de Scoring 4D et Attribution de Cluster
L'évaluation repose sur les formules exactes du modèle client (`TTSFR_Diagnostic_MVP_Calcul.xlsx`) :
* **Scores Dimensionnels (0 à 100%) :**
  $$\text{Score Dimension} = \left(\frac{\sum \text{Notes critères}}{20}\right) \times 100$$
* **Score Global de Maturité :** Moyenne arithmétique ou pondérée des 4 dimensions.
* **Classification en 6 Clusters Officiels :**
  1. *Artisanal traditionnel* : Savoir-faire manuel, outillage traditionnel, faible intensité énergétique.
  2. *Transformation légère* : Semi-mécanisation, petite ligne de conditionnement, flux réguliers.
  3. *Production mécanisée* : Équipements automatisés, besoin fort en maintenance et en efficacité énergétique.
  4. *Industriel / Extractif* : Procédés lourds, fortes puissances thermiques/mécaniques, volumes élevés.
  5. *Services organisés* : Logistique, transport, accueil, écotourisme, services collectifs.
  6. *Services cognitifs & numériques* : Conseil, ingénierie, gestion, commerce électronique.

### 2.5 Moteur de Prescription et Plan d'Action
* **Logique corrective :** Priorisation d'actions ciblées sur la dimension ayant obtenu le score le plus faible.
* **Logique stratégique :** Renforcement des atouts compétitifs pour accélérer la croissance.
* **Orientation vers 4 familles de modules :** Modules transversaux, modules sectoriels spécifiques, modules technologiques/verts, et modules par niveau de maturité.

---

## 3. Cahier des Charges Technique (CDCT)

### 3.1 Architecture Système Globale
La solution repose sur une architecture moderne à services découplés, orchestrée par conteneurisation Docker :
* **Couche Frontend (Présentation) :** Next.js 14 avec App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons.
* **Couche Backend (API Métier) :** FastAPI (Python 3.11), Uvicorn, SQLAlchemy 2.0 ORM, Pydantic V2 pour la validation de schémas.
* **Couche Persistance (Données) :** PostgreSQL 16 avec volumes persistants, contraintes d'intégrité relationnelle et indexation optimisée.
* **Orchestration & Déploiement :** Docker Compose avec réseau interne isolé (`app-network`).

### 3.2 Modèle de Données Relationnel (PostgreSQL)
* `users` : Comptes utilisateurs, e-mail unique, hash bcrypt, rôle (`COOPERATIVE` / `ADMIN`), téléphone, statut actif.
* `cooperatives` : Entité coopérative liée à un utilisateur (relation 1-to-1), nom, référence ODCO (secteur / sous-secteur), région marocaine, ville, effectif membres, femmes membres, descriptif.
* `sectors` & `sub_sectors` : Référentiel ODCO avec codes normalisés et index d'affichage.
* `clusters` : Définition des 6 archétypes, code, intitulé, descriptif, code couleur institutionnel et icône associée.
* `diagnostic_submissions` : Enregistrement de chaque soumission, statut (`DRAFT` / `SUBMITTED`), étape courante, payload JSONB des réponses, scores 4D normalisés, score global, clé étrangère vers le cluster attribué, version de règles.
* `action_plans` & `action_items` : Plan d'action personnalisé lié au diagnostic, items ordonnés par domaine avec objectif, action concrète, responsable, échéance et statut (`TODO`, `IN_PROGRESS`, `DONE`).

### 3.3 Sécurité, Multi-Tenancy et Confidentialité
* **Authentification stateless :** Émission de jetons JWT cryptés avec expiration configurable.
* **Isolation stricte Multi-Tenant :** Middleware et dépendances de sécurité vérifiant systématiquement la propriété des données (`verify_cooperative_access`). Une coopérative ne peut en aucun cas lire ou modifier les données d'une autre entité.
* **Validation et aseptisation des entrées :** Typage strict via Pydantic interdisant les injections et rejets de payloads non conformes.
* **Gestion des variables d'environnement :** Séparation des secrets (`.env`) hors du code source.

### 3.4 Assurance Qualité et Intégration Continue
* **Tests unitaires et d'intégration :** Suite automatisée `pytest` intégrant la vérification des calculs de scoring au millième près contre le benchmark Excel de l'UM6P, ainsi que les tests de ségrégation des accès.
* **Analyse statique et Linting :**
  * `npm run lint` / Next.js ESLint (0 erreur, 0 avertissement).
  * Validation stricte des types TypeScript (`npx tsc --noEmit`).
* **Commandes standardisées :** Fichier `Makefile` fournissant des cibles unifiées (`make test`, `make lint-frontend`, `make dev`, `make clean`).

---

## 4. Matrice de Traçabilité des Livrables Contractuels

| Jalon Contractuel | Livrable Prévu | État d'Avancement | Livrables Produits / Artefacts |
| :--- | :--- | :---: | :--- |
| **Mois 9** | **1. Cahier des charges fonctionnel et technique** | **100% Finalisé** | Présent document de référence (CDCF/CDCT v1.0). |
| **Mois 9** | **2. Maquettes graphiques & architecture technique** | **100% Finalisé** | Design system institutionnel UM6P/GTI, arborescence validée, conteneurisation Docker opérationnelle. |
| **Mois 10** | **3. Plateforme full stack intégrant les 2 pilotes** | **100% Opérationnel** | Plateforme Next.js + FastAPI active, données réelles des coopératives de Benguerir et Taroudant pré-intégrées avec accès 1-clic. |
| **Mois 10** | **4. Module de diagnostic, scoring, cluster & plan d'action** | **95% Opérationnel** | Wizard 5 étapes, algorithme mathématique de scoring exact validé par tests unitaires, 6 clusters ciblés et restitution des plans d'action. |
| **Mois 11** | **5. Espace administration & tableaux de bord** | En cours (~80%) | Console d'audit cohorte, filtres multicritères et fiches détaillées d'inspection. |
| **Mois 11** | **6. Code source, documentation & guides d'utilisation** | Planifié | Dépôt Git documenté, README technique et documentation Swagger OpenAPI. |
| **Mois 11** | **7. Déploiement final, tests & transfert de compétences** | Planifié | Déploiement serveur de production, protocole de recette et PV de clôture. |

---

*Document établi et validé pour faire valoir ce que de droit dans le cadre de la prestation d'ingénierie numérique de la plateforme TTSFR.*
