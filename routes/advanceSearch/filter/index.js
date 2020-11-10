const passport = require("passport");
const express = require("express");
const fetch = require("node-fetch");
const cuisineList = require("../../../queryList/cuisineList");
const dietList = require("../../../queryList/dietList");
const typeList = require("../../../queryList/typeList");
const db = require("../../../database");
const router = express.Router();

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/sign-in");
}

router.get("/", isLoggedIn, (req, res) => {
  res.send("Only logged in can come to /advanceSearch/filter route");
});

router.post(
  "/:otherBroadType1/:otherBroadType2",
  isLoggedIn,
  async (req, res) => {
    let type1 = req.params.otherBroadType1; //eg.Cuisine
    let type2 = req.params.otherBroadType2; //eg. Diet
    let { broadType, specificType } = req.body; //eg. broadType = Type
    // console.log(type1, type2, broadType, specificType);
    let broadList;
    let type1List;
    let type2List;
    let showingOtherBroadType; //the filter broad catergroy user click
    let showingOtherSpecificType; //the filter speific catergroy user click
    let broadData;
    let dbRecipes = [];

    let checkboxes = []; //select all filtering parts

    let type1CheckBox = [];
    let type2CheckBox = [];

    let type1Querys = ""; //type1Querys = 'Chinese,Japanese,Thai';
    let type2Querys = ""; //type2Querys = 'Vegan,vegetarian';
    let dataCuisines;
    let dataDiets;
    let dataTypes;

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

    let stype1 = type1.charAt(0).toLowerCase() + type1.slice(1); //get small letter of "cuisine"
    let stype2 = type2.charAt(0).toLowerCase() + type2.slice(1); //get small letter of "type"
    let sbroadType = broadType.charAt(0).toLowerCase() + broadType.slice(1);
    let sspecificType =
      specificType.charAt(0).toLowerCase() + specificType.slice(1);

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
      showingOtherBroadType = type1; //Diet
      showingOtherSpecificType = type1Querys; // Vegan
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
    // console.log(broadType, specificType, sbroadType, sspecificType);
    // console.log(type1, type1Querys, stype1);
    // console.log(type2, type2Querys, stype2);

    //eg. Broad: Diet - Vegan ; otherBroad: Cuisine - American
    //1. find the dietID = vegan in diets table
    //2. find the recipeID of vegan in recipe_diet table
    //3. find the cuisines/dishTypes/diets of that recipeID, see if American is inside, and then render

    if (broadType === "Type") {
      specificType = specificType.toLowerCase();
      broadData = await db
        .select("*")
        .from(`${sbroadType}s`)
        .where("name", "=", specificType);
    } else {
      broadData = await db
        .select("*")
        .from(`${sbroadType}s`)
        .where("name", "=", specificType);
    }
    // console.log(`broadData is below`);
    // console.log(broadData);
    let broadId = broadData[0][`${sbroadType}_id`];
    // console.log(`broadId - ${sbroadType}Id is below`);
    // console.log(broadId);

    let recipeBroadData = await db
      .select("recipe_id")
      .from(`recipe_${sbroadType}`)
      .where(`${sbroadType}_id`, "=", broadId);
    // console.log(`recipeBroadData - recipe${sbroadType}Data is below`);
    // console.log(recipeBroadData);

    for (let recipe of recipeBroadData) {
      let eachRecipeId = recipe.recipe_id;
      let data = await db
        .select(
          "recipe_id",
          "recipe_name",
          "recipe_instruction",
          "recipe_image",
          "ingredients",
          "equipment",
          "nutrient",
          "cuisines",
          "dishTypes",
          "diets"
        )
        .from("recipes")
        .where("recipe_id", "=", eachRecipeId);
      if (data[0] !== undefined) {
        dataCuisines = data[0]["cuisines"];
        dataTypes = data[0]["dishTypes"];
        dataDiets = data[0]["diets"];
        // console.log(dataCuisines);
        // console.log(dataTypes);
        // console.log(dataDiets);
        if (showingOtherBroadType === "Cuisine") {
          if (dataCuisines.length !== 0) {
            if (dataCuisines.includes(showingOtherSpecificType)) {
              //dbRecipes add this recipeID
              dbRecipes.push({
                id: data[0].recipe_id,
                title: data[0].recipe_name,
                image: data[0].recipe_image,
              });
            }
          }
        } else if (showingOtherBroadType === "Type") {
          if (dataTypes.length !== 0) {
            if (dataTypes.includes(showingOtherSpecificType.toLowerCase())) {
              //dbRecipes add this recipeID
              dbRecipes.push({
                id: data[0].recipe_id,
                title: data[0].recipe_name,
                image: data[0].recipe_image,
              });
            }
          }
        } else if (showingOtherBroadType === "Diet") {
          if (dataDiets.length !== 0) {
            if (dataDiets.includes(showingOtherSpecificType.toLowerCase())) {
              //dbRecipes add this recipeID
              dbRecipes.push({
                id: data[0].recipe_id,
                title: data[0].recipe_name,
                image: data[0].recipe_image,
              });
            }
          }
        }
      }
      // console.log(`data is below`);
      // console.log(data);
    }
    // console.log(dbRecipes);
    res.render("adVanceDisplay", {
      recipes: dbRecipes, //Result from API
      broadType: broadType,
      specificType: specificType,
      numberOfRecipes: dbRecipes.length,
      queryList: broadList,
      otherBroadType1: type1,
      otherBroadType1List: type1List,
      otherBroadType2: type2,
      otherBroadType2List: type2List,
      totalRecipes: "",
      showingOtherBroadType: showingOtherBroadType,
      showingOtherSpecificType: showingOtherSpecificType,
      afterFilter: true,
      advanceFilterName: "",
      advanceFilterValue: "",
    });
  }
);

