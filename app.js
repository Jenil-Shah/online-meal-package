const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
const clientSessions = require("client-sessions");
require('dotenv').config({path:"./config/keys.env"});
const db = require("./models/userDB");
const mealDB = require("./models/createMealPackage");

const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

//setup client Session
app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "masterchefj_userSession", //Secret String
    duration: 19 * 60 * 1000, //duration of the session in milliseconds (19 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/user/login");
    } else {
      next();
    }
  }

//load Controllers
const mealSectionController = require("./controller/mealSection");
const loginRoutesController = require("./controller/loginRoutes");

//mapping Controllers
app.use("/", mealSectionController);

app.use("/user", loginRoutesController);

const PORT = process.env.PORT || 3000;

mealDB.initialize()
.then(() =>{
    db.initialize()
    .then(() =>{
        app.listen(PORT,() =>{
            console.log(`Web page is Up and Running`);
        });
    })
    .catch((data) =>{
        console.log(data);
    });
})
.catch((data) =>{
    console.log(data);
});