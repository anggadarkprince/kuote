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
    quote: {
        type: Sequelize.STRING(200),
        allowNull: false,
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
        default: 0,
        validate: {
            min: 0
        }
    }
}, {
    timestamps: true,
    underscored: true,
});

module.exports = Quote;