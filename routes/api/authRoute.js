const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const auth = require('../../middleware/auth')
const authController = require('../../controllers/authController')
// route get api/auth

router.get('/', auth, authController.getAuth)

// authenticate user and get token login
router.post('/signin', [
  check('email', 'please include a valid email').exists(),
  check('password', 'password is required').exists()
], authController.getTokenLogin)

module.exports = router
