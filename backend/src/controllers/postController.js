const Post = require('../models/Post');
const Topic = require('../models/Topic');
const User = require('../models/User');

exports.createPost = async (req, res) => {
    const { content, parentId } = req.body;
    const topicId = req.params.id;
    const userId = req.user.id;

    try {
        const topic = await Topic.findByPk(topicId);

        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        const newPost = await Post.create({
            content,
            userId,
            topicId,
            parentId
        });

        const fullPost = await Post.findByPk(newPost.id, {
            include: [{ model: User, attributes: ['username'] }, { model: Post, as: 'Replies' }]
        });

        const io = req.app.get('socketio');
        io.emit('newPost', fullPost);

        res.status(201).json(fullPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getTopicWithPosts = async (req, res) => {
    try {
        const topic = await Topic.findByPk(req.params.id, {
            include: [{
                model: Post,
                include: [
                    { model: User, attributes: ['username'] },
                    // fettch weeeeeeeeeeeeeeeeesh
                    { model: Post, as: 'Replies', include: [{ model: User, attributes: ['username'] }] }
                ]
            }]
        });

        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        res.status(200).json(topic);
    } catch (error) {
        console.error('Error fetching topic with posts:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
