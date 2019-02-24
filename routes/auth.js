const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const redirectMiddleware = require('../middleware/redirect-if-authenticated');
const mustAuthenticated = require('../middleware/must-authenticated');

router.get('/login', redirectMiddleware, authController.getLogin);
router.get('/register', redirectMiddleware, authController.getRegister);
router.post('/register', redirectMiddleware, authController.postRegister);
router.post('/login', redirectMiddleware, authController.postLogin);
router.post('/logout', mustAuthenticated, authController.postLogout);

module.exports = router;