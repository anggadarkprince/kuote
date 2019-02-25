const Quote = require('../models/quote');
const db = require('../utils/database');
const error = require('../utils/error');

const getIndex = (req, res, next) => {
    const user = req.user;
    const quote = Quote.findAll({
        order: db.random(),
        limit: 4
    })
        .then(quotes => {
            res.render('dashboard/index', {
                title: 'Dashboard',
                user: user,
                quotes: quotes
            });
        })
        .catch((err) => {
            error.errorHandler(err, next);
        });
};

module.exports = {
    getIndex: getIndex
};