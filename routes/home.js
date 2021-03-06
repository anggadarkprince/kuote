const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');

router.get('/', homeController.getIndex);
router.get('/search', homeController.searchQuote);
router.post('/subscribe', homeController.subscribe);
router.get('/:username', homeController.profile);

module.exports = router;