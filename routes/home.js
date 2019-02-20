const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');

router.get('/', homeController.getIndex);
router.get('/quote-of-the-day', homeController.getQuoteOfTheDay);
router.get('/most-popular', homeController.getMostPopular);
router.get('/category/:slug', homeController.getQuoteByCategory);

module.exports = router;