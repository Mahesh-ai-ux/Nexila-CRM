const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

// register (admin can create users via /users route; this is public register if you want)
router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  authController.register
);



router.post('/login', authController.login);

module.exports = router;
