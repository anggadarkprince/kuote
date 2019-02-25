const Quote = require('../models/quote');
const User = require('../models/user');
const Op = require("sequelize/lib/operators");

const getIndex = (req, res, next) => {
    res.render('home/index', {
        title: 'Home',
    });
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
};