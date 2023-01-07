const Review = require('../models/Review')
const Movie = require('../models/Movie')

module.exports = {
  getMyCollection: async (req, res) => {
    try{
      let watchedMovies = (await Movie.find({users: req.session.currentUser})).map(movie => movie.toObject())   // converting mongoose document to plain object/POJO
      for(let movie of watchedMovies){
        // modifying the Movie object by appending a 'review' attribute that has the review with highest likes
        let reviewData = await Review.findOne({'movieId': movie.movieId}).sort({likes: -1}).limit(1)
        movie.score = reviewData.score
        movie.review = reviewData.review
      }
      res.render('myCollection.ejs', {movies: watchedMovies})
          
    } catch(err) {res.json({message: err})}
  }
}

