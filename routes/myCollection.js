const express = require('express')
const router = express.Router()
const collectionController = require('../controllers/myCollection')

router.get('/', collectionController.getMyCollection)

module.exports = router