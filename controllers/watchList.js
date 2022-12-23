const Review = require('../models/Review')
const Movie = require('../models/Movie')
const Bookmark = require('../models/Bookmark')

module.exports = {
  addBookmark: async(req, res) => {
    try{
      console.log(req.body)
      await Bookmark.create({movieId: req.body.movieId, posterLink: req.body.poster, movieTitle: req.body.movieTitle, genre: req.body.movieGenre, plot: req.body.moviePlot, bookmarked: req.body.bookmarked})
      res.json("Movie added to watch list.")
    } catch(err) {res.json({message: err})}
  },

  removeBookmark: (req, res) => {
    Bookmark.deleteOne({movieId: req.body.movieToDel})  // on our database we're looking for an object that has a review property of what came through the request
    .then(data => {
      res.json("Movie removed from watch list.")
    })
    .catch(error => console.error(error))
  },

  getBookmarkedMovie: async(req, res) => {
    try{
      const bookmarkedMovie = await Bookmark.find({movieId: req.body.movieId})
      res.json(bookmarkedMovie)
    } catch(err) {res.json({message: err})}
  },

  getWatchList: async (req, res) => {
    try{
      const bookmarkedMovies = await Bookmark.find()
      res.render('watchList.ejs', {movies: bookmarkedMovies})
    } catch(err) {res.json({message: err})}
  }
}