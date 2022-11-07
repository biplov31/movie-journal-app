// npm init; npm install express --save
const express = require('express');
const app = express();
const bodyParser = require('body-parser');  // npm install body-parser --save
const { request, response } = require('express');
const MongoClient = require('mongodb').MongoClient // npm install mongodb --save
const PORT = 3000
require('dotenv').config()

let db, 
  connectionString = process.env.DB_STRING,
  dbName = 'movie-reviews'

MongoClient.connect(connectionString, {useUnifiedTopology: true})
  .then(client => {
    console.log('Connected to database.')
    db = client.db(dbName)
    const reviewCollection = db.collection('reviews')
    app.set('view engine', 'ejs')  // npm install ejs --save
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    app.use(express.static('public'))

    app.get('/', async (req, res) => {
      reviewCollection.find().sort({likes: -1}).toArray()
        .then(data => {
          res.render('index.ejs', {reviews: data})          
        })
        .catch(error => {console.error(error)})
    })

    // app.get('/', async (req, res) => {
    //   res.render('index.ejs', {reviews: data})          
        
    // })

    // app.get('/getReview/:movieId', (req, res) => {
    //   reviewCollection.find().toArray()
    //     .then(data => {
    //       res.render('index.ejs', {reviews: data})
    //     })
    // })

    app.post('/addReview', (req, res) => {
      console.log(req.body)
      reviewCollection.insertOne({movieId: req.body.movieID, review: req.body.review, score: req.body.score, likes: 0})
        .then(result => {
          console.log(result)
          res.redirect('/')
        }) 
        .catch(error => console.error(error))
    })

    app.delete('/deleteReview', (req, res) => {
      reviewCollection.deleteOne({review: req.body.reviewToDel})  // on our database we're looking for an object that has a review property of what came through the request
      .then(data => {
        res.json("Delete succesfull.")
      })
      .catch(error => console.error(error))
    })

    app.put('/addOneLike', (req, res) => {
      reviewCollection.updateOne({review: req.body.reviewToLike}, {
        $set: {
          likes: req.body.likeCount + 1
        }
      })
      .then(result => {
        res.json('Like added.')
      })
      .catch(error => console.error(error))
    })

    app.listen(process.env.PORT || PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })

   
