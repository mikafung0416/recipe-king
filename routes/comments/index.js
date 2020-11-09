const express = require("express");
const db = require("../../database");

const router = express.Router();
router.use(express.json());

router.post("/", async (req, res)=>{
    console.log(req.body);
    let userID = req.body.userID
    let recipeID = req.body.recipeID
    let username = req.body.username
    let comment = req.body.text
    console.log(userID)

    await db.insert({
        user_id: userID,
        recipe_id: recipeID,
        username: username,
        comment: comment,
    }) 
    .into("comment")
    .then(()=>{
        // console.log('comment put into db successfully')
        let data = {"userID": userID, "recipeID": recipeID,"username": username, "comment": comment}
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
    // console.log(commentData)
    res.send(commentData)
})
module.exports = router;