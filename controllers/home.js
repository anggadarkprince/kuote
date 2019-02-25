const Op = require("sequelize/lib/operators");
const Quote = require('../models/quote');
const Tag = require('../models/tag');
const User = require('../models/user');
const db = require('../utils/database');

const getIndex = (req, res, next) => {
    const quoteThumbnails = Quote.findAll({
        include: [User],
        where: {
            [Op.not]: [{'featured': ''}, {'featured': null}],
        },
        order: db.random(),
        limit: 3
    });

    const quoteFull = Quote.findOne({
        include: [Tag, User],
        where: {
            [Op.not]: [{'featured': ''}, {'featured': null}, {'description': ''}, {'description': null}],
        },
        order: db.random(),
        limit: 1
    });

    const quoteSimples = Quote.findAll({
        include: [Tag, User],
        where: {
            [Op.not]: [{'description': ''}, {'description': null}],
        },
        order: db.random(),
        limit: 2
    });

    Promise.all([quoteThumbnails, quoteFull, quoteSimples])
        .then((data) => {
            res.render('home/index', {
                title: 'Home',
                quoteThumbnails: data[0],
                quoteFull: data[1],
                quoteSimples: data[2],
            });
        })
        .catch(console.log);
};

const profile = (req, res, next) => {
    const username = req.params.username;

    User.findOne({
        where: {username: username},
        include: [{
            model: Quote,
            include: [User]
        }]
    })
        .then(user => {
            if(user) {
                res.render('home/profile', {
                    title: user.username,
                    user: user
                });
            } else {
                res.render('404', {'title': 'Quote not found'});
            }
        })
        .catch(console.log);
};

const searchQuote = (req, res, next) => {
    const q = req.query.q.trim();
    Quote.findAll({
        where: {
            [Op.or]: [
                {
                    quote: {
                        [Op.like]: `%${q}%`
                    }
                },
                {
                    description: {
                        [Op.like]: `%${q}%`
                    }
                }
            ]
        },
        include: [User]
    })
        .then(quotes => {
            res.render('home/search', {
                title: 'Search quotes ' + q,
                q: q,
                quotes: quotes
            });
        })
        .catch(console.log);
};

module.exports = {
    getIndex: getIndex,
    searchQuote: searchQuote,
    profile: profile,
};