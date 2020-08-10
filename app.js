const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
const clientSessions = require("client-sessions");
require('dotenv').config({path:"./config/keys.env"});
const db = require("./models/userDB");
const mealDB = require("./models/createMealPackage");
const cart = require("./models/cart");

const app = express();

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: true }));

//setup body parser to recieve json text from AJAX calls 
app.use(bodyParser.json());

app.use(express.static("public"));

//setup client Session
app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "masterchefj_userSession", //Secret String
    duration: 38 * 60 * 1000, //duration of the session in milliseconds (38 minutes)
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

//Route to Package Product to add product to the cart
app.get("/listingProduct", ensureLogin, (req,res) =>{
    mealDB.getPackageByTitle(req.query.item)
    .then((inData) =>{
        console.log(inData[0]);
        res.render("packageProduct",{
            layout:false,
            field:inData[0]
        });
    })
})

//AJAX route to add a product. Replies back with number of items in cart
app.post("/addProduct", (req,res)=>{
    console.log("Adding prod with name: "+req.body.name);
    mealDB.getPackageByTitle(req.body.name)
    .then((item)=>{
        cart.addItem(item[0])
        .then((numItems)=>{
            res.json({data: numItems});
        }).catch(()=>{
            res.json({message:"error adding"});
        })
    }).catch(()=>{
        res.json({message: "No Items found"})
    })
});

//Route to see cart and items
app.get("/cart", ensureLogin,(req,res)=>{
    let cartData = {
        cart:[],
        total:0
    } ;
    cart.getCart().then((items)=>{
        cartData.cart = items;
        cart.checkout().then((total)=>{
            cartData.total = total;
            res.render("checkout", {data:cartData, layout:false});
        }).catch((err)=>{
            res.send("There was an error getting total: " +err);
        });
    })
    .catch((err)=>{
        res.send("There was an error: " + err );
    });
});


//AJAX route to remove item by name. Replies back with total and list of items. 
app.post("/removeItem", (req,res)=>{ 
    let cartData = {
        cart:[],
        total:0
    } ;
    cart.removeItem(req.body.name).then(cart.checkout)
    .then((inTotal)=>{
        cartData.total = inTotal;
        cart.getCart().then((items)=>{
           cartData.cart = items; 
           console.log("catData length: ",cartData.length);
           res.json({data: cartData});
        }).catch((err)=>{res.json({error:err});});
    }).catch((err)=>{
        res.json({error:err});
    })
});

app.get("/finalCheckout", ensureLogin, (req,res) =>{
    let cartData = {
        cart:[],
        total:0
    } ;

    cart.getCart()
    .then((items) =>{
        cartData.cart = items;
        cart.checkout().then((total) =>{
            cartData.total = total;

            console.log("Cart List :",cartData);
            console.log("Total: ",total);
            console.log("User Session", req.session.user);

            //List the items method
            let htmlStr ="";
            (cartData.cart).forEach(x=>{ 
                htmlStr += '<div class="row">';
                htmlStr += '<div class="col-md-4">';
                htmlStr += '<h3> <h2>Package: </h2>'+x.title+'</h3></div>';
                htmlStr += '<div class="col-md-4">';
                htmlStr += ' <h4><h2>Price: </h2>$'+x.price+'</h4>';
                htmlStr += '</div><div class="col-md-4">';
                htmlStr += '</div></div><hr>';   
            });
            //Email the list of orders
            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
            const msg = {
            to: `${req.session.user.email}`,
            from: `jenilshah757@gmail.com`,
            subject: 'Checkout Order from Masterchef J.',
            html: 
            `<strong>Hi! <i>${req.session.user.firstName} ${req.session.user.lastName}</i>,</strong><br>
            <p>Here is your checkout order from <strong>Masterchef J.</strong></p>
            <div class="container">
                <div class="row"><h1>My Cart</h1></div>
                <div class="row">
                <div class="col-md-4"></div>
                <div class="col-md-4"></div>
                <div class="col-md-4">
                    <h2 class="total" style="color: red;">Total: $${cartData.total}</h2>
                </div>
            </div>
            <div>${htmlStr}</div>
            <i>Thank You for ordering from Masterchef J.</i><br><br>
            <strong>Best Regards,</strong><br>
            <strong>Masterchef J.</strong>
            `,
            };
            sgMail.send(msg)
            .then(() =>{
                cart.emptyCart()
                .then(() =>{
                    res.redirect("/");
                })
                .catch((err) =>{
                    console.log(err);
                });
            })
            .catch((err) =>{
                console.log(err);
            });
        })
        .catch((err) =>{
            console.log(err);
        });
    })
    .catch((err) =>{
        console.log(err);
    });
});

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