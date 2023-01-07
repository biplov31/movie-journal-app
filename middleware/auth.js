const User = require('../models/User')
module.exports = {
  // with this function we can gatekeep and only allow logged in users (whose session has isAuth:true) to access some routes
  ensureAuth: async function(req, res, next){
    if(req.session.isAuth){
      next()
    } else {
      res.redirect('/login')
    }
  },

  protectReview: function (req, res, next) {
    if (!req.session.isAuth) {
      return res.sendStatus(401)
    }
    next();
  },

  // when a user is logged in, our session contains the id of that user. this function checks if our session does contain a user id and using res.locals it sends user info to the front-end
  checkUser: async function (req, res, next){
    if(req.session && req.session.currentUser){
      res.locals.session = req.session
      let user = await User.findById(req.session.currentUser)
      res.locals.user = user
      next()
    } else {
      res.locals.session = null
      res.locals.user = null
      next()
    }  
  },

}