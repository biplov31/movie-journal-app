const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
  user: {
    type: String
  },
  movieId: {
    type: String
  },
  review: {
    type: String
  }, 
  likes: {
    type: Number
  },
  likedBy: {
    type: Array
  },
  score: {
    type: Number
  },
  bookmarked: {
    type: Boolean
  } 
})

module.exports = mongoose.model('Review', ReviewSchema)