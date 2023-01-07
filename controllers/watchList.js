const Review = require('../models/Review')
const Movie = require('../models/Movie')
const Bookmark = require('../models/Bookmark')

module.exports = {
  addBookmark: async(req, res) => {
    try{
      // multiple users could bookmark the same movie. so instead of storing the same movie for each user, an individual movie has an attribute called 'users' which is an array that stores ids of the users who make bookmarked that particular movie
      await Bookmark.updateOne({movieId: req.body.movieId}, {$push: {users: req.session.currentUser}, movieId: req.body.movieId, posterLink: req.body.poster, movieTitle: req.body.movieTitle, genre: req.body.movieGenre, plot: req.body.moviePlot, bookmarked: req.body.bookmarked}, {upsert: true})
      res.json("Movie added to watch list.")
    } catch(err) {res.json({message: err})}
  },

  removeBookmark: async (req, res) => {
    const movie = await Bookmark.findOne({movieId: req.body.movieToDel})
    // if a movie has been bookmarked by only one user we can safely delete the whole movie object from the database, but if it has been bookmarked by multiple users we only delete a particular user at a time
    if(movie.users.length == 1){
      await Bookmark.deleteOne({movieId: req.body.movieToDel})
    } else {
      await Bookmark.updateOne({movieId: req.body.movieToDel}, {$pull: {users: req.session.currentUser}})  // on our database we're looking for an object that has a review property of what came through the request
    }
    // .then(data => {
    //   res.json("Movie removed from watch list.")
    // })
    // .catch(error => console.error(error))
      
  },

  checkBookmark: async(req, res) => {
    try{
      const bookmarkedMovie = await Bookmark.find({users: req.session.currentUser, movieId: req.body.movieId})
      res.json(bookmarkedMovie)
    } catch(err) {res.json({message: err})}
  },

  getWatchList: async (req, res) => {
    try{
      const bookmarkedMovies = await Bookmark.find({users: req.session.currentUser})
      res.render('watchList.ejs', {movies: bookmarkedMovies})
    } catch(err) {res.json({message: err})}
  }
}