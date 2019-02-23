const Sequelize = require('sequelize');
const db = require('../utils/database');

const Tag = db.define('tag', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    tag: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
}, {
    timestamps: true,
    updatedAt: false,
    underscored: true,
});

module.exports = Tag;