const { Sequelize } = require('sequelize');
const { Topic, Post, User } = require('../models');

exports.createTopic = async (req, res) => {
    try {
        const { title, description } = req.body;
        const topic = await Topic.create({ title, description });

        const io = req.app.get('socketio');
        io.emit('newTopic', topic);

        res.status(201).json(topic);
    } catch (error) {
        console.error('Error creating topic:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getTopics = async (req, res) => {
    try {
        const topics = await Topic.findAll();
        res.status(200).json(topics);
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTopicWithPosts = async (req, res) => {
    try {
        const topic = await Topic.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: Post,
                    as: 'Posts',
                    include: [
                        {
                            model: Post,
                            as: 'Replies',
                            include: [
                                {
                                    model: User,
                                    as: 'User'
                                }
                            ]
                        },
                        {
                            model: User,
                            as: 'User'
                        }
                    ]
                }
            ]
        });

        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        res.json(topic);
    } catch (error) {
        console.error('Error fetching topic with posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.createPost = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        console.log('Creating post for user:', req.user.username);

        const { content } = req.body;
        const post = await Post.create({
            content,
            userId: req.user.id,
            topicId: req.params.id
        });
        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getTrendingTopics = async (req, res) => {
    try {
        const trendingTopics = await Topic.findAll({
            attributes: [
                'id',
                'title',
                [Sequelize.literal('(SELECT COUNT(*) FROM "Posts" WHERE "Posts"."topicId" = "Topic"."id")'), 'postCount']
            ],
            order: [[Sequelize.literal('(SELECT COUNT(*) FROM "Posts" WHERE "Posts"."topicId" = "Topic"."id")'), 'DESC']],
            limit: 5
        });

        res.json(trendingTopics);
    } catch (error) {
        console.error('Error fetching trending topics:', error);
        res.status(500).json({ message: 'Error fetching trending topics' });
    }
};