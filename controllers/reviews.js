const Review = require('../models/Review')
const Movie = require('../models/Movie')

module.exports = {
  getReview: async(req, res) => {
    try {
      const movieReviews = await Review.find({movieId: req.body.movieId}) // we don't need toArray() here mongoose just makes it work
      res.send({reviews: movieReviews, userId: req.session.currentUser})
    } catch(err) {res.json({message: err.message})} 
  }, 

  addReview: async (req, res) => {
    try{
      await Movie.updateOne({movieId: req.body.movieId}, {$push:{users: req.session.currentUser}, movieTitle: req.body.title, posterLink: req.body.poster, movieId: req.body.movieId, plot: req.body.plot, genre: req.body.genre}, {upsert: true})   // with updateOne we avoid adding the same movie multiple times when users have written multiple reviews
      await Review.create({user: req.session.currentUser, movieId: req.body.movieId, review: req.body.review, score: req.body.score, likes: 0})
      res.send({review: req.body.review, score: req.body.score, likes: 0, _id: req.body._id})  // after adding a review to the database, we want to send respective database Id to the frontend so we can like/delete reviews based on the id
    } catch(err) {console.log(err)}  
  },

  likeReview: async (req, res) => {
    try{
      let review
      const { actionToPerform, reviewToLike, likeCount } = req.body
      if(actionToPerform === 'like'){
        review = await Review.findOneAndUpdate({_id: reviewToLike}, {likes: likeCount + 1, $push:{likedBy: req.session.currentUser}}, {new: true})
      } else {
        review = await Review.findOneAndUpdate({_id: reviewToLike}, {likes: likeCount - 1, $pull:{likedBy: req.session.currentUser}}, {new: true})
      }  
      res.send({updatedLikes: review.likes})
    } catch(error) {console.error(error)}  
    // client-side code sends a reviewToLike and its likeCount to the server using a fetch request, the server.js increments the likes in the database and also sends it back to main.js as updatedLikes. main.js then uses updatedLikes to update the DOM
  },

  deleteReview: async (req, res) => {
    const review = await Review.findOne({_id: req.body.reviewToDel, user: req.session.currentUser})
    if(!review){
      res.status(400).json({message: 'There is no review to delete.'}) // using sendStatus here throws an error because we are also sending JSON message
    } else {
      await Review.deleteOne({_id: req.body.reviewToDel, user: req.session.currentUser})
      res.json('Delete successful.')
    }
  }

}  