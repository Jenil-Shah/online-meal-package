const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    fname: String,
    lname: String,
    password: String,
    img: String
});

//local user template schema
let Users;

module.exports.initialize = function(){
    return new Promise((resolve, reject)=>{

        let db = mongoose.createConnection(`${process.env.FIRST_MONGO_PASS}${process.env.PASS}${process.env.LAST_MONGO_PASS}`,{ useNewUrlParser: true, useUnifiedTopology: true });
        
        db.on('error', (err)=>{
            reject(err);
        });

        db.once('open', ()=>{
            console.log(`Database is Up and Running`);

            //create a collection called registeredusers
            //use the above schemas for their layout
            Users = db.model("registeredusers", userSchema);
            
            resolve();
          });

    });
}

module.exports.addUsers = function(data){
    return new Promise((resolve,reject)=>{

        //add data
        let newUser = new Users(data);

        //encrypt the password
        bcrypt.genSalt(10)
        .then(salt=>bcrypt.hash(newUser.password,salt))
        .then(hash=>{
            // Store the resulting "hash" value in the DB
            newUser.password=hash;

            //save the entry of the User
            newUser.save((err)=>{
                if (err){
                    console.log("Woopsie there was an error: "+err);
                    reject(err);
                }
                else{
                    console.log("Saved that User: "+data.email);
                    resolve();
                }
            });
        })
        .catch(err=>{
            console.log(err);
            reject("Hashing Error");
        });

    });
}

module.exports.getUserByEmail = function(inEmail){
    return new Promise((resolve,reject)=>{
        //gets an registerd email
        Users.find({email: inEmail}) 
        .exec()
        .then((returnedUser)=>{
            if(returnedUser.length != 0)
                resolve(returnedUser.map(item=>item.toObject()));

            else
                reject("No User found");
        }).catch((err)=>{
                console.log("Error Retriving user:"+err);
                reject(err);
        });
    });
}

//check the authenticacy of the user 
module.exports.validateUser = (data)=>{
    return new Promise((resolve,reject)=>{
    if (data){
        this.getUserByEmail(data.email).then((retUser)=>{
            //get the data and check if passwords match hash
                bcrypt.compare(data.password, retUser[0].password).then((result) => {
                    if (result){
                        resolve(retUser);
                    }
                    else{
                        reject("password don't match");
                    }
                });
        }).catch((err)=>{
            reject(err);
        });
    }
    });
    
}