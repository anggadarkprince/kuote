const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: 'localhost', port: 3306, dialect: 'mysql', operatorsAliases: false,
});

module.exports = sequelize;