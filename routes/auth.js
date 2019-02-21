const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const redirectMiddleware = require('../middleware/redirect-if-authenticated');

router.get('/login', redirectMiddleware, authController.getLogin);
router.get('/register', redirectMiddleware, authController.getRegister);
router.post('/register', redirectMiddleware, authController.postRegister);
router.post('/login', redirectMiddleware, authController.postLogin);

module.exports = router;