const express = require('express');
const router = express.Router();  // creating an instance of Router object
const reviewsController = require('../controllers/reviews')

router.post('/getReview', reviewsController.getReview)  // it is going to take the getReview function from reviewsController and place it here

router.post('/addReview', reviewsController.addReview)

router.put('/likeReview', reviewsController.likeReview)

router.delete('/deleteReview', reviewsController.deleteReview)
// router.post('/getReview', async (req, res) => {
//   console.log(JSON.stringify(req.body.movieId))
//   try {
//     reviewCollection.find({movieId: req.body.movieId}).toArray()
//       .then(data => {
//         console.log(data)
//         // res.render('index', {reviews: data})
//         res.json(data)
//       })
//     } catch(err) {res.json({message: err.message})}    
// })

module.exports = router