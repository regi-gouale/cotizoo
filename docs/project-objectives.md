## **1️⃣ Objectifs Généraux**

### Quel problème précis mon application résout-elle ?

L'application résout les problèmes suivants:

- Collète et rédistribution automatique des fonds des tontines
- Possibilité de souscrire à une assurance en cas de décès d'un membre de la tontine pour rembourser les autres et ses ayant droits s'il n'a pas encore récupéré ses fonds

### Qui sont les utilisateurs cibles (particuliers, entreprises, associations) ?

Les utilisateurs cibles de l'applications sont :

- les particuliers
- les associations

### Mon application est-elle une simple gestion de tontine ou intègre-t-elle des fonctionnalités avancées (investissement, assurance, crédit) ?

L'application permet :

- la gestion des tontines
- la possibilité d'avoir des assurances

### Quelle est ma vision à long terme pour cette application ?

La vision long terme de l'application est qu'elle puisse être utilisée par des particuliers ou des associations pour financer des projets individuels ou communs, faire des investissements ou des achats immobiliers.

---

## **2️⃣ Modèle de Tontine et Fonctionnalités**

### Quel(s) type(s) de tontine vais-je proposer ?

L'application va proposer :

- Tontine rotative (chacun reçoit la cagnotte à tour de rôle) disponible lors du MVP
- Tontine d’épargne collective (les membres épargnent pour un projet commun) dans un second temps
- Tontine d’investissement (les fonds sont placés et génèrent des intérêts) plus tard dans le développement

### Est-ce que l’ordre des bénéficiaires est fixé à l’avance ou décidé dynamiquement (vote, enchères, aléatoire) ?

Le choix se fait par le créateur de la tontine, celui-ci peut :

- décider à l'avance dans quel ordre chaque membre reçoit les fonds
- faire une allocation dynamique des redistribution soit :
  - par vote
  - par enchère
  - aléatoirement

### Quelle flexibilité offrir dans la gestion des tontines (durée, montant, fréquence des cotisations) ?

Les tontines peuvent être configurées selon :

- la durée
- le montant
- la fréquence
- le nombre de membres

### Comment gérer les impayés ou retards de paiement ?

En cas d'impayés ou de retards de paiement, la procédure est la suivante :

- informer le participants qu'il y a un retard de paiement ou un impayé
- frais d'échec de prélévement de 5€ par échec
- si 3 échecs ou retards consécutifs, exclusion de la tontine et notification à l'ensemble des participants

---

## **3️⃣ Expérience Utilisateur et Interface**

### L’application doit-elle être accessible via mobile ou seulement sur desktop ?

L'application est accéssible sur mobile et bureau, de même que des applications mobile seront disponible sur android et iOS

### Quels sont les éléments clés du tableau de bord utilisateur ?

#### Vue d'ensemble des tontines :

**Liste des tontines :**

- Un tableau ou une liste déroulante affichant toutes les tontines auxquelles l'utilisateur participe.
- Pour chaque tontine, afficher le nom, le statut (en cours, terminée), et un résumé des informations clés (montant total, prochaine échéance).
  **Tableau de bord global :**
- Un récapitulatif des informations financières combinées de toutes les tontines (montant total épargné, montant total dû, etc.).
- Des graphiques montrant la répartition des fonds entre les différentes tontines.
- Un calendrier consolidé des prochaines échéances de paiement pour toutes les tontines.

#### Tableau de bord individuel par tontine :

**Informations spécifiques à la tontine sélectionnée :**

- Une fois qu'une tontine est sélectionnée, le tableau de bord affiche les informations détaillées mentionnées précédemment (informations générales, statut des paiements, informations financières, informations sur les membres, indicateurs de performance).
- Navigation facile entre les tableaux de bord des différentes tontines.
  **Notifications spécifiques à la tontine :**
- Les alertes et notifications doivent être clairement identifiées pour chaque tontine (par exemple, "Rappel de paiement pour la tontine 'Vacances en famille'").

#### Personnalisation et filtres :

**Filtres par statut :**

- Permettre aux utilisateurs de filtrer les tontines par statut (en cours, en retard, terminées).
  **Filtres par type :**
- Si l'application propose différents types de tontines (épargne, crédit, etc.), permettre aux utilisateurs de les filtrer.
  **Personnalisation des alertes :**
- Permettre aux utilisateurs de configurer des alertes spécifiques pour chaque tontine (par exemple, des alertes de retard uniquement pour les tontines à haut risque).

#### Communication et collaboration :

**Espaces de discussion par tontine :**

- Intégrer des espaces de discussion dédiés à chaque tontine pour faciliter la communication entre les membres.
  **Partage de documents :**
- Permettre le partage de documents importants (règlement intérieur, contrats, etc.) au sein de chaque tontine.

#### Sécurité et confidentialité renforcées :

**Accès différencié :**

- Garantir que les informations et les actions sont limitées aux membres de chaque tontine respective.
  **Journal d'activité :**
- Un journal d'activité par tontine, qui retrace toutes les actions effectuées.

### Faut-il intégrer un système de notifications (email, SMS, push) ?

