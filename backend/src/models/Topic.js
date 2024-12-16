const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');
const Post = require('./Post');

class Topic extends Model {}

Topic.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'Topic'
});

Topic.hasMany(Post, { foreignKey: 'topicId', as: 'posts', onDelete: 'CASCADE' });
Post.belongsTo(Topic, { foreignKey: 'topicId', as: 'topic' });


module.exports = Topic;
