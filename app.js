//middleware paths
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fetch = require("node-fetch");
const path = require("path");

// for passport
const session = require("express-session");
const setupPassport = require("./passport");
const passport = require("passport");

//the lists for SQL to use *maybe can drop now using knex*
const cuisineList = require("./queryList/cuisineList");
const dietList = require("./queryList/dietList");
const typeList = require("./queryList/typeList");

//routes
const cuisineRoute = require("./routes/cuisine");
const dietRoute = require("./routes/diet");
const typeRoute = require("./routes/type");
const recipeRoute = require("./routes/recipe");
const filterRoute = require("./routes/filter");
const addRoute = require("./routes/addRecipe");
const signInRoute = require("./routes/signIn");
const signUpRoute = require("./routes/signUp");
const signOutRoute = require("./routes/signOut");
const errorInRoute = require("./routes/errorPageSignIn");
const errorUpRoute = require("./routes/errorPageSignUp");
const commentsRoute = require("./routes/comments");
const advanceSearchRoute = require("./routes/advanceSearch");
const profileRoute = require("./routes/profile");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// for passport
app.use(
  session({
    secret: "supersecret",
    resave: false,
    saveUninitialized: true,
  })
);
setupPassport(app);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/sign-in");
}

//allowing for the routes to be used
app.use("/cuisine", cuisineRoute);
app.use("/diet", dietRoute);
app.use("/type", typeRoute);
app.use("/recipes/:id", recipeRoute);
app.use("/filter", filterRoute);
app.use("/add-recipe", addRoute);
app.use("/sign-in", signInRoute);
app.use("/sign-up", signUpRoute);
app.use("/sign-out", signOutRoute);
app.use("/error-sign-in", errorInRoute);
app.use("/error-sign-up", errorUpRoute);
app.use("/comments", commentsRoute);
app.use("/advanceSearch", advanceSearchRoute);
app.use("/profile", profileRoute);

app.get("/", (req, res) => {
  res.render("improveIndex", {
    cuisineList: cuisineList,
    dietList: dietList,
    typeList: typeList,
    cuisine: "Cuisine",
    diet: "Diet",
    type: "Type",
  });
});

app.get("/home", isLoggedIn, (req, res) => {
  res.render("improveIndexLogin", {
    cuisineList: cuisineList,
    dietList: dietList,
    typeList: typeList,
    cuisine: "Cuisine",
    diet: "Diet",
    type: "Type",
  });
});

// for testing profileSuccess
// app.get('/test', (req, res) => {
//   res.render('profileSuccess', {
//     username: 'hi',
//     email: 'hi',
//     recipeArr: [1],
//     favCui: 'hi',
//     diet: 'hi',
//     favArr: [[{recipe_image: 'hi'}]]
//   });
// })


app.listen(4000, () => {
  console.log("listening to 4000");
});
