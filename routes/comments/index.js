const express = require("express");
const db = require("../../database");
const moment = require('moment');

const router = express.Router();
router.use(express.json());

router.post("/", async (req, res)=>{
    console.log(req.body);
    let userID = req.body.userID
    let recipeID = req.body.recipeID
    let username = req.body.username
    let comment = req.body.text
    let time = moment().format('DD/MM/YYYY  h:mma')
    // console.log(time)

    await db.insert({
        user_id: userID,
        recipe_id: recipeID,
        username: username,
        comment: comment,
        time: time,
    }) 
    .into("comment")
    .then(()=>{
        // console.log('comment put into db successfully')
        let data = {"userID": userID, "recipeID": recipeID,"username": username, "comment": comment, "time": time}
        // console.log(data)
        res.send(data)
    })
})

router.post("/existing", async(req,res)=>{
    // console.log(req.body)
    let recipeID = req.body.recipeID
    // console.log(recipeID)

    let commentData = await db 
    .select ('*')
    .from ('comment')
    .where('recipe_id', '=', recipeID)
    .orderBy('time', 'desc')
    // console.log(commentData)
    res.send(commentData)
})
module.exports = router;