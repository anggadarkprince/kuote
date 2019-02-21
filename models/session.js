const Sequelize = require('sequelize');
const db = require('../utils/database');

const Session = db.define('session', {
    sid: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    expires: Sequelize.DATE,
    data: Sequelize.STRING(50000)
}, {
    timestamps: true,
    underscored: true,
});

module.exports = Session;