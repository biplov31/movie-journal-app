const mongoose = require('mongoose')

const bookmarkSchema = new mongoose.Schema({
  movieTitle: { type: String },
  posterLink: { type: String },
  genre: { type: String },
  movieId: { type: String}, 
  plot: { type: String },
  bookmarked: { type: Boolean }
})

module.exports = mongoose.model('Bookmark', bookmarkSchema)  