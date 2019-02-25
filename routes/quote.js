const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quote');
const authMiddleware = require('../middleware/must-authenticated');

router.get('/', quoteController.index);
router.get('/popular', quoteController.popular);
router.get('/category/:tag', quoteController.category);

router.get('/create', authMiddleware, quoteController.create);
router.get('/:quoteId', quoteController.view);
router.post('/', authMiddleware, quoteController.save);
router.get('/:quoteId/edit', authMiddleware, quoteController.edit);
router.put('/:quoteId', authMiddleware, quoteController.update);
router.delete('/:quoteId', authMiddleware, quoteController.delete);

module.exports = router;