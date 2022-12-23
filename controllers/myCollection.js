const Review = require('../models/Review')
const Movie = require('../models/Movie')
const { MongoDriverError } = require('mongodb')

module.exports = {
  getMyCollection: async (req, res) => {
    try{
      let watchedMovies = (await Movie.find()).map(movie => movie.toObject())   // converting mongoose document to plain object/POJO
      for(let movie of watchedMovies){
        let reviewData = await Review.findOne({'movieId': movie.movieId}).sort({likes: -1}).limit(1)
        movie.score = reviewData.score
        movie.review = reviewData.review
      }
      res.render('myCollection.ejs', {movies: watchedMovies})
          
    } catch(err) {res.json({message: err})}
  }
}

