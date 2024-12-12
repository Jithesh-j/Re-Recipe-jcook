const { MongoClient, ObjectId } = require("mongodb");

// Connect to MongoDB
const uri = "mongodb+srv://admin:test@re-recipe.2k4bl.mongodb.net/recipeSample?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function populateRecipes() {
    try {
        await client.connect();
        const db = client.db("recipeSample");
        const recipeCollection = db.collection("recipes");

        // Insert recipe documents, referencing the recipe contents using ObjectId for recipe_ID
        const recipe1 = {
            recipe_ID: new ObjectId("6741035b0a68f1169e0d8190"),  // recipe001 (ObjectId instead of string)
            recipe_name: "Classic Pancakes",
            meal_category: ["Breakfast"],
            recipe_versions: [
                new ObjectId("6741035b0a68f1169e0d8190")  // Reference to recipe content for recipe001 (ObjectId)
            ],
            image_url: "https://www.pamperedchef.com/iceberg/com/recipe/1307769-lg.jpg",
            is_visible: true
        };

        const recipe2 = {
            recipe_ID: new ObjectId("6741035b0a68f1169e0d8191"),  // recipe002 (ObjectId instead of string)
            recipe_name: "Spaghetti Bolognese",
            meal_category: ["Dinner"],
            recipe_versions: [
                new ObjectId("6741035b0a68f1169e0d8191")  // Reference to recipe content for recipe002 (ObjectId)
            ],
            image_url: "https://images.ctfassets.net/uexfe9h31g3m/6QtnhruEFi8qgEyYAICkyS/ab01e9b1da656f35dd1a721c810162a0/Spaghetti_bolognese_4x3_V2_LOW_RES.jpg",
            is_visible: true
        };

        const recipe3 = {
            recipe_ID: new ObjectId("6741035b0a68f1169e0d8192"),  // recipe003 (ObjectId instead of string)
            recipe_name: "Caesar Salad",
            meal_category: ["Salad"],
            recipe_versions: [
                new ObjectId("6741035b0a68f1169e0d8192")  // Reference to recipe content for recipe003 (ObjectId)
            ],
            image_url: "https://www.seriouseats.com/thmb/Fi_FEyVa3_-_uzfXh6OdLrzal2M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/the-best-caesar-salad-recipe-06-40e70f549ba2489db09355abd62f79a9.jpg",
            is_visible: true
        };

        const recipe4 = {
            recipe_ID: new ObjectId("6741035b0a68f1169e0d8193"),  // recipe004 (ObjectId instead of string)
            recipe_name: "Chicken Curry",
            meal_category: ["Dinner"],
            recipe_versions: [
                new ObjectId("6741035b0a68f1169e0d8193")  // Reference to recipe content for recipe004 (ObjectId)
            ],
            image_url: "https://www.kitchensanctuary.com/wp-content/uploads/2020/08/Easy-Chicken-Curry-square-FS-117.jpg",
            is_visible: true
        };

        const recipe5 = {
            recipe_ID: new ObjectId("6741035b0a68f1169e0d8194"),  // recipe005 (ObjectId instead of string)
            recipe_name: "Avocado Toast",
            meal_category: ["Breakfast"],
            recipe_versions: [
                new ObjectId("6741035b0a68f1169e0d8194")  // Reference to recipe content for recipe005 (ObjectId)
            ],
            image_url: "https://bonabbetit.com/wp-content/uploads/2022/07/Avocado-toast-with-farmers-cheese-and-bacon-bits.jpg",
            is_visible: true
        };

        const recipe6 = {
            recipe_ID: new ObjectId("6741035b0a68f1169e0d8195"),  // recipe006 (ObjectId instead of string)
            recipe_name: "Chocolate Chip Cookies",
            meal_category: ["Dessert"],
            recipe_versions: [
                new ObjectId("6741035b0a68f1169e0d8195")  // Reference to recipe content for recipe006 (ObjectId)
            ],
            image_url: "https://sallysbakingaddiction.com/wp-content/uploads/2013/05/classic-chocolate-chip-cookies.jpg",
            is_visible: true
        };

        const recipe7 = {
            recipe_ID: new ObjectId("6741035b0a68f1169e0d8196"),  // recipe007 (ObjectId instead of string)
            recipe_name: "Vegetable Stir Fry",
            meal_category: ["Lunch"],
            recipe_versions: [
                new ObjectId("6741035b0a68f1169e0d8196")  // Reference to recipe content for recipe007 (ObjectId)
            ],
            image_url: "https://www.allrecipes.com/thmb/MF7yU1MBbRlaT40ogVr-1PgggKc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/222658-frozen-vegetable-stir-fry-4x3-1382-583b53fa0bcd4247920611ad431c14cb.jpg",
            is_visible: true
        };

        // Insert into the 'recipes' collection
        await recipeCollection.insertMany([recipe1, recipe2, recipe3, recipe4, recipe5, recipe6, recipe7]);

        console.log("Recipes added.");
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

populateRecipes();
