const express = require('express')
const router = express.Router()
const collectionController = require('../controllers/myCollection')
const { ensureAuth, checkUser } = require('../middleware/auth')

router.get('/', ensureAuth, checkUser, collectionController.getMyCollection)

module.exports = router