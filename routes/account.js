const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account');
const mustAuthenticated = require('../middleware/must-authenticated');

router.get('/account', mustAuthenticated, accountController.getAccount);
router.put('/account', mustAuthenticated, accountController.updateAccount);

module.exports = router;