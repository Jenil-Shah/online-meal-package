const express = require('express');
const router = express.Router();
const clientSessions = require("client-sessions");

const db = require("../models/userDB");

//setup client Session
router.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "masterchefj_userSession", //Secret String
    duration: 2 * 60 * 1000, //duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
  }));

  function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/user/login");
    } else {
      next();
    }
  }

let values;

/* Registration */
router.get("/registration",(req,res) => {
    res.render("registration",{
        title:"Sign up",
        h1_quote:"Create Your Account",
        h3_quote:"Get chance to win our Gift Card"
    });
});

router.post("/registration",(req,res) => {
    
    const errors = [];
    values =
        {
            firstName : req.body.fname,
            lastName : req.body.lname,
            email : req.body.email,
            password : req.body.password,
            isDataClerk : req.body.dataClerk
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

    const emailregex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if(!values.email.match(emailregex))
    {
        errors.push({email:"*Enter valid format of email"});
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
        db.addUsers(req.body)
        .then(() =>{
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
            const msg = {
            to: `${values.email}`,
            from: `jenilshah757@gmail.com`,
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

                req.session.user = {
                    firstName : values.firstName,
                    lastName : values.lastName,
                    email : values.email
                }

                if(values.isDataClerk)
                {
                    res.redirect("/user/clerkDashBoard");
                }
                else
                    res.redirect("/user/dashBoard");
            })
            .catch(err=>{
                console.log(`Error: ${err}`);
            });
        })
        .catch((err) =>{
            console.log(`Error: ${err}`);

            res.render("registration",{
                title:"Sign up",
                h1_quote:"Create Your Account",
                h3_quote:"Get chance to win our Gift Card",
                duplicateError:"this email already exists",
                field:values
            });
        });
        
    }
});


/* Login */
router.get("/login",(req,res) => {
    res.render("login",{
        title:"Log In",
        h1_quote:"Visit our Meal Packages",
        h3_quote:"Enjoy the Variety!!!"
    });
});

router.post("/login",(req,res) => {

    const errors = [];
    const tempValues =
    {
        email : req.body.email,
        password : req.body.password
    }

    if(tempValues.email=="")
    {
        errors.push({email:"*you must enter email"});
    }

    if(tempValues.password=="")
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
            field:tempValues
        });
    }

    else
    {
        db.validateUser(req.body)
        .then((inData) =>{
            console.log(inData[0]);

            req.session.user =
                {
                    firstName : inData[0].fname,
                    lastName : inData[0].lname,
                    email : inData[0].email
                }

            if(inData[0].dataClerk)
                res.redirect("/user/clerkDashBoard");
            else
                res.redirect("/user/dashBoard");
        })
        .catch((message)=>{
            console.log(message);
            res.render("login",{
                title:"Log In",
                h1_quote:"Visit our Meal Packages",
                h3_quote:"Enjoy the Variety!!!",
                authenticationError:"*Your Email or Password is incorrect"
            });
          });
    }

});

/* Dash Board */
router.get("/dashBoard", ensureLogin, (req,res) => {
    res.render("dashBoard",{
        title:"Dash Board",
        field:req.session.user
    });
});

router.get("/clerkDashBoard", ensureLogin, (req,res) => {
    res.render("clerkDashBoard",{
        title:"Dash Board",
        field:req.session.user
    });
});

router.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("/user/login");
  });

module.exports = router;