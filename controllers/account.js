const bcrypt = require('bcryptjs');
const User = require('../models/user');
const error = require('../utils/error');

const getAccount = (req, res, next) => {
    res.render('account/index', {
        title: 'Account',
        user: req.user
    });
};

const updateAccount = (req, res, next) => {
    const {name, username, email, new_password: newPassword, confirm_password: confirmPassword} = req.body;

    req.user.name = name;
    req.user.username = username;
    req.user.email = email;

    if (newPassword) {
        if (newPassword == confirmPassword) {
            req.user.password = bcrypt.hashSync(newPassword, 12);
        } else {
            req.flash('error', 'Confirm password does not match!');
            req.flash('old', req.body);
            return res.redirect('/account');
        }
    }

    req.user.save()
        .then(user => {
            req.flash('success', 'Your account is updated!');
            res.redirect('/account');
        })
        .catch(err => {
            error.errorHandler(err, next);
        });
};

module.exports = {
    getAccount: getAccount,
    updateAccount: updateAccount
};