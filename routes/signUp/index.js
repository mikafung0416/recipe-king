const passport = require('passport');
const express = require("express");
const router = express.Router();

const cuisineList = require("../../queryList/cuisineList");
const dietList = require("../../queryList/dietList");
const typeList = require("../../queryList/typeList");

router.get('/', (req, res) => {
    res.render("signUp", {
        cuisineList: cuisineList,
        dietList: dietList
    });
});

router.post('/', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/error'
}));

module.exports = router;