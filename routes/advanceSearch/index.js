const passport = require("passport");
const express = require("express");
const fetch = require("node-fetch");
const cuisineList = require("../../queryList/cuisineList");
const dietList = require("../../queryList/dietList");
const typeList = require("../../queryList/typeList");
const db = require("../../database");
const router = express.Router();

const advanceCuisineRoute = require("./cuisine");
const advanceDietRoute = require("./diet");
const advanceTypeRoute = require("./type");
const advanceFilterRoute = require("./filter");
const advanceRecipesRoute = require("./recipes");

router.use("/cuisine", advanceCuisineRoute);
router.use("/diet", advanceDietRoute);
router.use("/type", advanceTypeRoute);
router.use("/filter", advanceFilterRoute);
router.use("/recipes/:id", advanceRecipesRoute);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/sign-in");
}

router.get("/", isLoggedIn, (req, res) => {
  res.send("Only logged in can come to /advanceSearch route");
});

module.exports = router;
