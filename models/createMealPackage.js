const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let mealPackageSchema = new Schema({
    title: {
        type: String,
        unique: true
    },
    price: Number,
    synopsis: String,
    category: String,
    noOfMeals: Number,
    topPackage: Boolean,
    img:String
});

//local user template schema
let Packages;

module.exports.initialize = function(){
    return new Promise((resolve, reject)=>{

        let db = mongoose.createConnection(`${process.env.FIRST_MONGO_PASS}${process.env.PASS}${process.env.LAST_MONGO_PASS}`,{ useNewUrlParser: true, useUnifiedTopology: true });
        
        db.on('error', (err)=>{
            reject(err);
        });

        db.once('open', ()=>{
            console.log(`Database for Package is Up and Running`);

            //create a collection called mealpackages
            Packages = db.model("mealpackages", mealPackageSchema);
            
            resolve();
          });

    });
}

/* Add packages */
module.exports.addPackages = function(data){
    return new Promise((resolve,reject)=>{ 

        //see if it has been "checked"
        data.topPackage = (data.topPackage)? true: false;
        
        //add data
        var newPackage = new Packages(data);

        newPackage.save((err)=>{
            if (err){
                console.log("Woopsie there was an error: "+err);
                reject();
            }
            else{
                console.log("Saved that package: "+data.title);
                resolve();
            }
        });
    });
}

/* View Packages*/
module.exports.getPackages = function(){
    return new Promise((resolve,reject)=>{
        Packages.find() //gets all and returns an array
        .exec() 
        .then((returnedPackages)=>{
            resolve(returnedPackages.map(item=>item.toObject()));
        })
        .catch((err)=>{
                console.log("Error Retriving packages:"+err);
                reject(err);
        });
    });
}

/* Get package by its title */
module.exports.getPackageByTitle = function(inTitle){
    return new Promise((resolve,reject)=>{
        
        Packages.find({title: inTitle}) 
        .exec()
        .then((returnedPackage)=>{
            if(returnedPackage.length != 0)
                resolve(returnedPackage.map(item=>item.toObject()));

            else
                reject("No Package found");
        }).catch((err)=>{
                console.log("Error Retriving Package:"+err);
                reject(err);
        });
    });
}

/* Edit Packages */
module.exports.editPackage = (editData)=>{
    return new Promise((resolve, reject)=>{
        console.log(editData);
        editData.topPackage = (editData.topPackage)? true: false;
        
        Packages.updateOne(
        {title : editData.title}, 
        {$set: {  //what fields are we updating
            price: editData.price,
            synopsis: editData.synopsis,
            topPackage: editData.topPackage,
        }})
        .exec()
        .then(()=>{
            console.log(`Package: ${editData.title} has been updated`);
            resolve();
        }).catch((err)=>{
            reject(err);
        });
        
    });
}