Il faudra intégrer des notifications par emails et des push

### Comment simplifier la gestion des tontines pour des utilisateurs non techniques ?

L'UX/UI doit être optimisée pour les utilisateurs non techniques

---

## **4️⃣ Sécurité et Conformité**

### Comment s’assurer que les fonds sont bien gérés et protégés ?

Pour s'assurer que les fonds sont bien gérés et bien protégés, un compte séquestre sera utilisé, il sera rémunéré au taux court terme de la BCE

### Faut-il intégrer une vérification d’identité (KYC) pour éviter les fraudes ?

Il faudra intégrer une vérification d'identité

### Comment sécuriser les paiements et les données sensibles ?

Un prestataire, Stripe en l'occurence, sera utilisé pour sécuriser les paiements et les données sensibles

---

## **5️⃣ Modèle Économique**

### L’application sera-t-elle gratuite, avec un abonnement ou une commission sur les transactions ?

La facturation de l'application est la suivante :

- un abonnement de 10€/mois lorsque les montants collectés pour une tontine sont inférieurs à 1000€
- une commission de 1% sur les transactions pour des montants de collectes mensuels supérieurs à 1000€

### Y aura-t-il des fonctionnalités premium (ex. automatisation, gestion avancée) ?

Non il n'y aura pas de fonctionnalités premium en plus tout sera compris dans l'offre

### Comment assurer la rentabilité tout en restant attractif pour les utilisateurs ?

La plus part des concurrents ont un taux d'environ 3% sur les transactions

---

## **6️⃣ Développement et Scalabilité**

### Quel est mon objectif de lancement : un prototype, une version beta privée ou un produit fini ?

Pour le lancement, il faudra un produit fini avec le minimum de fonctionnalités de bases

### À quelle échelle je veux déployer l’application (locale, nationale, internationale) ?

L'application sera déployée au niveau local au début, puis au niveau international

### Quels sont les principaux défis techniques à anticiper (scalabilité, performance) ?

La création d'une application de gestion de tontines avec prélèvements et virements automatiques implique de nombreux défis techniques. Voici les principaux :

#### Sécurité et confidentialité des données :

Protection des informations sensibles :

- Les données financières et personnelles des membres doivent être protégées contre les accès non autorisés, les piratages et les fuites de données.
- Il est essentiel de mettre en place des mesures de sécurité robustes, telles que le chiffrement des données, l'authentification à deux facteurs et les audits de sécurité réguliers.  
  Conformité aux réglementations :
- L'application doit respecter les réglementations en matière de protection des données (RGPD, etc.) et les normes de sécurité bancaire.

#### Intégration des systèmes de paiement :

Connexion aux API bancaires et aux services de paiement :

- L'intégration avec les API bancaires et les services de paiement mobile peut être complexe et nécessite une expertise technique approfondie.
- Il est important de choisir des partenaires de paiement fiables et sécurisés.
  Gestion des transactions :
- L'application doit être capable de gérer les transactions de manière fiable et sécurisée, en assurant la traçabilité et la transparence des opérations.
- Il est essentiel de prévoir des mécanismes de gestion des erreurs et de résolution des litiges.

#### Automatisation des processus :

Programmation des prélèvements et des virements automatiques :

- L'automatisation des prélèvements et des virements nécessite une programmation précise et fiable.
- Il est important de prévoir des mécanismes de gestion des échéances, des retards et des impayés.
  Gestion des notifications et des alertes :
- L'application doit être capable d'envoyer des notifications et des alertes pertinentes aux membres, en temps réel.
- Il est important de personnaliser les notifications en fonction des préférences de chaque utilisateur.

#### Scalabilité et performance :

Gestion d'un grand nombre d'utilisateurs et de transactions :

- L'application doit être capable de gérer un grand nombre d'utilisateurs et de transactions simultanées, sans compromettre les performances.
- Il est essentiel de prévoir une architecture évolutive et des mécanismes d'optimisation des performances.
  Compatibilité avec différents appareils et systèmes d'exploitation :
- L'application doit être compatible avec différents appareils (smartphones, tablettes) et systèmes d'exploitation (iOS, Android).

#### Expérience utilisateur (UX) et interface utilisateur (UI) :

Conception d'une interface intuitive et conviviale :

- L'application doit être facile à utiliser pour tous les membres, quel que soit leur niveau de compétence technique.
- Il est essentiel de réaliser des tests d'utilisabilité pour identifier et corriger les problèmes d'ergonomie.
  Accessibilité :
- L'application doit être accessible aux personnes en situation de handicap.

#### Gestion des mises à jour et de la maintenance :

Déploiement de mises à jour régulières :

- L'application doit être régulièrement mise à jour pour corriger les bugs, améliorer les performances et ajouter de nouvelles fonctionnalités.
- Il est important de prévoir un processus de déploiement efficace et transparent.  
  Maintenance préventive et corrective :
- L'application doit être régulièrement surveillée pour détecter et corriger les problèmes techniques.
- Il est essentiel de prévoir un plan de maintenance préventive et corrective.
