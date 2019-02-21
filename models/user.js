const Sequelize = require('sequelize');
const db = require('../utils/database');

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true,
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    status: {
        type:   Sequelize.ENUM,
        values: ['active', 'pending', 'suspended'],
        defaultValue: 'pending'
    }
}, {
    timestamps: true,
    underscored: true,
});

module.exports = User;