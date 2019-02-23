const Sequelize = require('sequelize');
const db = require('../utils/database');
const User = require('./user');

const Quote = db.define('quote', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    author: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    quote: {
        type: Sequelize.STRING(500),
        allowNull: false,
    },
    featured: {
        type: Sequelize.STRING(500),
        allowNull: true,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
        validate: {
            len: [0,300]
        }
    },
    views: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    }
}, {
    timestamps: true,
    underscored: true,
});

module.exports = Quote;