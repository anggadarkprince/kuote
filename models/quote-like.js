const Sequelize = require('sequelize');
const db = require('../utils/database');

const QuoteLike = db.define('quote_like', {
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

module.exports = QuoteLike;