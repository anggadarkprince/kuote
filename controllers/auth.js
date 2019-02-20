const fs = require('fs');
const path = require('path');

const getLogin = (req, res, next) => {
    res.render('auth/login', {
        title: 'Login',
    });
};

const getRegister = (req, res, next) => {
    res.render('auth/register', {
        title: 'Register',
    });
};

module.exports = {
    getLogin: getLogin,
    getRegister: getRegister,
};