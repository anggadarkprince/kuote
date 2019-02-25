const Quote = require('../models/quote');
const QuoteTag = require('../models/quote-tag');
const QuoteLike = require('../models/quote-like');
const QuoteComment = require('../models/quote-comment');
const Tag = require('../models/tag');
const User = require('../models/user');
const file = require('../utils/file');
const db = require('../utils/database');

const index = (req, res, next) => {
    const user = req.user;
    Quote.findAll({
        attributes: {
            include: [
                'quote.*',
                [db.fn('COUNT', db.col('quote_likes.id')), 'total_likes'],
                [db.fn('COUNT', db.col('quote_comments.id')), 'total_comments'],
            ]
        },
        where: {user_id: req.user.id},
        include: [
            User,
            {model: QuoteLike, as: 'quote_likes', attributes: []},
            {model: QuoteComment, as: 'quote_comments', attributes: []}
        ],
        group: [db.col('quote.id')]
    })
        .then(quotes => {
            res.render('quote/index', {
                title: 'Quotes',
                user: user,
                quotes: quotes
            });
        })
        .catch(console.log);
};

const createQuote = (req, res, next) => {
    res.render('quote/create', {
        title: 'Create new quote',
    });
};

const saveQuote = (req, res, next) => {
    const featured = req.file;
    const {author, quote, category, description} = req.body;
    const categories = category.split(',');

    let uploadedPath = null;
    if (featured) {
        // linux just featured.path
        uploadedPath = `uploads/quotes/${(new Date()).getFullYear()}/${((new Date()).getMonth() + 1)}/${featured.filename}`;
    }

    let createdQuote = null;
    Quote.create({user_id: req.user.id, author, quote, featured: uploadedPath, description})
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
                    return Tag.create({tag: categories[index].toLowerCase()});
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
            req.flash('success', `Quote from ${createdQuote.author} successfully created!`);
            res.redirect('/quotes');
        })
        .catch(console.log);
};

const editQuote = (req, res, next) => {
    const id = req.params.quoteId;
    Quote.findOne({
        where: {id: id, user_id: req.user.id},
        include: [Tag]
    })
        .then(quote => {
            if (quote) {
                res.render('quote/edit', {
                    title: 'Edit quote ' + quote.quote,
                    quote: quote
                });
            } else {
                req.flash('danger', 'Quote not found or you are not authorized to perform the action');
                return res.redirect('/quotes');
            }
        })
        .catch(console.log);
};

const updateQuote = (req, res, next) => {
    const id = req.params.quoteId;
    const featured = req.file;
    const {author, quote, category, description} = req.body;
    const categories = category.split(',');

    let uploadedPath = null;
    if (featured) {
        // linux just featured.path
        uploadedPath = `uploads/quotes/${(new Date()).getFullYear()}/${((new Date()).getMonth() + 1)}/${featured.filename}`;
    }

    let updatedQuote = null;
    Quote.findOne({where: {id: id, user_id: req.user.id}})
        .then(fetchedQuote => {
            if (fetchedQuote) {
                updatedQuote = fetchedQuote;
                fetchedQuote.author = author;
                fetchedQuote.quote = quote;
                fetchedQuote.description = description;
                if (uploadedPath) {
                    if (fetchedQuote.featured) {
                        file.deleteFile(fetchedQuote.featured);
                    }
                    fetchedQuote.featured = uploadedPath;
                }
                return fetchedQuote.save();
            } else {
                req.flash('danger', 'Quote not found or you are not authorized to perform the action');
                return res.redirect('/quotes');
            }
        })
        .then(updateQuote => {
            const findExistingTags = categories.map(tag => {
                return Tag.findOrCreate({where: {tag: tag.toLowerCase()}});
            });
            return Promise.all(findExistingTags);
        })
        .then(existingTags => {
            return QuoteTag.destroy({where: {quote_id: id}})
                .then(affectedRows => {
                    const insertQuoteTags = existingTags.map(existTag => {
                        return QuoteTag.create({quote_id: id, tag_id: existTag[0].id});
                    });
                    return Promise.all(insertQuoteTags);
                })
                .catch(console.log);
        })
        .then(result => {
            req.flash('success', `Quote from ${updatedQuote.author} successfully updated!`);
            res.redirect('/quotes');
        })
        .catch(console.log);
};

const deleteQuote = (req, res, next) => {
    const id = req.params.quoteId;
    Quote.findOne({where: {id: id, user_id: req.user.id}})
        .then(quote => {
            if (quote) {
                if (quote.featured) {
                    file.deleteFile(quote.featured);
                }
                return quote.destroy();
            } else {
                req.flash('danger', 'Quote not found or you are not authorized to perform the action');
                return res.redirect('/quotes');
            }
        })
        .then(result => {
            req.flash('warning', `Quote from ${result.author} successfully deleted!`);
            return res.redirect('/quotes');
        })
        .catch(console.log);
};

const viewQuote = (req, res, next) => {
    const id = req.params.quoteId;
    Quote.findOne({
        attributes: {
            include: [
                'quote.*',
                [db.literal('(SELECT COUNT(*) FROM quote_likes WHERE quote_likes.quote_id = quote.id)'), 'total_likes'],
                [db.literal('(SELECT COUNT(*) FROM quote_comments WHERE quote_comments.quote_id = quote.id)'), 'total_comments'],
            ]
        },
        where: {id: id, user_id: req.user.id},
        include: [Tag, User]
    })
        .then(quote => {
            if (quote) {
                res.render('quote/view', {
                    title: quote.quote,
                    quote: quote
                });
            } else {
                res.render('404', {'title': 'Quote not found'});
            }
        })
        .catch(console.log);
};


const popularQuote = (req, res, next) => {
    Quote.findAll({
        include: [User],
        order: [['total_views', 'DESC']],
        limit: 12
    })
        .then(quotes => {
            res.render('home/popular', {
                title: 'Popular Quotes',
                quotes: quotes
            });
        })
        .catch(console.log);
};

module.exports = {
    index: index,
    create: createQuote,
    save: saveQuote,
    edit: editQuote,
    update: updateQuote,
    delete: deleteQuote,
    view: viewQuote,
    popular: popularQuote,
};