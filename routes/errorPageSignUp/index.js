const passport = require('passport');
const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('errorSignUp');
});

module.exports = router;