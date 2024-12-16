const express = require('express');
const { createTopic, getTopics, getTrendingTopics, getTopicWithPosts } = require('../controllers/topicController');
const { createPost } = require('../controllers/postController');  // Utilise le contrôleur pour les posts
const { protect } = require('../middleware/authMiddleware');  // Middleware pour protéger les routes

const router = express.Router();

// Route pour créer un topic
router.post('/', protect, createTopic);

// Route pour récupérer tous les topics
router.get('/', getTopics);

// Route pour récupérer les topics tendance (trending)
router.get('/trending', getTrendingTopics);  // New route for trending topics

// Route pour récupérer un topic avec ses posts
router.get('/:id', getTopicWithPosts);

// Route pour créer un post dans un topic spécifique (inclut les réponses avec parentId)
router.post('/:id/posts', protect, createPost);  // Cette route est utilisée pour les posts et les réponses

module.exports = router;