router.post(
  "/:showingBroadType/:showingSpecificType/calories",
  isLoggedIn,
  async (req, res) => {
    let {
      caloriesVal,
      showingOtherBroadType,
      showingOtherSpecificType,
    } = req.body;
    let showingBroadType = req.params.showingBroadType; //must have
    let showingSpecificType = req.params.showingSpecificType; //must have
    let type1 = req.body.type1;
    let type2 = req.body.type2;
    // console.log(`type1 = ${type1}`);
    // console.log(`type2 = ${type2}`);

    let dataCuisines;
    let dataDiets;
    let dataTypes;
    let broadList;
    let type1List;
    let type2List;

    broadList =
      showingBroadType.toLowerCase() === "cuisine"
        ? cuisineList
        : showingBroadType.toLowerCase() === "diet"
        ? dietList
        : typeList;
    type1List =
      type1.toLowerCase() === "cuisine"
        ? cuisineList
        : type1.toLowerCase() === "diet"
        ? dietList
        : typeList;
    type2List =
      type2.toLowerCase() === "cuisine"
        ? cuisineList
        : type2.toLowerCase() === "diet"
        ? dietList
        : typeList;

    let dbRecipes = [];

    let sShowingBroadType =
      showingBroadType.charAt(0).toLowerCase() + showingBroadType.slice(1); //get small letter of "cuisine"
    let sShowingSpecificType =
      showingSpecificType.charAt(0).toLowerCase() +
      showingSpecificType.slice(1); //get small letter of "type"
    let sShowingOtherBroadType = "";
    let sShowingOtherSpecificType = "";
    if (showingOtherBroadType !== "" && showingOtherSpecificType !== "") {
      sShowingOtherBroadType =
        showingOtherBroadType.charAt(0).toLowerCase() +
        showingOtherBroadType.slice(1);
      sShowingOtherSpecificType =
        showingOtherSpecificType.charAt(0).toLowerCase() +
        showingOtherSpecificType.slice(1);
    }
    // console.log(
    //   sShowingBroadType,
    //   sShowingSpecificType,
    //   sShowingOtherBroadType,
    //   sShowingOtherSpecificType
    // );

    if (sShowingBroadType === "type") {
      showingSpecificType = showingSpecificType.toLowerCase();
    }

    let broadData = await db
      .select("*")
      .from(`${sShowingBroadType}s`)
      .where("name", "=", showingSpecificType);
    // console.log(`broadData is below`);
    // console.log(broadData);

    let broadId = broadData[0][`${sShowingBroadType}_id`];
    // console.log(`broadId is below`);
    // console.log(broadId);

    let recipeBroadData = await db
      .select("recipe_id")
      .from(`recipe_${sShowingBroadType}`)
      .where(`${sShowingBroadType}_id`, "=", broadId);
    // console.log(`recipeBroadData is below`);
    // console.log(recipeBroadData);

    if (showingOtherBroadType === "") {
      for (let recipe of recipeBroadData) {
        let eachRecipeId = recipe.recipe_id;
        let data = await db
          .select(
            "recipe_id",
            "recipe_name",
            "recipe_instruction",
            "recipe_image",
            "ingredients",
            "equipment",
            "nutrient",
            "cuisines",
            "dishTypes",
            "diets"
          )
          .from("recipes")
          .where("recipe_id", "=", eachRecipeId);
        if (data[0] !== undefined) {
          // console.log(data[0]);
          for (let i = 0; i < data[0].nutrient.length; i++) {
            if (data[0].nutrient[i].title === "Calories") {
              if (data[0].nutrient[i].amount >= parseInt(caloriesVal)) {
                // console.log(data[0].nutrient[i].amount);
                dbRecipes.push({
                  id: data[0].recipe_id,
                  title: data[0].recipe_name,
                  image: data[0].recipe_image,
                });
              }
            }
          }
        }
      }
    } else {
      for (let recipe of recipeBroadData) {
        let eachRecipeId = recipe.recipe_id;
        let data = await db
          .select(
            "recipe_id",
            "recipe_name",
            "recipe_instruction",
            "recipe_image",
            "ingredients",
            "equipment",
            "nutrient",
            "cuisines",
            "dishTypes",
            "diets"
          )
          .from("recipes")
          .where("recipe_id", "=", eachRecipeId);
        if (data[0] !== undefined) {
          dataCuisines = data[0]["cuisines"];
          dataTypes = data[0]["dishTypes"];
          dataDiets = data[0]["diets"];
          // console.log(dataCuisines);
          // console.log(dataTypes);
          // console.log(dataDiets);
          if (showingOtherBroadType === "Cuisine") {
            if (dataCuisines.length !== 0) {
              if (dataCuisines.includes(showingOtherSpecificType)) {
                //dbRecipes add this recipeID
                for (let i = 0; i < data[0].nutrient.length; i++) {
                  if (data[0].nutrient[i].title === "Calories") {
                    if (data[0].nutrient[i].amount >= parseInt(caloriesVal)) {
                      console.log(data[0].nutrient[i].amount);
                      dbRecipes.push({
                        id: data[0].recipe_id,
                        title: data[0].recipe_name,
                        image: data[0].recipe_image,
                      });
                    }
                  }
                }
              }
            }
          } else if (showingOtherBroadType === "Type") {
            if (dataTypes.length !== 0) {
              if (dataTypes.includes(showingOtherSpecificType.toLowerCase())) {
                //dbRecipes add this recipeID
                for (let i = 0; i < data[0].nutrient.length; i++) {
                  if (data[0].nutrient[i].title === "Calories") {
                    if (data[0].nutrient[i].amount >= parseInt(caloriesVal)) {
                      // console.log(data[0].nutrient[i].amount);
                      dbRecipes.push({
                        id: data[0].recipe_id,
                        title: data[0].recipe_name,
                        image: data[0].recipe_image,
                      });
                    }
                  }
                }
              }
            }
          } else if (showingOtherBroadType === "Diet") {
            if (dataDiets.length !== 0) {
              if (dataDiets.includes(showingOtherSpecificType.toLowerCase())) {
                //dbRecipes add this recipeID
                for (let i = 0; i < data[0].nutrient.length; i++) {
                  if (data[0].nutrient[i].title === "Calories") {
                    if (data[0].nutrient[i].amount >= parseInt(caloriesVal)) {
                      // console.log(data[0].nutrient[i].amount);
                      dbRecipes.push({
                        id: data[0].recipe_id,
                        title: data[0].recipe_name,
                        image: data[0].recipe_image,
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // console.log(dbRecipes);

    res.render("adVanceDisplay", {
      recipes: dbRecipes, //Result from API
      broadType: showingBroadType,
      specificType: showingSpecificType,
      numberOfRecipes: dbRecipes.length,
      queryList: broadList,
      otherBroadType1: type1,
      otherBroadType1List: type1List,
      otherBroadType2: type2,
      otherBroadType2List: type2List,
      totalRecipes: "",
      showingOtherBroadType: showingOtherBroadType,
      showingOtherSpecificType: showingOtherSpecificType,
      afterFilter: true,
      advanceFilterName: "Calories",
      advanceFilterValue: caloriesVal,
    });
  }
);

router.post(
  "/:showingBroadType/:showingSpecificType/fats",
  isLoggedIn,
  async (req, res) => {
    let { fatsVal, showingOtherBroadType, showingOtherSpecificType } = req.body;
    let showingBroadType = req.params.showingBroadType; //must have
    let showingSpecificType = req.params.showingSpecificType; //must have
    let type1 = req.body.type1;
    let type2 = req.body.type2;
    // console.log(`type1 = ${type1}`);
    // console.log(`type2 = ${type2}`);

    let dataCuisines;
    let dataDiets;
    let dataTypes;
    let broadList;
    let type1List;
    let type2List;

    broadList =
      showingBroadType.toLowerCase() === "cuisine"
        ? cuisineList
        : showingBroadType.toLowerCase() === "diet"
        ? dietList
        : typeList;
    type1List =
      type1.toLowerCase() === "cuisine"
        ? cuisineList
        : type1.toLowerCase() === "diet"
        ? dietList
        : typeList;
    type2List =
      type2.toLowerCase() === "cuisine"
        ? cuisineList
        : type2.toLowerCase() === "diet"
        ? dietList
        : typeList;

    let dbRecipes = [];

    let sShowingBroadType =
      showingBroadType.charAt(0).toLowerCase() + showingBroadType.slice(1); //get small letter of "cuisine"
    let sShowingSpecificType =
      showingSpecificType.charAt(0).toLowerCase() +
      showingSpecificType.slice(1); //get small letter of "type"
    let sShowingOtherBroadType = "";
    let sShowingOtherSpecificType = "";
    if (showingOtherBroadType !== "" && showingOtherSpecificType !== "") {
      sShowingOtherBroadType =
        showingOtherBroadType.charAt(0).toLowerCase() +
        showingOtherBroadType.slice(1);
      sShowingOtherSpecificType =
        showingOtherSpecificType.charAt(0).toLowerCase() +
        showingOtherSpecificType.slice(1);
    }
    // console.log(
    //   sShowingBroadType,
    //   sShowingSpecificType,
    //   sShowingOtherBroadType,
    //   sShowingOtherSpecificType
    // );

    if (sShowingBroadType === "type") {
      showingSpecificType = showingSpecificType.toLowerCase();
    }

    let broadData = await db
      .select("*")
      .from(`${sShowingBroadType}s`)
      .where("name", "=", showingSpecificType);
    // console.log(`broadData is below`);
    // console.log(broadData);

    let broadId = broadData[0][`${sShowingBroadType}_id`];
    // console.log(`broadId is below`);
    // console.log(broadId);

    let recipeBroadData = await db
      .select("recipe_id")
      .from(`recipe_${sShowingBroadType}`)
      .where(`${sShowingBroadType}_id`, "=", broadId);
    // console.log(`recipeBroadData is below`);
    // console.log(recipeBroadData);

    if (showingOtherBroadType === "") {
      for (let recipe of recipeBroadData) {
        let eachRecipeId = recipe.recipe_id;
        let data = await db
          .select(
            "recipe_id",
            "recipe_name",
            "recipe_instruction",
            "recipe_image",
            "ingredients",
            "equipment",
            "nutrient",
            "cuisines",
            "dishTypes",
            "diets"
          )
          .from("recipes")
          .where("recipe_id", "=", eachRecipeId);
        if (data[0] !== undefined) {
          // console.log(data[0].nutrient);
          for (let i = 0; i < data[0].nutrient.length; i++) {
            if (data[0].nutrient[i].title === "Fat") {
              if (data[0].nutrient[i].amount >= parseInt(fatsVal)) {
                // console.log(data[0].nutrient[i].amount);
                dbRecipes.push({
                  id: data[0].recipe_id,
                  title: data[0].recipe_name,
                  image: data[0].recipe_image,
                });
              }
            }
          }
        }
      }
    } else {
      for (let recipe of recipeBroadData) {
        let eachRecipeId = recipe.recipe_id;
        let data = await db
          .select(
            "recipe_id",
            "recipe_name",
            "recipe_instruction",
            "recipe_image",
            "ingredients",
            "equipment",
            "nutrient",
            "cuisines",
            "dishTypes",
            "diets"
          )
          .from("recipes")
          .where("recipe_id", "=", eachRecipeId);
        if (data[0] !== undefined) {
          // console.log(data[0].nutrient);
          dataCuisines = data[0]["cuisines"];
          dataTypes = data[0]["dishTypes"];
          dataDiets = data[0]["diets"];
          // console.log(dataCuisines);
          // console.log(dataTypes);
          // console.log(dataDiets);
          if (showingOtherBroadType === "Cuisine") {
            if (dataCuisines.length !== 0) {
              if (dataCuisines.includes(showingOtherSpecificType)) {
                //dbRecipes add this recipeID
                for (let i = 0; i < data[0].nutrient.length; i++) {
                  if (data[0].nutrient[i].title === "Fat") {
                    if (data[0].nutrient[i].amount >= parseInt(fatsVal)) {
                      // console.log(data[0].nutrient[i].amount);
                      dbRecipes.push({
                        id: data[0].recipe_id,
                        title: data[0].recipe_name,
                        image: data[0].recipe_image,
                      });
                    }
                  }
                }
              }
            }
          } else if (showingOtherBroadType === "Type") {
            if (dataTypes.length !== 0) {
              if (dataTypes.includes(showingOtherSpecificType.toLowerCase())) {
                //dbRecipes add this recipeID
                for (let i = 0; i < data[0].nutrient.length; i++) {
                  if (data[0].nutrient[i].title === "Fat") {
                    if (data[0].nutrient[i].amount >= parseInt(fatsVal)) {
                      // console.log(data[0].nutrient[i].amount);
                      dbRecipes.push({
                        id: data[0].recipe_id,
                        title: data[0].recipe_name,
                        image: data[0].recipe_image,
                      });
                    }
                  }
                }
              }
            }
          } else if (showingOtherBroadType === "Diet") {
            if (dataDiets.length !== 0) {
              if (dataDiets.includes(showingOtherSpecificType.toLowerCase())) {
                //dbRecipes add this recipeID
                for (let i = 0; i < data[0].nutrient.length; i++) {
                  if (data[0].nutrient[i].title === "Fat") {
                    if (data[0].nutrient[i].amount >= parseInt(fatsVal)) {
                      // console.log(data[0].nutrient[i].amount);
                      dbRecipes.push({
                        id: data[0].recipe_id,
                        title: data[0].recipe_name,
                        image: data[0].recipe_image,
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // console.log(dbRecipes);

    res.render("adVanceDisplay", {
      recipes: dbRecipes, //Result from API
      broadType: showingBroadType,
      specificType: showingSpecificType,
      numberOfRecipes: dbRecipes.length,
      queryList: broadList,
      otherBroadType1: type1,
      otherBroadType1List: type1List,
      otherBroadType2: type2,
      otherBroadType2List: type2List,
      totalRecipes: "",
      showingOtherBroadType: showingOtherBroadType,
      showingOtherSpecificType: showingOtherSpecificType,
      afterFilter: true,
      advanceFilterName: "Fat",
      advanceFilterValue: fatsVal,
    });
  }
);
router.post(
  "/:showingBroadType/:showingSpecificType/saturatedfat",
  isLoggedIn,
  async (req, res) => {
    let {
      saturatedFatVal,
      showingOtherBroadType,
      showingOtherSpecificType,
    } = req.body;
    let showingBroadType = req.params.showingBroadType; //must have
    let showingSpecificType = req.params.showingSpecificType; //must have
    let type1 = req.body.type1;
    let type2 = req.body.type2;
    // console.log(`type1 = ${type1}`);
    // console.log(`type2 = ${type2}`);

    let dataCuisines;
    let dataDiets;
    let dataTypes;
    let broadList;
    let type1List;
    let type2List;

    broadList =
      showingBroadType.toLowerCase() === "cuisine"
        ? cuisineList
        : showingBroadType.toLowerCase() === "diet"
        ? dietList
        : typeList;
    type1List =
      type1.toLowerCase() === "cuisine"
        ? cuisineList
        : type1.toLowerCase() === "diet"
        ? dietList
        : typeList;
    type2List =
      type2.toLowerCase() === "cuisine"
        ? cuisineList
        : type2.toLowerCase() === "diet"
        ? dietList
        : typeList;

    let dbRecipes = [];

    let sShowingBroadType =
      showingBroadType.charAt(0).toLowerCase() + showingBroadType.slice(1); //get small letter of "cuisine"
    let sShowingSpecificType =
      showingSpecificType.charAt(0).toLowerCase() +
      showingSpecificType.slice(1); //get small letter of "type"
    let sShowingOtherBroadType = "";
    let sShowingOtherSpecificType = "";
    if (showingOtherBroadType !== "" && showingOtherSpecificType !== "") {
      sShowingOtherBroadType =
        showingOtherBroadType.charAt(0).toLowerCase() +
        showingOtherBroadType.slice(1);
      sShowingOtherSpecificType =
        showingOtherSpecificType.charAt(0).toLowerCase() +
        showingOtherSpecificType.slice(1);
    }
    // console.log(
    //   sShowingBroadType,
    //   sShowingSpecificType,
    //   sShowingOtherBroadType,
    //   sShowingOtherSpecificType
    // );

    if (sShowingBroadType === "type") {
      showingSpecificType = showingSpecificType.toLowerCase();
    }

    let broadData = await db
      .select("*")
      .from(`${sShowingBroadType}s`)
      .where("name", "=", showingSpecificType);
    // console.log(`broadData is below`);
    // console.log(broadData);

    let broadId = broadData[0][`${sShowingBroadType}_id`];
    // console.log(`broadId is below`);
    // console.log(broadId);

    let recipeBroadData = await db
      .select("recipe_id")
      .from(`recipe_${sShowingBroadType}`)
      .where(`${sShowingBroadType}_id`, "=", broadId);
    // console.log(`recipeBroadData is below`);
    // console.log(recipeBroadData);

    if (showingOtherBroadType === "") {
      for (let recipe of recipeBroadData) {
        let eachRecipeId = recipe.recipe_id;
        let data = await db
          .select(
            "recipe_id",
            "recipe_name",
            "recipe_instruction",
            "recipe_image",
            "ingredients",
            "equipment",
            "nutrient",
            "cuisines",
            "dishTypes",
            "diets"
          )
          .from("recipes")
          .where("recipe_id", "=", eachRecipeId);
        if (data[0] !== undefined) {
          // console.log(data[0].nutrient);
          for (let i = 0; i < data[0].nutrient.length; i++) {
            if (data[0].nutrient[i].title === "Saturated Fat") {
              if (data[0].nutrient[i].amount >= parseInt(saturatedFatVal)) {
                // console.log(data[0].nutrient[i].amount);
                dbRecipes.push({
                  id: data[0].recipe_id,
                  title: data[0].recipe_name,
                  image: data[0].recipe_image,
                });
              }
            }
          }
        }
      }
    } else {
      for (let recipe of recipeBroadData) {
        let eachRecipeId = recipe.recipe_id;
        let data = await db
          .select(
            "recipe_id",
            "recipe_name",
            "recipe_instruction",
            "recipe_image",
            "ingredients",
            "equipment",
            "nutrient",
            "cuisines",
            "dishTypes",
            "diets"
          )
          .from("recipes")
          .where("recipe_id", "=", eachRecipeId);
        if (data[0] !== undefined) {
          // console.log(data[0].nutrient);
          dataCuisines = data[0]["cuisines"];
          dataTypes = data[0]["dishTypes"];
          dataDiets = data[0]["diets"];
          // console.log(dataCuisines);
          // console.log(dataTypes);
          // console.log(dataDiets);
          if (showingOtherBroadType === "Cuisine") {
            if (dataCuisines.length !== 0) {
              if (dataCuisines.includes(showingOtherSpecificType)) {
                //dbRecipes add this recipeID
                for (let i = 0; i < data[0].nutrient.length; i++) {
                  if (data[0].nutrient[i].title === "Saturated Fat") {
                    if (
                      data[0].nutrient[i].amount >= parseInt(saturatedFatVal)
                    ) {
                      // console.log(data[0].nutrient[i].amount);
                      dbRecipes.push({
                        id: data[0].recipe_id,
                        title: data[0].recipe_name,
                        image: data[0].recipe_image,
                      });
                    }
                  }
                }
              }
            }
          } else if (showingOtherBroadType === "Type") {
            if (dataTypes.length !== 0) {
              if (dataTypes.includes(showingOtherSpecificType.toLowerCase())) {
                //dbRecipes add this recipeID
                for (let i = 0; i < data[0].nutrient.length; i++) {
                  if (data[0].nutrient[i].title === "Saturated Fat") {
                    if (
                      data[0].nutrient[i].amount >= parseInt(saturatedFatVal)
                    ) {
                      // console.log(data[0].nutrient[i].amount);
                      dbRecipes.push({
                        id: data[0].recipe_id,
                        title: data[0].recipe_name,
                        image: data[0].recipe_image,
                      });
                    }
                  }
                }
              }
            }
          } else if (showingOtherBroadType === "Diet") {
            if (dataDiets.length !== 0) {
              if (dataDiets.includes(showingOtherSpecificType.toLowerCase())) {
                //dbRecipes add this recipeID
                for (let i = 0; i < data[0].nutrient.length; i++) {
                  if (data[0].nutrient[i].title === "Saturated Fat") {
                    if (
                      data[0].nutrient[i].amount >= parseInt(saturatedFatVal)
                    ) {
                      // console.log(data[0].nutrient[i].amount);
                      dbRecipes.push({
                        id: data[0].recipe_id,
                        title: data[0].recipe_name,
                        image: data[0].recipe_image,
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    // console.log(dbRecipes);

    res.render("adVanceDisplay", {
      recipes: dbRecipes, //Result from API
      broadType: showingBroadType,
      specificType: showingSpecificType,
      numberOfRecipes: dbRecipes.length,
      queryList: broadList,
      otherBroadType1: type1,
      otherBroadType1List: type1List,
      otherBroadType2: type2,
      otherBroadType2List: type2List,
      totalRecipes: "",
      showingOtherBroadType: showingOtherBroadType,
      showingOtherSpecificType: showingOtherSpecificType,
      afterFilter: true,
      advanceFilterName: "Saturated Fat",
      advanceFilterValue: saturatedFatVal,
    });
  }
);

router.post(
  "/:showingBroadType/:showingSpecificType/carbs",
  isLoggedIn,
  async (req, res) => {
    let {
      carbsVal,
      showingOtherBroadType,
      showingOtherSpecificType,
    } = req.body;
    let showingBroadType = req.params.showingBroadType; //must have
    let showingSpecificType = req.params.showingSpecificType; //must have
    let type1 = req.body.type1;
    let type2 = req.body.type2;
    // console.log(`type1 = ${type1}`);
    // console.log(`type2 = ${type2}`);

    let dataCuisines;
    let dataDiets;
    let dataTypes;
    let broadList;
    let type1List;
    let type2List;

    broadList =
      showingBroadType.toLowerCase() === "cuisine"
        ? cuisineList
        : showingBroadType.toLowerCase() === "diet"
        ? dietList
        : typeList;
    type1List =
      type1.toLowerCase() === "cuisine"
        ? cuisineList
        : type1.toLowerCase() === "diet"
        ? dietList
        : typeList;
    type2List =
      type2.toLowerCase() === "cuisine"
        ? cuisineList
        : type2.toLowerCase() === "diet"
        ? dietList
        : typeList;

    let dbRecipes = [];

    let sShowingBroadType =
      showingBroadType.charAt(0).toLowerCase() + showingBroadType.slice(1); //get small letter of "cuisine"
    let sShowingSpecificType =
      showingSpecificType.charAt(0).toLowerCase() +
      showingSpecificType.slice(1); //get small letter of "type"
    let sShowingOtherBroadType = "";
    let sShowingOtherSpecificType = "";
    if (showingOtherBroadType !== "" && showingOtherSpecificType !== "") {
      sShowingOtherBroadType =
        showingOtherBroadType.charAt(0).toLowerCase() +
        showingOtherBroadType.slice(1);
      sShowingOtherSpecificType =
        showingOtherSpecificType.charAt(0).toLowerCase() +
        showingOtherSpecificType.slice(1);
    }
    // console.log(
    //   sShowingBroadType,
    //   sShowingSpecificType,
    //   sShowingOtherBroadType,
    //   sShowingOtherSpecificType
    // );

    if (sShowingBroadType === "type") {
      showingSpecificType = showingSpecificType.toLowerCase();
    }

    let broadData = await db
      .select("*")
      .from(`${sShowingBroadType}s`)
      .where("name", "=", showingSpecificType);
    // console.log(`broadData is below`);
    // console.log(broadData);

    let broadId = broadData[0][`${sShowingBroadType}_id`];
    // console.log(`broadId is below`);
    // console.log(broadId);

    let recipeBroadData = await db
      .select("recipe_id")
      .from(`recipe_${sShowingBroadType}`)
      .where(`${sShowingBroadType}_id`, "=", broadId);
    // console.log(`recipeBroadData is below`);
    // console.log(recipeBroadData);

    if (showingOtherBroadType === "") {
      for (let recipe of recipeBroadData) {
        let eachRecipeId = recipe.recipe_id;
        let data = await db
          .select(
            "recipe_id",
            "recipe_name",
            "recipe_instruction",
            "recipe_image",
            "ingredients",
            "equipment",
            "nutrient",
            "cuisines",
            "dishTypes",
            "diets"
          )
          .from("recipes")
          .where("recipe_id", "=", eachRecipeId);
        if (data[0] !== undefined) {
          // console.log(data[0].nutrient);
          for (let i = 0; i < data[0].nutrient.length; i++) {
            if (data[0].nutrient[i].title === "Carbohydrates") {
              if (data[0].nutrient[i].amount >= parseInt(carbsVal)) {
                // console.log(data[0].nutrient[i].amount);
                dbRecipes.push({
                  id: data[0].recipe_id,
                  title: data[0].recipe_name,
                  image: data[0].recipe_image,
                });
              }
            }
          }
        }
      }
    } else {
      for (let recipe of recipeBroadData) {
        let eachRecipeId = recipe.recipe_id;
        let data = await db
          .select(
            "recipe_id",
            "recipe_name",
            "recipe_instruction",
            "recipe_image",
            "ingredients",
            "equipment",
            "nutrient",
            "cuisines",
            "dishTypes",
            "diets"
          )
          .from("recipes")
          .where("recipe_id", "=", eachRecipeId);
        if (data[0] !== undefined) {
          // console.log(data[0].nutrient);
          dataCuisines = data[0]["cuisines"];
          dataTypes = data[0]["dishTypes"];
          dataDiets = data[0]["diets"];
          // console.log(dataCuisines);
          // console.log(dataTypes);
          // console.log(dataDiets);
          if (showingOtherBroadType === "Cuisine") {
            if (dataCuisines.length !== 0) {
              if (dataCuisines.includes(showingOtherSpecificType)) {
                //dbRecipes add this recipeID
                for (let i = 0; i < data[0].nutrient.length; i++) {
                  if (data[0].nutrient[i].title === "Carbohydrates") {
                    if (data[0].nutrient[i].amount >= parseInt(carbsVal)) {
                      console.log(data[0].nutrient[i].amount);
                      dbRecipes.push({
                        id: data[0].recipe_id,
                        title: data[0].recipe_name,
                        image: data[0].recipe_image,
                      });
                    }
                  }
                }
              }
            }
          } else if (showingOtherBroadType === "Type") {
            if (dataTypes.length !== 0) {
              if (dataTypes.includes(showingOtherSpecificType.toLowerCase())) {
                //dbRecipes add this recipeID
                for (let i = 0; i < data[0].nutrient.length; i++) {
                  if (data[0].nutrient[i].title === "Carbohydrates") {
                    if (data[0].nutrient[i].amount >= parseInt(carbsVal)) {
                      // console.log(data[0].nutrient[i].amount);
                      dbRecipes.push({
                        id: data[0].recipe_id,
                        title: data[0].recipe_name,
                        image: data[0].recipe_image,
                      });
                    }
                  }
                }
              }
            }
          } else if (showingOtherBroadType === "Diet") {
            if (dataDiets.length !== 0) {
              if (dataDiets.includes(showingOtherSpecificType.toLowerCase())) {
                //dbRecipes add this recipeID
                for (let i = 0; i < data[0].nutrient.length; i++) {
                  if (data[0].nutrient[i].title === "Carbohydrates") {
                    if (data[0].nutrient[i].amount >= parseInt(carbsVal)) {
                      // console.log(data[0].nutrient[i].amount);
                      dbRecipes.push({
                        id: data[0].recipe_id,
                        title: data[0].recipe_name,
                        image: data[0].recipe_image,
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    console.log(dbRecipes);

    res.render("adVanceDisplay", {
      recipes: dbRecipes, //Result from API
      broadType: showingBroadType,
      specificType: showingSpecificType,
      numberOfRecipes: dbRecipes.length,
      queryList: broadList,
      otherBroadType1: type1,
      otherBroadType1List: type1List,
      otherBroadType2: type2,
      otherBroadType2List: type2List,
      totalRecipes: "",
      showingOtherBroadType: showingOtherBroadType,
      showingOtherSpecificType: showingOtherSpecificType,
      afterFilter: true,
      advanceFilterName: "Carbohydrates",
      advanceFilterValue: carbsVal,
    });
  }
);

module.exports = router;
