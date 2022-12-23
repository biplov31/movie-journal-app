const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
  movieTitle: { type: String },
  posterLink: { type: String },
  genre: { type: String },
  movieId: { type: String, required: true}, 
  plot: { type: String }
})

module.exports = mongoose.model('Movie', movieSchema)  // mongoose automatically looks for plural, lowercased version of our model name in our database i.e. a collection named 'movies'