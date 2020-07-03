const express = require("express");
const exphbs = require("express-handlebars");
const meal = require("./models/homeTop");
const topMealDB = require("./models/homeTop");

const app = express();

app.use(express.static("public"));

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.get("/",(req,res) => {

    const fakeDB = new topMealDB();
    res.render("home",{
        title:"Home",
        h1_quote:"Your Cuisine, Your Home.",
        h3_quote:"Get instantly delivered",
        data : fakeDB.getTopMeal()
    });
});

app.get("/mealsPackage",(req,res) => {

    const fakeDB = new topMealDB();
    res.render("mealsPackage",{
        title:"Meals Package",
        h1_quote:"Our Meal Packages",
        h3_quote:"Enjoy the Variety!!!",
        data : fakeDB.getPackages()
    });
});

app.get("/registration",(req,res) => {
    res.render("registration",{
        title:"Sign up",
        h1_quote:"Ceate Your Account",
        h3_quote:"Get chance to win our Gift Card"
    });
});

app.get("/login",(req,res) => {
    res.render("login",{
        title:"Log In",
        h1_quote:"Visit our Meal Package Section",
        h3_quote:"Enjoy the Variety!!!"
    });
});

const PORT = 3000;
app.listen(PORT,() =>{
    console.log(`Web page is Up and Running`);
});