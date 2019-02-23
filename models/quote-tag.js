const Sequelize = require('sequelize');
const db = require('../utils/database');

const QuoteTag = db.define('quote_tag', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
}, {
    timestamps: true,
    updatedAt: false,
    underscored: true,
});

module.exports = QuoteTag;