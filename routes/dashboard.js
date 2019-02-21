const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');

router.get('/dashboard', dashboardController.getIndex);

module.exports = router;