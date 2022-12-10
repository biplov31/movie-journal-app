// npm init; npm install express --save
const express = require('express');
const app = express();
const connectDB = require('./config/database')
const homeRoutes = require('./routes/home')
const reviewRoutes = require('./routes/reviews')
const collectionRoutes = require('./routes/myCollection');

require('dotenv').config({path: './config/.env'})  // node by default does not recognize it so we have to explicitly define the path
connectDB()


app.set('view engine', 'ejs')  // npm install ejs --save
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))

app.use('/', homeRoutes)
app.use('/reviews', reviewRoutes)
app.use('/myCollection', collectionRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server is running!`)
})
  

   
