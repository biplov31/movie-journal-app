const User = require('../models/User')
const bcrypt = require('bcryptjs')

exports.getSignup = async (req, res) => {
  res.render('signup.ejs')
}

exports.postSignup = async (req, res, next) => {
  const validationErrors = []
  const { username, password, rePassword, email } = req.body
  if(password.length < 6){
    validationErrors.push({msg: "Password is less than 6 characters."})
  } 
  if(password != rePassword){
    validationErrors.push({msg: "Passwords do not match."})
  }
  if(validationErrors.length){
    req.flash('errors', validationErrors)
    return res.redirect('../signup')
  }
  const userDupe = User.findOne({email})
  if(userDupe) validationErrors.push({msg: "User with that email already exists."})

  try{
    const hashedPsw = await bcrypt.hash(password, 10)  // salt(10) is the value added to an item during hashing to randomize it 
    const newUser = await User.create({
      username,
      email,
      password: hashedPsw
    })
    req.session.isAuth = true
    req.session.currentUser = newUser._id
    res.redirect("/")
    // res.render('index.ejs', {isAuthenticated: true, username: user.username})
  } catch(err) {
    res.status(401).json({message: 'User could not be created', error: err.message})
  }
}

exports.getLogin = (req, res) => {
  res.render('login.ejs')
}

exports.postLogin = async (req, res, next) => {
  const validationErrors = []
  const { email, password } = req.body
  if(!email || !password){
    validationErrors.push({msg: 'Email or password is empty.'})
  }
  if(validationErrors.length){
    req.flash('errors', validationErrors)
    return res.redirect('../login')
  }
  try{
    const user = await User.findOne({email})
    if(!user){
      req.flash('errors', {msg: 'User not found.'})
      return res.redirect('../login')
    }
    const passwordMatch = await bcrypt.compare(password, user.password)
    if(passwordMatch){
      // req.flash('success', {msg: 'Login successful.', user})
      req.session.isAuth = true  // save isAuth:true in the session only when the user is logged in so they can access protected routes
      req.session.currentUser = user._id  // in the session store the logged in user as currentUser
      res.redirect('/')
    } else {
      console.log('Incorrect password.')
      req.flash('errors', {msg: 'Incorrect password.'})
      res.redirect('../login')
    }
  } catch(err) {
    res.status(400).json({error: err.message})
  }  
}

// remove session from database, the cookie could still be there on the browser but it does not point to any session in the database so it is useless
exports.logout = async (req, res) => {
  req.session.destroy(err => {
    if(err) throw err
    res.redirect('/')
  })
}