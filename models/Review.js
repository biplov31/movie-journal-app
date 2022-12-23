const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  movieId: {
    type: String
  },
  review: {
    type: String
  }, 
  likes: {
    type: Number
  },
  score: {
    type: Number
  },
  bookmarked: {
    type: Boolean
  } 
})

module.exports = mongoose.model('Review', ReviewSchema)