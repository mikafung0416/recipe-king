const express = require("express");
const fetch = require("node-fetch");
const cuisineList = require("../../queryList/cuisineList");
const dietList = require("../../queryList/dietList");
const typeList = require("../../queryList/typeList");
const db = require("../../database");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hi, is in filter route");
});

router.post("/:otherBroadType1/:otherBroadType2", async (req, res) => {
  let type1 = req.params.otherBroadType1;
  let type2 = req.params.otherBroadType2;
  let { broadType, specificType } = req.body;
  let broadList;
  let type1List;
  let type2List;
  let showingOtherBroadType;
  let showingOtherSpecificType;

  let checkboxes = [];

  let type1CheckBox = [];
  let type2CheckBox = [];

  let type1Querys = "";
  let type2Querys = "";
  //type1Querys = 'Chinese,Japanese,Thai';
  //type2Querys = 'Vegan,vegetarian';

  //take away the checkboxes which are clicked
  for (let item in req.body) {
    if (req.body[item] === "on") {
      checkboxes.push(item);
    }
  }

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].split(`-${type1}`).length === 1) {
      type2CheckBox.push(checkboxes[i].split(`-${type2}`)[0]);
    } else {
      type1CheckBox.push(checkboxes[i].split(`-${type1}`)[0]);
    }
  }

  let stype1 = type1.charAt(0).toLowerCase() + type1.slice(1);
  let stype2 = type2.charAt(0).toLowerCase() + type2.slice(1);
  let sbroadType = broadType.charAt(0).toLowerCase() + broadType.slice(1);
  let sspecificType =
    specificType.charAt(0).toLowerCase() + specificType.slice(1);

  console.log(broadType, type1, type2);
  console.log(type1CheckBox);
  console.log(type2CheckBox);

  broadList =
    sbroadType === "cuisine"
      ? cuisineList
      : sbroadType === "diet"
      ? dietList
      : typeList;
  type1List =
    stype1 === "cuisine"
      ? cuisineList
      : stype1 === "diet"
      ? dietList
      : typeList;
  type2List =
    stype2 === "cuisine"
      ? cuisineList
      : stype2 === "diet"
      ? dietList
      : typeList;
  //1. search db to see if have, if have, then render from db to user

  //2a if dont have, then search from api, then render from api to user
  if (type1CheckBox.length === 0) {
    type1Querys = "";
  } else {
    for (let i = 0; i < type1CheckBox.length; i++) {
      type1Querys += type1CheckBox[i];
      if (i !== type1CheckBox.length - 1) {
        //the last one will not add , type1Querys = 'Chinese,Japanese,Thai';
        type1Querys += ",";
      }
    }
    showingOtherBroadType = type1;
    showingOtherSpecificType = type1Querys;
  }

  if (type2CheckBox.length === 0) {
    type2Querys = "";
  } else {
    for (let i = 0; i < type2CheckBox.length; i++) {
      type2Querys += type2CheckBox[i];
      if (i !== type2CheckBox.length - 1) {
        //the last one will not add ,
        type2Querys += ",";
      }
    }
    showingOtherBroadType = type2;
    showingOtherSpecificType = type2Querys;
  }
  console.log(type1Querys);
  console.log(type2Querys);

  let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.API_KEY1}&${sbroadType}=${sspecificType}&${stype1}=${type1Querys}&${stype2}=${type2Querys}&number=2`;
  console.log(url);
  let response = await fetch(url);
  let result = await response.json();
  let recipes = result.results;
  totalRecipes = result.totalResults;

  console.log("Filtering Results from API");
  console.log(recipes);
  //2b At the same time, insert the missing recipes to "recipes" table, recipesIDs to "reicpe-cuisine/diet/type" table
  res.render("display", {
    recipes: recipes, //Result from API
    broadType: broadType,
    specificType: specificType,
    numberOfRecipes: recipes.length,
    queryList: broadList,
    otherBroadType1: type1,
    otherBroadType1List: type1List,
    otherBroadType2: type2,
    otherBroadType2List: type2List,
    totalRecipes: totalRecipes,
    showingOtherBroadType: showingOtherBroadType,
    showingOtherSpecificType: showingOtherSpecificType,
  });
});

module.exports = router;
