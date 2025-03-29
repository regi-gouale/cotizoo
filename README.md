# Cotizoo - Application de Gestion de Tontines

![Version](https://img.shields.io/badge/version-0.1.2-blue.svg)
![Status](https://img.shields.io/badge/status-développement-orange.svg)

Cotizoo est une application moderne qui simplifie la gestion des tontines avec collecte et redistribution automatique des fonds, ainsi que des options d'assurance pour les membres.

## Table des matières

- [Aperçu du projet](#aperçu-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Pour démarrer](#pour-démarrer)
- [Structure du projet](#structure-du-projet)
- [Développement](#développement)
- [Déploiement](#déploiement)
- [FAQ](#faq)

## Aperçu du projet

### Problème

Les tontines traditionnelles sont souvent gérées manuellement, ce qui entraîne des problèmes de fiabilité, de sécurité et de suivi des fonds.

### Solution

Cotizoo automatise la gestion complète des tontines avec prélèvements et virements automatiques, suivi en temps réel et protection des participants via des options d'assurance.

### Public cible

- Particuliers souhaitant financer des projets personnels
- Associations organisant des projets communs

### Vision à long terme

Devenir la plateforme de référence pour financer des projets individuels ou communs, faire des investissements ou des achats immobiliers via des tontines sécurisées.

## Fonctionnalités

### MVP (Version actuelle)

- Tontines rotatives (chacun reçoit la cagnotte à tour de rôle)
- Configuration personnalisable (durée, montant, fréquence, nombre de membres)
- Options pour l'ordre des bénéficiaires (préétabli, vote, enchères, aléatoire)
- Tableau de bord utilisateur complet et intuitif
- Gestion des défauts de paiement
- Vérification d'identité (KYC)
- Système de notifications (email, push)

### Versions futures

- Tontines d'épargne collective pour projets communs
- Tontines d'investissement avec génération d'intérêts
- Applications mobile dédiées (iOS et Android)

## Technologies

- **Frontend**:

  - TypeScript
  - React
  - Next.js 15
  - TailwindCSS
  - Shadcn UI

- **Backend**:

  - Node.js
  - Prisma ORM
  - PostgreSQL

- **Infrastructure**:
  - Vercel (déploiement)
  - Stripe (paiements sécurisés)

## Pour démarrer

### Prérequis

- Node.js 20.x ou supérieur
- PostgreSQL
- Compte Stripe (pour l'intégration des paiements)

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-username/cotizoo.git
cd cotizoo

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Remplir les valeurs requises dans .env.local

# Démarrer le serveur de développement
pnpm dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) avec votre navigateur pour voir le résultat.

## Structure du projet

```
cotizoo/
├── .github/            # Actions GitHub
├── .vscode/            # Configuration VSCode
├── src/                # Code source de l'application
│   ├── app/            # Configuration de l'application
│   ├── components/     # Composants réutilisables
│   ├── lib/            # Fonctions utilitaires
│   ├── prisma/         # Modèles de données Prisma
│   ├── providers/      # Contextes et hooks
├── public/             # Fichiers statiques
└── docs/               # Documentation du projet
```

L'application prend en charge plusieurs types de tontines et modes de distribution:

- Distribution rotative préétablie
- Distribution par vote
- Distribution par enchères
- Distribution aléatoire

### Modèle économique

- Abonnement de 10€/mois pour les tontines avec collectes inférieures à 1000€
- Commission de 1% sur les transactions pour des collectes mensuelles supérieures à 1000€

### Sécurité et conformité

- Utilisation d'un compte séquestre rémunéré au taux court terme de la BCE
- Vérification d'identité obligatoire
- Intégration de Stripe pour sécuriser les paiements

## Déploiement

Le déploiement se fait via la [plateforme Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), créateurs de Next.js.

Pour plus de détails sur le déploiement Next.js, consultez la [documentation de déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying).

## FAQ

### Comment sont gérés les impayés ou retards de paiement?

- Les participants sont informés des retards de paiement
- Frais d'échec de prélèvement de 5€ par échec
- Exclusion de la tontine après 3 échecs ou retards consécutifs

### Comment les fonds sont-ils sécurisés?

Tous les fonds sont gérés via un compte séquestre rémunéré au taux court terme de la BCE, garantissant leur sécurité et transparence.

### L'application est-elle accessible sur mobile?

Oui, l'application est accessible sur mobile et bureau. Des applications mobiles natives pour Android et iOS sont prévues dans les prochaines versions.

---

Pour plus d'informations, contactez-nous à [contact@cotizoo.com](mailto:contact@cotizoo.com).
