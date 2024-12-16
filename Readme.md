# Forum App

## Table des matières

- [Aperçu général](#aperçu-général)
- [Structure du projet](#structure-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [Prérequis](#prérequis)
- [Installation et utilisation](#installation-et-utilisation)
- [Fonctionnalités](#fonctionnalités)
- [Architecture du backend](#architecture-du-backend)
- [Architecture du frontend](#architecture-du-frontend)
- [Gestion des utilisateurs et de l'authentification](#gestion-des-utilisateurs-et-de-lauthentification)
- [WebSocket et temps réel](#websocket-et-temps-réel)
- [Docker et containerisation](#docker-et-containerisation)
- [Améliorations futures](#améliorations-futures)

## Aperçu général

Cette application est une plateforme de forum permettant aux utilisateurs de créer des topics, publier des posts, répondre à des messages et interagir avec la communauté. Le projet est conçu pour être interactif avec une mise à jour en temps réel des messages grâce à **Socket.IO**. L'application suit une architecture **full stack**, utilisant **Node.js** et **Express** pour le backend, et **React** pour le frontend.

## Structure du projet

```
.
├── Readme.md
├── backend
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── package.json
│   └── src
│       ├── app.js
│       ├── config
│       │   └── db.js
│       ├── controllers
│       │   ├── postController.js
│       │   ├── topicController.js
│       │   └── userController.js
│       ├── middleware
│       │   └── authMiddleware.js
│       ├── models
│       │   ├── Post.js
│       │   ├── Topic.js
│       │   ├── User.js
│       │   └── index.js
│       └── routes
│           ├── topicRoutes.js
│           └── userRoutes.js
├── db
│   └── init.sql
├── docker-compose.yml
└── frontend
    ├── Dockerfile
    ├── package-lock.json
    ├── package.json
    ├── public
    │   └── index.html
    └── src
        ├── App.js
        ├── components
        │   ├── CreateTopicForm.js
        │   ├── Footer.js
        │   ├── Header.js
        │   ├── PostForm.js
        │   ├── TopicsList.js
        │   └── TrendingTopics.js
        ├── css
        │   ├── CreateTopicForm.css
        │   ├── ForumTopic.css
        │   ├── Home.css
        │   ├── Login.css
        │   ├── Profile.css
        │   ├── Signup.css
        │   ├── TopicsList.css
        │   └── TrendingTopics.css
        ├── index.js
        ├── pages
        │   ├── ForumTopic.js
        │   ├── Home.js
        │   ├── Login.js
        │   ├── Profile.js
        │   └── Signup.js
        └── styles
            └── styles.css
```

### Description des dossiers et fichiers

- **backend/** : Contient toute la logique serveur (Express, Sequelize, JWT).
- **frontend/** : Contient l'interface utilisateur avec React.
- **db/init.sql** : Script SQL pour initialiser la base de données.
- **docker-compose.yml** : Fichier Docker Compose pour orchestrer les services (backend, frontend, base de données).

## Technologies utilisées

- **Backend** : Node.js, Express, Sequelize (PostgreSQL)
- **Frontend** : React.js, CSS
- **Base de données** : PostgreSQL
- **WebSocket** : Socket.IO
- **Authentification** : JWT (JSON Web Token)
- **Containerisation** : Docker

## Prérequis

- **Node.js** (version 14+)
- **Docker** (optionnel, recommandé)
- **PostgreSQL** (si utilisé localement)

## Installation et utilisation

### 1. Clone du dépôt

```bash
git clone https://github.com/username/forum-app.git
cd forum-app
```

### 2. Configuration des variables d'environnement

Créer un fichier `.env` dans les répertoires **backend** et **frontend** pour stocker les variables sensibles.

#### Backend

```
PORT=5000
JWT_SECRET=your_secret_key
DATABASE_URL=postgres://user:pass@localhost:5432/dbname
```

#### Frontend

```
REACT_APP_BACKEND_URL=http://localhost:5000
```

### 3. Lancer le backend

Naviguer dans le dossier **backend** :

```bash
cd backend
npm install
npm run dev  # Pour lancer le serveur en mode développement
```

### 4. Lancer le frontend

Naviguer dans le dossier **frontend** :

```bash
cd frontend
npm install
npm start
```

### 5. Docker (optionnel)

Si vous préférez utiliser **Docker**, vous pouvez démarrer les services avec Docker Compose :

```bash
docker-compose up --build
```

Cela démarrera les services backend, frontend, et PostgreSQL dans des conteneurs.

## Fonctionnalités

### Backend

1. **Création de topic** : Les utilisateurs authentifiés peuvent créer des sujets avec un titre et une description.
2. **Affichage des topics et posts** : Les utilisateurs peuvent visualiser tous les topics et leurs discussions.
3. **Réponses aux posts** : Les utilisateurs peuvent répondre aux posts existants.
4. **Authentification** : Utilisation de JWT pour sécuriser les routes (création de posts, réponses).

### Frontend

1. **Formulaire de création de topic** : Les utilisateurs peuvent créer des topics via un formulaire.
2. **Liste des topics** : Affichage de tous les topics dans une page dédiée.
3. **Page des discussions** : Affichage des posts et réponses liés à un topic.
4. **Gestion des utilisateurs** : Pages de login, inscription et profil utilisateur.

## Architecture du backend

- **app.js** : Point d'entrée de l'application Express, configure les middlewares, routes et la connexion à la base de données.
- **routes/** : Contient les routes Express pour les topics et les utilisateurs.
- **models/** : Définit les modèles Sequelize pour les tables `User`, `Post`, `Topic`.
- **controllers/** : Contient la logique métier pour chaque route (gestion des topics, posts, etc.).
- **middleware/authMiddleware.js** : Vérifie les tokens JWT pour protéger les routes sensibles.

## Architecture du frontend

- **App.js** : Fichier principal qui gère les routes du frontend.
- **components/** : Composants réutilisables comme les formulaires de création de topics ou la liste des topics.
- **pages/** : Contient les pages principales comme le formulaire de login, la page d'accueil, et la page des discussions.

## Gestion des utilisateurs et de l'authentification

L'authentification se fait avec **JWT**. Lors de l'inscription ou de la connexion, un token est généré et stocké dans le `localStorage` du navigateur. Ce token est utilisé pour authentifier les requêtes sensibles.

- **Login** : Génère un JWT après validation des identifiants.
- **Middleware de protection** : Les routes comme la création de posts sont protégées par le middleware `protect`, qui vérifie si l'utilisateur a un token valide.

## WebSocket et temps réel

L'application utilise **Socket.IO** pour actualiser les posts et réponses en temps réel :

- Lorsqu'un utilisateur publie un nouveau post ou une réponse, tous les autres utilisateurs reçoivent cette mise à jour instantanément via un événement `newPost`.
- Les sockets sont gérés côté serveur dans le fichier **app.js**.

## Docker et containerisation

L'application est containerisée avec **Docker** :

- Le fichier **Dockerfile** dans chaque répertoire (backend et frontend) définit l'image Docker respective.
- **docker-compose.yml** est utilisé pour orchestrer les différents services, incluant PostgreSQL, le backend, et le frontend.

### Commandes Docker utiles :

- Construire et démarrer tous les services :

  ```bash
  docker-compose up --build
  ```

- Arrêter les services :

  ```bash
  docker-compose down
  ```

## Améliorations futures

1. **Pagination** : Ajouter la pagination pour les topics et les posts.
2. **Système de like** : Permettre aux utilisateurs de liker les posts.
3. **Modération** : Ajouter un rôle administrateur pour gérer les contenus inappropriés.
4. **Notifications push** : Implémenter des notifications push en temps réel.

---

