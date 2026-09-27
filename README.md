# Plateforme TTSFR - Accompagnement Technique des Coopératives

> **Initiative :** UM6P | Green Tech Institute (GTI) | Fondation OCP  
> **Modèle :** Un Modèle Évolutif pour la Transformation Durable des Coopératives  
> **Développeur :** Issam ZITOUNI (*Architecte en Technologies du Numérique*)

---

## 🌟 Présentation du Projet

La plateforme web **TTSFR** est un système full-stack conçu pour digitaliser le parcours de diagnostic, d'évaluation et d'accompagnement des coopératives marocaines :
* **Diagnostic en 5 étapes :** Secteurs (ODCO), Performance opérationnelle, Performance économique, Maturité organisationnelle, et Maturité technologique & énergétique.
* **Scoring & Clustering automatique :** Affectation de la coopérative à l'un des 6 clusters de référence (*Artisanal traditionnel, Transformation légère, Production mécanisée, Industriel/Extractif, Services organisés, Services cognitifs & numériques*).
* **Restitution & Plan d'action :** Génération de rapports d'audit PDF exportables et plan d'action personnalisé avec suivi des pièces justificatives.
* **Espaces étanches (RBAC) :** Coopératives, Experts TTSFR, Coordinateurs, et Administrateurs.

---

## 🛠️ Stack Technique

* **Frontend :** Next.js 14+ (App Router, TypeScript, Tailwind CSS, Lucide Icons, Shadcn/UI-style components) – *Design 'Mobile-First' & Responsive*.
* **Backend :** FastAPI (Python 3.11+), Pydantic v2, SQLAlchemy 2.0.
* **Base de données :** PostgreSQL 16 (avec colonnes JSONB pour la flexibilité des questionnaires).
* **Conteneurisation :** Docker & Docker Compose.
* **Moteur de rapports :** WeasyPrint / Jinja2 (PDF) & OpenPyXL (Excel).

---

## 🚀 Démarrage Rapide

### 1. Variables d'environnement
Copiez le fichier d'exemple et configurez vos clés :
```bash
cp .env.example .env
```

### 2. Lancement avec Docker Compose
```bash
docker compose up --build
```
* **Frontend :** http://localhost:3000
* **API FastAPI :** http://localhost:8000
* **Documentation OpenAPI (Swagger) :** http://localhost:8000/docs
* **PostgreSQL :** localhost:5432

---

## 📂 Structure du Répertoire

```
ttsfr-platform/
├── PROJECT_PLAN.md        # Plan de cadrage et feuille de route 6 semaines
├── docker-compose.yml     # Orchestration Docker (PostgreSQL, FastAPI, Next.js)
├── .env.example           # Variables d'environnement de référence
├── backend/               # API FastAPI & Moteur de Scoring Python
│   ├── app/
│   │   ├── api/v1/        # Endpoints REST (auth, diagnostics, coopératives...)
│   │   ├── core/          # Configuration, sécurité JWT, base de données
│   │   ├── models/        # Modèles SQLAlchemy (Secteurs ODCO, Clusters, Users)
│   │   ├── schemas/       # Schémas de validation Pydantic
│   │   ├── services/      # Algorithme de scoring et génération PDF
│   │   └── seeds/         # Données initiales (12 secteurs ODCO & 6 clusters)
│   ├── Dockerfile
│   └── requirements.txt
└── frontend/              # Application Next.js (Interface coopérative & Admin)
    ├── src/
    │   ├── app/           # Routes App Router (public, auth, coop, admin)
    │   ├── components/    # Composants UI (Wizard de diagnostic, cartes vertes)
    │   └── lib/           # Utilitaires API et gestion du stockage local
    ├── package.json
    └── tailwind.config.ts
```
