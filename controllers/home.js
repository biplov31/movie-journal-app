module.exports = {
  getIndex: (req, res) => {
    // req.session.isAuth = true  // with this the session that was created gets stored in our database
    res.render('index.ejs')
  }
}