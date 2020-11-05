const express = require("express");
const cuisineList = require("../../queryList/cuisineList");
const dietList = require("../../queryList/dietList");
const typeList = require("../../queryList/typeList");
const db = require("../../database");
// const { route } = require("../diet");

const router = express.Router(); 

router.post("/", async(req,res)=>{
    //getting the id from the hidden input
    let id = req.body.idName
    
    //getting the recipe from the database
    let recipeDetails = await db
     .select('*')
     .from('recipes')
     .where('recipe_id', '=', id)
     console.log(recipeDetails)

    //finding paths in db to render to page
     let recipeName = recipeDetails[0].recipe_name
     let recipeImage = recipeDetails[0].recipe_image
     
    //  let 
     console.log(recipeName)
    


     res.render('recipeDisplay',{
        recipeName: recipeName,
        recipeImage: recipeImage
     })
})

module.exports = router;