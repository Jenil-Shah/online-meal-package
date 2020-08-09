class topMealDB
{
    topMeal = [];

    constructor()
    {
        this.setTopMeal();
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

    getTopMeal()
    {
        return this.topMeal;
    }
}

module.exports = topMealDB;