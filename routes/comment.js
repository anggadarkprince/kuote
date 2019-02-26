const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment');

router.post('/comment/:quoteId', commentController.save);

module.exports = router;