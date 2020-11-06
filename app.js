//middleware paths
require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fetch = require("node-fetch");
const path = require("path");

// for passport
const session = require('express-session');
const setupPassport = require('./passport');

//the lists for SQL to use *maybe can drop now using knex*
const cuisineList = require("./queryList/cuisineList");
const dietList = require("./queryList/dietList");
const typeList = require("./queryList/typeList");

//routes for the pages
const cuisineRoute = require("./routes/cuisine");
const dietRoute = require("./routes/diet");
const typeRoute = require("./routes/type");
const recipeRoute = require("./routes/recipe");
<<<<<<< HEAD
const filterRoute = require("./routes/filter");
=======
const addRoute = require("./routes/addRecipe");
const signInRoute = require("./routes/signIn");
const signUpRoute = require("./routes/signUp");
const signOutRoute = require("./routes/signOut");
const errorRoute = require("./routes/errorPage");
>>>>>>> fd75bc318c67f83d6f0fcb381a1d724ab404527d

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

<<<<<<< HEAD
//allowing for the routes to be used
=======
// for passport
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: true,
}));
setupPassport(app);

//allowing for the routes to be used 
>>>>>>> fd75bc318c67f83d6f0fcb381a1d724ab404527d
app.use("/cuisine", cuisineRoute);
app.use("/diet", dietRoute);
app.use("/type", typeRoute);
app.use("/recipes/:id", recipeRoute);
<<<<<<< HEAD
app.use("/filter", filterRoute);
=======
app.use("/add-recipe", addRoute);
app.use("/sign-in", signInRoute);
app.use("/sign-up", signUpRoute);
app.use("/sign-out", signOutRoute);
app.use("/error", errorRoute);
>>>>>>> fd75bc318c67f83d6f0fcb381a1d724ab404527d

app.get("/", (req, res) => {
  res.render("index", {
    cuisineList: cuisineList,
    dietList: dietList,
    typeList: typeList,
    cuisine: "Cuisine",
    diet: "Diet",
    type: "Type",
  });
});

// app.get("/broadsearch", (req, res) => {
//   res.render("broadSearch");
// });

<<<<<<< HEAD
//get api: https://api.spoonacular.com/recipes/complexSearch?cuisine=italian&apiKey=4d571645da1d408a9d5b832c5bec6874&diet=vegetarian

=======
// app.get("/cuisine", (req, res) => {
//   res.render("selectCuisine");
// });

// app.get("/diet", (req, res) => {
//   res.render("selectDiet");
// });

// app.get("/type", (req, res) => {
//   res.render("selectType");
// });

// app.get("/sign-in", (req, res) => {
//   res.render("signIn");
// })

// hide for passport
// app.get("/sign-up", (req, res) => {
//   res.render("signUp", {
//     cuisineList: cuisineList,
//     dietList: dietList
//   });
// })

app.get("/recipes", (req, res) => {
  res.render("recipeDisplay");
});

// hide for passport
// app.get("/add-recipe", (req, res) => {
//   res.render("addRecipe", {
//     cuisineList: cuisineList,
//     dietList: dietList,
//     typeList: typeList
//   });
// })

//get api: https://api.spoonacular.com/recipes/complexSearch?cuisine=italian&apiKey=4d571645da1d408a9d5b832c5bec6874&diet=vegetarian

//when user select cuisine, it will direct to listing all recipe pages
// app.post("/cuisine", async (req, res) => {
//   const country = req.body.cuisineName;
//   const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&cuisine=${country}&number=50`;
//   const response = await fetch(url);
//   const result = await response.json();
//   console.log(result);
//   const recipes = result.results;
//   const numOfRecipes = result.number;
//   // console.log(recipes);

//   //It should be render all information in grid
//   res.render("display", {
//     recipes: recipes,
//     broadType: "Cuisine",
//     specificType: country,
//     numberOfRecipes: numOfRecipes,
//     queryList: cuisineList,
//   });
// });

