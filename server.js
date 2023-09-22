const express = require('express');
const app = express();
const session = require('express-session')
const MongoStore = require('connect-mongo')
const logger = require('morgan')
const flash = require('express-flash')
const connectDB = require('./config/database')
const homeRoutes = require('./routes/home')
const reviewRoutes = require('./routes/reviews')
const collectionRoutes = require('./routes/mycollection');
const watchListRoutes = require('./routes/watchlist')

require('dotenv').config({path: './config/.env'})  // node by default does not recognize it so we have to explicitly define the path
connectDB()


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(logger('dev'))

// this middleware creates a req.session in every request body. we can save req.session that would be persistent throught all of the request-response cycle with a particular user, req.session.id matches the id in the cookie
app.use(session({  // by default our mongodb collection name is going to be 'sessions'
  secret: process.env.SESSION_SECRET,
  resave: false,  // for every request from the same user we don't want to create a new session
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: process.env.DB_STRING}), // storing our session info in our mongo database
}))

app.use(flash())
// app.use('/', require('./routes/home'))
app.use('/', homeRoutes)
app.use('/reviews', reviewRoutes)
app.use('/mycollection', collectionRoutes)
app.use('/watchlist', watchListRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server is running!`)
})
  

   
