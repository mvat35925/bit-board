const passport = require("passport");

const checkAuth = async(req, res, next) => {
  if(req.isAuthenticated()) {
    res.json({isAuthenticated: true, user: req.user});
  } else {
    res.json({isAuthenticated: false});
    redirect("login")
  }
}
const getLogin = async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  }
  res.render('login', { messages: req.flash() });
};

const postLogin = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true
});




module.exports = {
  getLogin,
  postLogin,
  checkAuth
}