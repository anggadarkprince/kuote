const bcrypt = require('bcryptjs');
const User = require('../models/user');
const error = require('../utils/error');

const getLogin = (req, res) => {
    res.render('auth/login', {
        title: 'Login',
    });
};

const getRegister = (req, res) => {
    res.render('auth/register', {
        title: 'Register',
    });
};

const postRegister = (req, res, next) => {
    const {name, username, email, password} = req.body;

    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({name, username, email, password: hashedPassword, cart: {items: []}});
            return user.save();
        })
        .then(() => {
            req.flash('success', 'You are registered!');
            res.redirect('/login');
        })
        .catch((err) => {
            error.errorHandler(err, next);
        });
};

const postLogin = (req, res, next) => {
    const {username, password} = req.body;

    let condition = {username: username};
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(username).toLowerCase())) {
        condition = {email: username};
    }

    let createdUser;
    User.findOne({where: condition})
        .then(user => {
            if (user) {
                createdUser = user;
                return bcrypt.compare(password, user.password);
            }
        })
        .then(matchedPassword => {
            if (matchedPassword) {
                req.session.isLoggedIn = true;
                req.session.userId = createdUser.id;
                req.session.save();
                res.redirect('/quotes');
            } else {
                req.flash('error', 'Invalid credentials, try again!');
                res.redirect('/login');
            }
        })
        .catch((err) => {
            error.errorHandler(err, next);
        });
};

const postLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

module.exports = {
    getLogin: getLogin,
    postLogin: postLogin,
    getRegister: getRegister,
    postRegister: postRegister,
    postLogout: postLogout,
};