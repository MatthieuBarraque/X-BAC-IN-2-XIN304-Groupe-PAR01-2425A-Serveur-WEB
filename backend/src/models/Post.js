const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/db');

class Post extends Model {}

Post.init({
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    topicId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Topics',
            key: 'id'
        }
    },
    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Posts',
            key: 'id'
        }
    }
}, {
    sequelize,
    modelName: 'Post',
    timestamps: true
});

Post.associate = (models) => {
    Post.hasMany(models.Post, {
        as: 'Replies',
        foreignKey: 'parentId'
    });
    Post.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User'
    });
    Post.belongsTo(models.Topic, {
        foreignKey: 'topicId',
        as: 'Topic'
    });
};

module.exports = Post;
