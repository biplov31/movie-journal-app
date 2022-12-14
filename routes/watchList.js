const express = require('express')
const router = express.Router()
const watchListController = require('../controllers/watchList')

router.get('/', watchListController.getWatchList)
router.post('/addBookmark', watchListController.addBookmark)
router.delete('/removeBookmark', watchListController.removeBookmark)

module.exports = router