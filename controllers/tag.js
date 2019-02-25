const QuoteTag = require('../models/quote-tag');
const Tag = require('../models/tag');
const QuoteTag = require('../models/quote-tag');
const db = require('../utils/database');

const getPopularTags = (req, res, next) => {
    const tag = req.params.tag;
    return Quote.findAll({
        group: [db.col('tag.id')],
        include: [{
            model: Tag,
            attributes: ['state_id', 'state_name'],
            where: {
                state_status: 1,
                state_name: {
                    $like: '%ta%'
                }
            }
        }],
        limit: 6
    });
};

module.exports = {
    getPopularTags: getPopularTags,
};