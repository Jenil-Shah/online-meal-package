const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
require('dotenv').config({path:"./config/keys.env"});
const db = require("./models/userDB")

const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

//load Controllers
const mealSectionController = require("./controller/mealSection");
const loginRoutesController = require("./controller/loginRoutes");

//mapping Controllers
app.use("/", mealSectionController);

app.use("/user", loginRoutesController);

const PORT = process.env.PORT || 3000;

db.initialize()
.then(() =>{
    app.listen(PORT,() =>{
        console.log(`Web page is Up and Running`);
    });
})
.catch((data) =>{
    console.log(data);
});