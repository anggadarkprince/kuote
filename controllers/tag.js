const QuoteTag = require('../models/quote-tag');
const Tag = require('../models/tag');
const QuoteTag = require('../models/quote-tag');
const db = require('../utils/database');

const getPopularTags = (req, res, next) => {
    return Tag.findAll({
        attributes: {
            include: [
                'tag.tag',
                [db.literal('(SELECT COUNT(*) FROM quote_tags WHERE quote_tags.tag_id = tag.id)'), 'total_quotes'],
                [db.fn('COUNT', db.col('quote_likes.id')), 'total_quotes'],
            ]
        },
        group: [db.col('tag.id')],
        order: [
            ['(SELECT COUNT(*) FROM quote_tags WHERE quote_tags.tag_id = tag.id)', 'desc']
        ],
        limit: 6
    });
};

module.exports = {
    getPopularTags: getPopularTags,
};