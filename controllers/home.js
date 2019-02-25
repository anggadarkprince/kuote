const Quote = require('../models/quote');
const User = require('../models/user');
const Op = require("sequelize/lib/operators");

const getIndex = (req, res, next) => {
    res.render('home/index', {
        title: 'Home',
    });
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