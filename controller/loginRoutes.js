const express = require('express');
const router = express.Router();
const path = require("path");
const multer = require("multer");

const db = require("../models/userDB");

const storage = multer.diskStorage({
    destination: "./public/img/userImages/",
    filename: function (req, file, cb) {
      //change the name of the file according to current timings miliseconds
      cb(null, Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        return cb(null, true);
    } else {
        return cb(new Error('Not an image! Please upload an image.', 400), false);
    }
};

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage, fileFilter: imageFilter });


  function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/");
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

router.post("/registration", upload.single("photo"), (req,res) => {
    
    const errors = [];
    const formFile = req.file;
    values =
        {
            firstName : req.body.fname,
            lastName : req.body.lname,
            email : req.body.email,
            password : req.body.password,
            photo : JSON.stringify(formFile)
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

    if(!values.photo)
    {
        errors.push({photoError:"*You must upload your image"});
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
        req.body.img = req.file.filename;
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
                    email : values.email,
                    photo : req.body.img
                }

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
                duplicateError:"*this email already exists",
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
                    email : inData[0].email,
                    photo : inData[0].img
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
                field:tempValues,
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

/* Clerk Dashboard */
router.get("/clerkDashBoard", ensureLogin, (req,res) => {
    res.render("clerkDashBoard",{
        title:"Dash Board",
        field:req.session.user
    });
});

/* Logout */
router.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("/user/login");
});

/* Error Handling for image upload */
router.use((err, req, res, next) =>{
    console.log(err.message);
    res.status(500).render("registration", {message:'Cannot upload non-images files!'});
});

module.exports = router;