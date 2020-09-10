const express = require("express");
const exphbs = require("express-handlebars");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo")(expressSession);
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models").User; // same as: const User = require('./models/user');

const port = process.env.PORT || 3000;

mongoose.connect(
  process.env.MONGODB_URI ||
    "mongodb://localhost:27017/authentication_exercise",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }
);

const app = express();

// Express configuration

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// enable session management
app.use(
  expressSession({
    secret: "konexioasso07",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// enable Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // Save the user.id to the session
passport.deserializeUser(User.deserializeUser()); // Receive the user.id from the session and fetch the User from the DB by its ID

app.get("/", (req, res) => {
  console.log("GET /");
  res.render("home");
});

app.get("/admin", (req, res) => {
  console.log("GET /admin");
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.render("admin");
  } else {
    res.redirect("/");
  }
});

app.get("/signup", (req, res) => {
  console.log("GET /signup");
  if (req.isAuthenticated()) {
    res.redirect("/admin");
  } else {
    res.render("signup");
  }
});

app.post("/signup", (req, res) => {
  console.log("POST /signup");
  console.log('signp',req.body);
  // create a user with the defined model with
  // req.body.username, req.body.password

  // WITHOUT PASSPORT

  // const username = req.body.username;
  // const password = req.body.password;

  // User.findOne({username: username}, (user) => {
  //   if (user === null) {
  //     const newUser = new User({
  //       username: username,
  //       password: password,
  //     });
  //     newUser.save((err, obj) => {
  //       if (err) {
  //         console.log('/signup user save err', err);
  //         res.render('500');
  //       } else {
  //         // Save a collection session with a token session and
  //         // a session cookie in the browser
  //       }
  //     });
  //   }
  // });

  console.log("will signup");

  const username = req.body.username;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const surname = req.body.surname;
  const user_email = req.body.user_email;

    if (password.length >= 8 && password === confirm_password) {
            User.register(
            new User({
                username: username,
                firstname: firstname,
                surname: surname,
                user_email: user_email
            // other fields can be added here
            }),
            password, // password will be hashed
            (err, user) => {
                if (err) {
                    console.log("/signup user register err", err);
                    return res.render("signup");
                } else {
                    passport.authenticate("local")(req, res, () => {
                    res.redirect("/admin");
                    });
                }
            }
            );
    } else {
        console.log(' password must be at least 8 characters')

    }
});

app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/admin");
  } else {
    res.render("login");
  }
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/login"
  })
);

// Without Passport

// app.post("/login", (req, res) => {
//   const md5 = require("md5"); // there for education purpose, if using this method, put it in the top of your file
//   User.find(
//     {
//       username: req.body.username,
//       password: md5(req.body.password)
//     },
//     (users) => {
//       // create a session cookie in the browser
//       // if the password is good
//       // and redirect to /admin
//     }
//   );
//   res.send("login");
// });

app.get("/logout", (req, res) => {
  console.log("GET /logout");
  req.logout();
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});