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
        data : fakeDB.getTopMeal()
    });
});

app.get("/mealsPackage",(req,res) => {

    const fakeDB = new topMealDB();
    res.render("mealsPackage",{
        title:"Meals Package",
        data : fakeDB.getPackages()
    });
});

app.get("/registration",(req,res) => {
    res.render("registration",{
        title:"Sign up"
    });
});

app.get("/login",(req,res) => {
    res.render("login",{
        title:"Log In"
    });
});

const PORT = 3000;
app.listen(PORT,() =>{
    console.log(`Web page is Up and Running`);
});