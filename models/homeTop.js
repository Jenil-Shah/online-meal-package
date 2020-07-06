class topMealDB
{
    topMeal = [];
    packages = [];

    constructor()
    {
        this.setTopMeal();
        this.setPackages();
    }

    setTopMeal()
    {
        this.topMeal.push({
            imgName: "cscp.jpg",
            title: "Chicken Shawarma Classic",
            price: 12.75
        });
        
        this.topMeal.push({
            imgName: "ptc.jpg",
            title: "Pad Thai Cocktail",
            price: 13.48
        });

        this.topMeal.push({
            imgName: "pcsp.jpg",
            title: "Philly Cheese Stick Painini",
            price: 19
        });

        this.topMeal.push({
            imgName: "pastaalf.jpg",
            title: "Pasta Alfredo",
            price: 18.75
        });

        this.topMeal.push({
            imgName: "chickpal.jpg",
            title: "Chicken Parmigiana",
            price: 22.25
        });

        this.topMeal.push({
            imgName: "mariana.jpg",
            title: "Marinara Canestri",
            price: 15.55
        });

        this.topMeal.push({
            imgName: "veggielas.jpg",
            title: "Veggie Lasagna",
            price: 17.99
        });

        this.topMeal.push({
            imgName: "reat.jpg",
            title: "Rigatoni Al Bolognese",
            price: 18.35
        });
    }

    setPackages()
    {
        this.packages.push({
            imgName: "indianfood.jpg",
            title : "Classic Indian Cuisines",
            price : 159,
            category : "Indian",
            noOfMeals : 10,
            synopsis : "Includes variety of Tortillas, Curries & Rice dishes",
            topPackage : true
        });

        this.packages.push({
            imgName: "chinesefood.jpg",
            title : "Chings Chinese Cuisines",
            price : 142,
            category : "Chinese",
            noOfMeals : 12,
            synopsis : "Includes variety of Noodles, Sea Food & Momos",
            topPackage : true
        });

        this.packages.push({
            imgName: "americanfood.jpg",
            title : "Fast American Cuisines",
            price : 151,
            category : "American",
            noOfMeals : 20,
            synopsis : "Includes variety of Burgers, Poutines & Hotdogs",
            topPackage : true
        });

        this.packages.push({
            imgName: "desserts.jpg",
            title : "Yummy Desserts!",
            price : 109,
            category : "Desserts",
            noOfMeals : 7,
            synopsis : "Includes premium Desserts",
            topPackage : true
        });
    }

    getPackages()
    {
        return this.packages;
    }

    getTopMeal()
    {
        return this.topMeal;
    }
}

module.exports = topMealDB;