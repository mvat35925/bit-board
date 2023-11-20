var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
const session = require("express-session");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require('connect-flash');

// require models
const Member = require("./src/models/member.model");
const Tag = require(("./src/models/tag.model.js"))
// require controllers
const guestController = require("./src/controllers/guest.controller.js");

// require router
const memberRouter = require("./src/routes/member.router.js");
const tagRouter = require("./src/routes/tag.router.js");
const loginRouter = require("./src/routes/login.router.js");
const postRouter = require("./src/routes/post.router");
const commentRouter = require("./src/routes/comment.router");
const indexRouter = require("./src/routes/index.router")
var app = express();
// setup cors redirect
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// setup cors
const corsOptions = {
  credentials: true,
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000' // Fallback for development
};

app.use(cors(corsOptions));
app.enable('trust proxy')


// setup session
app.use(
  session({
      name: "cookie-name",
      resave: false,
      proxy: true,
      secret: 'secret',
      saveUninitialized: true,
      cookie: {
          secure: false,
          sameSite: "lax"
      }
  })
);



// check guest / login session
app.use((req, res, next) => {
  if (!req.session.uid) {
    const guest_id = crypto.randomUUID();
    req.session.uid = guest_id;
    guestController.addGuest(req, res, next);
  } else {
    next();
  }
})

// setup passport
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await Member.findByUsername(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username or password" })
      }
      const match = await bcrypt.compare(password, user.password);
      if(!match) {
        return done(null, false, { message: "Incorrect username or password" })
      };
      return done(null, user);
    } catch (err) {
      return done(err);
    };

  })
);

passport.serializeUser(function (user, done) {
  done(null, user.member_ID);
});

passport.deserializeUser(async function (id, done) {
  try {
    const user = await Member.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  };
});

app.use(async function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  const Tags = await Tag.find();
  res.locals.tags = Tags;
  next();
})

// TODO: use to test login function, don't forget to delete!
app.get('/profile', (req, res) => {
  if (req.isAuthenticated()) {
    // User is logged in, and you can access their properties
    const memberID = req.user.member_ID;
    const username = req.user.username;

    // Use these properties as needed in your route handling logic
   return res.send({memberID: memberID, username: username});
  } else {
    // User is not authenticated
    res.redirect('login');
  }
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use("/members", memberRouter);
app.use("/tags", tagRouter);
app.use("/login", loginRouter);
app.use("/posts", postRouter);
app.use("/posts/:id/comments", commentRouter);

// logout
app.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    };
    res.redirect("/");
  })
})


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
})
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
