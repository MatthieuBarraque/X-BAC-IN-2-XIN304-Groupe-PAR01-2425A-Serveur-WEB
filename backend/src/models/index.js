const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:pass@localhost:5432/dbname');

const User = require('./User');
const Post = require('./Post');
const Topic = require('./Topic');

Post.associate({ User, Topic, Post });
Topic.hasMany(Post, { foreignKey: 'topicId', onDelete: 'CASCADE' });
Post.belongsTo(Topic, { foreignKey: 'topicId' });
User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    sequelize,
    User,
    Post,
    Topic,
};
