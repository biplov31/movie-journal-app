const Review = require('../models/Review')

module.exports = {
  getMyCollection: async (req, res) => {
    try{
      let moviesInCollection = []
      // since multiple reviews could be made for a single movie in the shared database, we need to eliminate duplication by finding movies of unique Imdb Ids
      let movies = await Review.find().distinct("movieId")
      // movies.forEach is a synchronous action, but Review.findOne is asynchronous - hence the .then() call.  The .then() gets executed when the query finishes, but we aren't waiting for it here - we're moving on to log moviesInCollection immediately afterward, hence it is an empty array
      // movies.forEach((movie) => {
      //   Review.findOne({'movieId' : movie})
      //     .then(result => {
      //       // console.log(result)
      //       moviesInCollection.push(result)
      //     })
      // })
      for (let movie of movies) {
        // this finds a single review (with the highest likes) of a movie from the above array
        let result = await Review.findOne({ 'movieId': movie}).sort({likes: -1}).limit(1)
        moviesInCollection.push(result)
      }
      // moviesInCollection = await Promise.all(
      //   movies.map(movie => Review.findOne({ movieId: movie }))
      // )  
      res.render('myCollection.ejs', {movies: moviesInCollection})

    } catch(err) {res.json({message: err})}
  }
}

