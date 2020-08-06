const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let userSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    fname: String,
    lname: String,
    password: String,
    dataClerk: Boolean
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
        //prep the incoming data

        //see if it has been "checked"
        data.dataClerk = (data.dataClerk)? true: false;

        //add data
        let newUser = new Users(data);

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
    });
}