const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  review: {
    type: String
  }, 
  likes: {
    type: Number
  },
  score: {
    type: Number
  },
  genre: {
    type: String
  },
  movieId: {
    type: String
  }, 
  movieTitle: {
    type: String
  },
  plot: {
    type: String
  },
  bookmarked: {
    type: Boolean
  } 
})

module.exports = mongoose.model('Review', ReviewSchema)