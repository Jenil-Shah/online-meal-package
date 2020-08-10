//start off with the cart empty. 
let userCart = [];

//adds a item from systems to the cart
module.exports.addItem = (inItem)=>{
    console.log("Adding cart" + inItem.title);
    return new Promise((resolve,reject)=>{
        userCart.push(inItem);
        resolve(userCart.length);
    });
}

//removes an item from the cart
module.exports.removeItem = (inItem)=>{
    return new Promise((resolve,reject)=>{
        for(let i = 0; i< userCart.length; i++){
            if(userCart[i].title == inItem){
                userCart.splice(i,1);
                i = userCart.length;
            }
        }
        resolve();
    });
}

//returns the cart array and all items
module.exports.getCart = ()=>{
    return new Promise((resolve, reject)=>{
            resolve(userCart);
    });
}

//calculates the price of all items in the cart
module.exports.checkout = ()=>{
    return new Promise((resolve, reject)=>{
        let price=0;//if check if cart is empty
        if(userCart){
            userCart.forEach(x => {
                price += x.price;
            });
        }
        resolve(price);
    });
}

//Empty the cart when checkout is performed
module.exports.emptyCart = ()=>{
    return new Promise((resolve,reject) =>{
        userCart=[];
        resolve();
    });
}