const express = require("express");
const exphbs = require("express-handlebars");
const meal = require("./models/homeTop");
const topMealDB = require("./models/homeTop");
const bodyParser = require('body-parser');

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));

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
        h1_quote:"Create Your Account",
        h3_quote:"Get chance to win our Gift Card"
    });
});

app.get("/login",(req,res) => {
    res.render("login",{
        title:"Log In",
        h1_quote:"Visit our Meal Packages",
        h3_quote:"Enjoy the Variety!!!"
    });
});

app.get("/dashBoard",(req,res) => {
    res.render("dashBoard",{
        title:"Dash Board"
    });
});

app.post("/registration",(req,res) => {

    const errors = [];
    const values =
        {
            firstName : req.body.Fname,
            lastName : req.body.Lname,
            email : req.body.Email,
            password : req.body.Password
        }


    if(values.firstName=="")
    {
        errors.push({first:"*You must enter first name"});
    }

    if(values.lastName=="")
    {
        errors.push({last:"*You must enter last name"});
    }

    if(values.email=="")
    {
        errors.push({email:"*You must enter email"});
    }

    if(values.password=="")
    {
        errors.push({password:"*You must enter password"});
    }

    if(values.password.length < 6 || values.password.length > 12)
    {
        errors.push({password:"*must enter password between 6 and 12 characters"});
    }
    
    const regex = /[^A-Za-z0-9]/g;

    if(values.password.match(regex))
    {
        errors.push({password:"*password should only contain alphabets and numbers"});
    }


    if(errors.length > 0)
    {
        res.render("registration",{
            title:"Sign up",
            h1_quote:"Create Your Account",
            h3_quote:"Get chance to win our Gift Card",
            errorMessages:errors,
            field:values
        });
    }

    else
    {
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey("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");
        const msg = {
        to: `jenilshah757@gmail.com`,
        from: `${values.email}`,
        subject: 'Welcome to Masterchef J.',
        html: 
        `<strong>Hi! <i>${values.firstName} ${values.lastName}</i>,</strong><br>
        <p>Welcome to <strong>Masterchef J. Community</strong></p>
        <p>You have been added as a user member and you are welcome to use our services and edit your profile on DashBoard</p>
        <p><i>Don't Waste your time and order your favourite cuisines and satisfy your hungry belly</i></p>
        <i>Thank You for joining Masterchef J.</i><br><br>
        <strong>Best Regards,</strong><br>
        <strong>Masterchef J.</strong>
        `,
        };
        sgMail.send(msg)
        .then(()=>{
            res.redirect("/dashBoard");
        })
        .catch(err=>{
            console.log(`Error: ${err}`);
        });
    }

});

app.post("/login",(req,res) => {

    const errors = [];
    const values =
    {
        email : req.body.EmailLog,
        password : req.body.PasswordLog
    }

    if(values.email=="")
    {
        errors.push({email:"*you must enter email"});
    }

    if(values.password=="")
    {
        errors.push({password:"*you must enter password"});
    }

    if(errors.length > 0)
    {
        res.render("login",{
            title:"Log In",
            h1_quote:"Visit our Meal Packages",
            h3_quote:"Enjoy the Variety!!!",
            errorMessages:errors,
            field:values
        });
    }

    else
    {
        res.redirect("/");
    }

});

const PORT = 3000;
app.listen(PORT,() =>{
    console.log(`Web page is Up and Running`);
});