const Sequelize = require('sequelize');
const db = require('../utils/database');

const QuoteComment = db.define('quote_comment', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    comment: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            len: [0,1000]
        }
    }
}, {
    timestamps: true,
    updatedAt: false,
    underscored: true,
});

module.exports = QuoteComment;