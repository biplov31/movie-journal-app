const express = require('express');
const router = express.Router();  // creating an instance of Router object
const reviewsController = require('../controllers/reviews')

router.post('/getReview', reviewsController.getReview)  // it is going to take the getReview function from reviewsController and place it here

router.post('/addReview', reviewsController.addReview)

router.put('/likeReview', reviewsController.likeReview)

router.delete('/deleteReview', reviewsController.deleteReview)

module.exports = router