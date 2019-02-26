const QuoteComment = require('../models/quote-comment');
const error = require('../utils/error');

const save = (req, res, next) => {
    const quoteId = req.params.quoteId;
    const {message} = req.body;

    QuoteComment.create({quote_id: quoteId, comment: message})
        .then(() => {
            req.flash('success', 'Your comment is submitted!');
            res.redirect('back');
        })
        .catch(err => {
            error.errorHandler(err, next);
        });
};

module.exports = {
    save: save,
};