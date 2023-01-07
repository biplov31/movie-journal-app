const express = require('express')
const router = express.Router()
const watchListController = require('../controllers/watchList')
const { ensureAuth, checkUser } = require('../middleware/auth')

router.get('/', ensureAuth, checkUser, watchListController.getWatchList)
router.post('/addBookmark', watchListController.addBookmark)
router.delete('/removeBookmark', watchListController.removeBookmark)
router.post('/checkBookmark', watchListController.checkBookmark)

module.exports = router