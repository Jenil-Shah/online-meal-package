const express = require('express');
const router = express.Router();

const topMealDB = require("../models/homeTop");

router.get("/",(req,res) => {

    const fakeDB = new topMealDB();
    res.render("home",{
        title:"Home",
        h1_quote:"Your Cuisine, Your Home.",
        h3_quote:"Get instantly delivered",
        data : fakeDB.getTopMeal()
    });
});

router.get("/mealsPackage",(req,res) => {

    const fakeDB = new topMealDB();
    res.render("mealsPackage",{
        title:"Meals Package",
        h1_quote:"Our Meal Packages",
        h3_quote:"Enjoy the Variety!!!",
        data : fakeDB.getPackages()
    });
});

module.exports = router;