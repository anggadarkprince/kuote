const Quote = require('../models/quotes');
const db = require('../utils/database');

const index = (req, res, next) => {
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

const createQuote = (req, res, next) => {

}
const saveQuote = (req, res, next) => {

}
const editQuote = (req, res, next) => {

}
const updateQuote = (req, res, next) => {

}
const deleteQuote = (req, res, next) => {

}
const viewQuote = (req, res, next) => {

}

module.exports = {
    index: index,
    create: createQuote,
    save: saveQuote,
    edit: editQuote,
    update: updateQuote,
    delete: deleteQuote,
    view: viewQuote,
};