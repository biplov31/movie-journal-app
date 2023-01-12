const express = require('express');
const router = express.Router();  // creating an instance of Router object
const reviewsController = require('../controllers/reviews');
const { ensureAuth, protectReview } = require('../middleware/auth');

router.post('/getReview', reviewsController.getReview)  // it is going to take the getReview function from reviewsController and place it here

router.post('/addReview', protectReview, reviewsController.addReview)

router.put('/likeReview', protectReview, reviewsController.likeReview)

router.delete('/deleteReview', protectReview, reviewsController.deleteReview)

router.get('/getTopGenre', reviewsController.getTopGenre)

module.exports = router