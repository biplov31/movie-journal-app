const Review = require('../models/Review')

module.exports = {
  addBookmark: async(req, res) => {
    try{
      Review.create({movieId: req.body.movieId, movieTitle: req.body.movieTitle, genre: req.body.movieGenre, plot: req.body.moviePlot, bookmarked: req.body.bookmarked})
      res.json("Movie added to watch list.")
    } catch(err) {res.json({message: err})}
  },

  removeBookmark: (req, res) => {
    // try{
    //   console.log(req.body)
    //   Review.deleteOne({movieId: req.body.movieToDel})
    //   res.json("Movie removed from watch list.")
    // } catch(err) {res.json({message: err})}
    Review.deleteOne({movieId: req.body.movieToDel})  // on our database we're looking for an object that has a review property of what came through the request
    .then(data => {
      res.json("Movie removed from watch list.")
    })
    .catch(error => console.error(error))
  },

  getWatchList: async (req, res) => {
    try{
      const bookmarkedMovies = await Review.find({bookmarked: true})
      res.render('watchList.ejs', {movies: bookmarkedMovies})
    } catch(err) {res.json({message: err})}
  }
}