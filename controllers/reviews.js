const Review = require('../models/Review')

module.exports = {
  getReview: async(req, res) => {
    try {
      const movieReviews = await Review.find({movieId: req.body.movieId}) // we don't need toArray() here mongoose just makes it work
      console.log(movieReviews)
      res.json(movieReviews)
    } catch(err) {res.json({message: err.message})} 
  }, 

  addReview: async (req, res) => {
    Review.create({movieId: req.body.movieId, review: req.body.review, score: req.body.score, genre: req.body.genre, likes: 0, bookmarked: req.body.bookmarked})
      .then(result => {
        res.send({review: req.body.review, score: req.body.score, likes: 0, _id: req.body._id})  // after adding a review to the database, we want to send respective database Id to the frontend so we can like/delete reviews based on the id
      }) 
      .catch(error => console.error(error))
  },

  likeReview: async (req, res) => {
    Review.updateOne({_id: req.body.reviewToLike}, {
      $set: {
        likes: req.body.likeCount + 1
      }
    })
    // client-side code sends a reviewToLike and its likeCount to the server using a fetch request, the server.js increments the likes in the database and also sends it back to main.js as updatedLikes. main.js then uses updatedLikes to update the DOM
    .then(result => {
      res.send({updatedLikes: req.body.likeCount + 1})
    })
    .catch(error => console.error(error))
  },

  deleteReview: async (req, res) => {
    Review.deleteOne({_id: req.body.reviewToDel})  // on our database we're looking for an object that has a review property of what came through the request
    .then(data => {
      res.json("Delete succesful.")
    })
    .catch(error => console.error(error))
  }

}  