const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const homeController = require('../controllers/home')
const { checkUser } = require('../middleware/auth')

router.get('/', checkUser, homeController.getIndex)
router.get('/signup', authController.getSignup)
router.post('/signup', authController.postSignup)
router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)
router.get('/logout', authController.logout)

module.exports = router