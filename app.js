require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fetch = require("node-fetch");
const path = require("path");

const cuisineList = require("./queryList/cuisineList");
const dietList = require("./queryList/dietList");
const typeList = require("./queryList/typeList");

const cuisineRoute = require("./routes/cuisine");
const dietRoute = require("./routes/diet");
const typeRoute = require("./routes/type");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/cuisine", cuisineRoute);
app.use("/diet", dietRoute);
app.use("/type", typeRoute);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/broadsearch", (req, res) => {
  res.render("broadSearch");
});

//Search by recipe ID
app.get("/recipes/:id", async (req, res) => {
  const recipeId = req.params.id;
  const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${process.env.API_KEY21}`;
  const response = await fetch(url);
  const result = await response.json();
  console.log("It is in recipes/id route");
  console.log(result);
  const recipes = result.results;
  const builtInURL = result.spoonacularSourceUrl;
  res.send(builtInURL);
});

app.listen(4000, () => {
  console.log("listening to 4000");
});
