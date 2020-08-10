const express = require('express');
const router = express.Router();

const multer = require("multer");

const topMealDB = require("../models/homeTop");
const mealDB = require("../models/createMealPackage");

function ensureLogin(req, res, next) 
{
    if (!req.session.user) {
      res.redirect("/user/login");
    } else {
      next();
    }
}

/* Home */
router.get("/",(req,res) => {

    const fakeDB = new topMealDB();
    mealDB.getPackages()
    .then((inData) =>{
        res.render("home",{
            title:"Home",
            h1_quote:"Your Cuisine, Your Home.",
            h3_quote:"Get instantly delivered",
            data : fakeDB.getTopMeal(),
            dataPackage : inData
        });
    })
    .catch((err) =>{
        console.log(err);
    });
});

/* Meal Package Listing */
router.get("/mealsPackage",(req,res) => {

    mealDB.getPackages()
    .then((inData) =>{
        res.render("mealsPackage",{
            title:"Meals Package",
            h1_quote:"Our Meal Packages",
            h3_quote:"Enjoy the Variety!!!",
            data : inData
        });
    })
    .catch((err) =>{
        console.log(err);
    });
});

/* Add Meal Package */
router.get("/addPackage", ensureLogin, (req,res) =>{
    res.render("addMealPackage",{
        title:"Create Package",
        h1_quote:"Create Your Account",
        h3_quote:"Get chance to win our Gift Card"
    });
});

router.post("/addPackage", (req,res) => {
    
    const errors = [];
    const values =
        {
            title : req.body.title,
            price : req.body.price,
            synopsis : req.body.synopsis,
            category : req.body.category,
            noOfMeals : req.body.noOfMeals,
            img : req.body.img
        }


    if(values.title=="")
    {
        errors.push({titleErr:"*You must enter title of the package"});
    }

    if(values.price==0)
    {
        errors.push({priceErr:"*You must enter price"});
    }

    if(values.price<0)
    {
        errors.push({priceErr:"*price must be positive number"});
    }

    if(values.synopsis=="")
    {
        errors.push({synopsisErr:"*You must enter description of package"});
    }

    if(values.category=="")
    {
        errors.push({categoryErr:"*You must enter category of package"});
    }

    if(values.noOfMeals==0)
    {
        errors.push({noOfMealsErr:"*You must enter number of pacakages"});
    }

    if(values.noOfMeals<0)
    {
        errors.push({noOfMealsErr:"*Number of pacakages must be positive"});
    }

    if(values.img=="")
    {
        errors.push({imgErr:"*You must enter package image URL"});
    }

    if(errors.length > 0)
    {
        res.render("addMealPackage",{
            title:"Create Package",
            h1_quote:"Create Your Account",
            h3_quote:"Get chance to win our Gift Card",
            errorMessages:errors,
            field:values
        });
    }

    else
    {
        mealDB.addPackages(req.body)
        .then(() =>{
            res.redirect("/user/clerkDashBoard");
        })
        .catch((err) =>{
            console.log(`Error: ${err}`);

            res.render("addMealPackage",{
                title:"Add Package",
                h1_quote:"Create Your Account",
                h3_quote:"Get chance to win our Gift Card",
                duplicateError:"*two packages cannot have same title",
                field:values
            });
        });
        
    }
});

/* View meal Packages */
router.get("/viewPackages",ensureLogin, (req,res) =>{
    mealDB.getPackages()
    .then((inData) =>{
        if(inData.length==0)
            res.render("viewMealPackages",{
                title:"View Packages",
                h1_quote:"Create Your Account",
                h3_quote:"Get chance to win our Gift Card",
                noData:"There are no Packages in Database"
            });
        else
            res.render("viewMealPackages",{
                title:"View Packages",
                h1_quote:"Create Your Account",
                h3_quote:"Get chance to win our Gift Card",
                data:inData
            });
    })
    .catch((err) =>{
        console.log(err);
    });
});

/* Edit Meal Packages */
router.get("/editPackage",ensureLogin, (req,res) =>{
    if(req.query.title)
    {

        mealDB.getPackageByTitle(req.query.title)
        .then((inData) =>{
            console.log(inData[0]);
            res.render("editMealPackage",{
                title:"Edit Package",
                h1_quote:"Create Your Account",
                h3_quote:"Get chance to win our Gift Card",
                field:inData[0]
            });
        })
        .catch((err) =>{
            console.log(err);
        });
    }

    else
    {
        console.log("No query found");
        res.redirect("/viewMealPackages");
    }   
});

router.post("/editPackage",(req,res) =>{

    const errors = [];
    const values =
        {
            price : req.body.price,
            synopsis : req.body.synopsis,
        }

        if(values.price==0)
        {
            errors.push({priceErr:"*You must enter price"});
        }
    
        if(values.price<0)
        {
            errors.push({priceErr:"*price must be positive number"});
        }
    
        if(values.synopsis=="")
        {
            errors.push({synopsisErr:"*You must enter description of package"});
        }

        if(errors.length > 0)
        {
            res.render("editMealPackage",{
                title:"Edit Package",
                h1_quote:"Create Your Account",
                h3_quote:"Get chance to win our Gift Card",
                errorMessages:errors,
                field:values
            });
        }

        else
        {
            mealDB.editPackage(req.body)
            .then(() =>{
                console.log("Package Edited");
                res.redirect("/viewPackages");
            })
            .catch((err) =>{
                console.log(err);
            });
        }
});

module.exports = router;