const Quote = require('../models/quote');
const QuoteTag = require('../models/quote-tag');
const Tag = require('../models/tag');
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
    res.render('quote/create', {
        title: 'Create new quote',
    });
}

const saveQuote = (req, res, next) => {
    const featured = req.file;
    const {author, quote, category, description} = req.body;
    const categories = category.split(',');

    let createdQuote = null;
    Quote.create({user_id: req.user.id, author, quote, featured: featured.path, description})
        .then(quoteObj => {
            createdQuote = quoteObj;
            const findExistingTags = categories.map(tag => {
                return Tag.findOne({where: {tag: tag.toLowerCase()}});
            });
            return Promise.all(findExistingTags);
        })
        .then(existingTags => {
            const newTags = existingTags.map((foundTag, index) => {
                if (!foundTag) {
                    return Tag.create({tag: categories[index]});
                } else {
                    return Promise.resolve(foundTag);
                }
            });
            return Promise.all(newTags);
        })
        .then(relatedTags => {
            const insertQuoteTags = relatedTags.map(existTag => {
                return QuoteTag.create({quote_id: createdQuote.id, tag_id: existTag.id});
            });
            return Promise.all(insertQuoteTags);
        })
        .then(result => {
            res.redirect('/quotes');
        })
        .catch(console.log);
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