// app.post("/diet", async (req, res) => {
//   const diet = req.body.dietName;
//   // console.log(diet);
//   const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&diet=${diet}&number=50`;
//   const response = await fetch(url);
//   const result = await response.json();
//   const recipes = result.results;
//   const numOfRecipes = result.number;
//   // console.log(recipes);

//   //It should be render all information in grid
//   res.render("display", {
//     recipes: recipes,
//     broadType: "Diet",
//     specificType: diet,
//     numberOfRecipes: numOfRecipes,
//     queryList: dietList,
//   });
// });

// app.post("/type", async (req, res) => {
//   const type = req.body.typeName;
//   console.log(type);
//   const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&type=${type}&number=50`;
//   const response = await fetch(url);
//   const result = await response.json();
//   const recipes = result.results;
//   const numOfRecipes = result.number;
//   // console.log(recipes);

//   //It should be render all information in grid
//   res.render("display", {
//     recipes: recipes,
//     broadType: "Type",
//     specificType: type,
//     numberOfRecipes: numOfRecipes,
//     queryList: typeList,
//   });
// });

// app.post("/diet/:dietName", async (req, res) => {
//   const dietName = req.params.dietName;
//   const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&diet=${dietName}&number=50`;
//   const response = await fetch(url);
//   const result = await response.json();
//   console.log("It is in diet/:dietName route");
//   // console.log(result);
//   const recipes = result.results;
//   const numOfRecipes = result.number;

//   //It should be render all information in grid
//   res.render("display", {
//     recipes: recipes,
//     broadType: "Diet",
//     specificType: dietName,
//     numberOfRecipes: numOfRecipes,
//     queryList: dietList,
//   });
// });

// app.post("/cuisine/:cuisineName", async (req, res) => {
//   const cuisineName = req.params.cuisineName;
//   const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&cuisine=${cuisineName}&number=50`;
//   const response = await fetch(url);
//   const result = await response.json();
//   console.log("It is in cuisine/:cuisineName route");
//   // console.log(result);
//   const recipes = result.results;
//   const numOfRecipes = result.number;

//   //It should be render all information in grid
//   res.render("display", {
//     recipes: recipes,
//     broadType: "Cuisine",
//     specificType: cuisineName,
//     numberOfRecipes: numOfRecipes,
//     queryList: cuisineList,
//   });
// });

// app.post("/type/:typeName", async (req, res) => {
//   const typeName = req.params.typeName;
//   const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&type=${typeName}&number=50`;
//   const response = await fetch(url);
//   const result = await response.json();
//   // console.log("It is in type/typeName route");
//   // console.log(result);
//   const recipes = result.results;
//   const numOfRecipes = result.number;

//   //It should be render all information in grid
//   res.render("display", {
//     recipes: recipes,
//     broadType: "Type",
//     specificType: typeName,
//     numberOfRecipes: numOfRecipes,
//     queryList: typeList,
//   });
// });

// //Search by recipe ID
// app.get("/recipes/:id", async (req, res) => {
//   const result = await response.json();
//   res.send(result);
// });

// //Change the number of recipes basing on current cuisine/diet/type to call api
// app.post("/cuisine/:cuisineName/number", async (req, res) => {
//   const cuisineName = req.params.cuisineName;
//   const numOfRecipes = req.body.numberOfRecipes;
//   const url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY2}&cuisine=${cuisineName}&number=${numOfRecipes}`;
//   const response = await fetch(url);
//   const result = await response.json();
//   console.log("It is in cuisine/:cuisineName/number route");
//   console.log(result);
//   const recipes = result.results;

//   //It should render all information in grid
//   res.render("display", {
//     recipes: recipes,
//     broadType: "Cuisine",
//     specificType: cuisineName,
//     numberOfRecipes: numOfRecipes,
//     queryList: cuisineList,
//   });
// });


>>>>>>> fd75bc318c67f83d6f0fcb381a1d724ab404527d
app.listen(4000, () => {
  console.log("listening to 4000");
});
