const Quote = require('../models/quotes');
const db = require('../utils/database');

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
        });
};

module.exports = {
    getIndex: getIndex
};