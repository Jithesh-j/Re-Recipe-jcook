const { MongoClient, ObjectId } = require("mongodb");

// Connect to MongoDB
const uri = "mongodb+srv://admin:test@re-recipe.2k4bl.mongodb.net/recipeSample?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function populateRecipeContents() {
    try {
        await client.connect();
        const db = client.db("recipeSample");
        const recipeContentsCollection = db.collection("recipe_contents");

        // Insert content documents for recipe versions
        const content1 = {
            recipe_ID: new ObjectId("6741035b0a68f1169e0d8190"),  // recipe001
            cooking_duration: 15,
            version_number: 1,
            serving_size: 1,
            ingredients: [
                { name: "Flour", quantity: 1, unit: "cup" },
                { name: "Milk", quantity: 1, unit: "cup" },
                { name: "Eggs", quantity: 2, unit: "each" },
                { name: "Baking Powder", quantity: 1, unit: "tbsp" },
                { name: "Salt", quantity: 0.5, unit: "tsp" },
            ],
            directions: [
                { step: "Mix dry ingredients together." },
                { step: "Add wet ingredients and stir until smooth." },
                { step: "Pour batter onto hot griddle and cook until golden brown." },
            ],
            notes: "Optional notes for this version"
        };

        const content2 = {
            recipe_ID: new ObjectId("6741035b0a68f1169e0d8191"),  // recipe002
            cooking_duration: 40,
            version_number: 0,
            serving_size: 2,
            ingredients: [
                { name: "Spaghetti", quantity: 200, unit: "g" },
                { name: "Ground Beef", quantity: 0.5, unit: "lb" },
                { name: "Tomato Sauce", quantity: 1.5, unit: "cup" },
                { name: "Onion", quantity: 1, unit: "each" },
                { name: "Garlic", quantity: 1, unit: "clove" },
            ],
            directions: [
                { step: "Cook spaghetti according to package instructions." },
                { step: "Brown ground beef and drain excess fat." },
                { step: "Add onion and garlic, and cook until softened." },
                { step: "Stir in tomato sauce and simmer for 10 minutes." },
                { step: "Serve sauce over spaghetti." },
            ],
            notes: "This is a basic spaghetti bolognese recipe."
        };

        const content3 = {
            recipe_ID: new ObjectId("6741035b0a68f1169e0d8192"),  // recipe003
            cooking_duration: 10,
            version_number: 1,
            serving_size: 1,
            ingredients: [
                { name: "Romaine Lettuce", quantity: 1, unit: "head" },
                { name: "Caesar Dressing", quantity: 0.25, unit: "cup" },
                { name: "Croutons", quantity: 0.5, unit: "cup" },
                { name: "Parmesan Cheese", quantity: 0.25, unit: "cup" },
            ],
            directions: [
                { step: "Chop romaine lettuce and place in a large bowl." },
                { step: "Add Caesar dressing and toss to coat evenly." },
                { step: "Top with croutons and grated Parmesan cheese." },
            ],
            notes: "Classic Caesar Salad recipe."
        };

        const content4 = {
            recipe_ID: new ObjectId("6741035b0a68f1169e0d8193"),  // recipe004
            cooking_duration: 30,
            version_number: 0,
            serving_size: 2,
            ingredients: [
                { name: "Chicken Breast", quantity: 1, unit: "lb" },
                { name: "Coconut Milk", quantity: 1, unit: "cup" },
                { name: "Curry Powder", quantity: 2, unit: "tbsp" },
                { name: "Onion", quantity: 1, unit: "each" },
                { name: "Garlic", quantity: 2, unit: "cloves" },
            ],
            directions: [
                { step: "Heat oil in a pan and cook onions until softened." },
                { step: "Add garlic and curry powder, cooking until fragrant." },
                { step: "Add chicken and cook until browned." },
                { step: "Stir in coconut milk and simmer for 20 minutes." },
            ],
            notes: "Simple Chicken Curry recipe."
        };

        const content5 = {
            recipe_ID: new ObjectId("6741035b0a68f1169e0d8194"),  // recipe005
            cooking_duration: 10,
            version_number: 0,
            serving_size: 1,
            ingredients: [
                { name: "Bread", quantity: 1, unit: "slice" },
                { name: "Avocado", quantity: 1, unit: "each" },
                { name: "Salt", quantity: 0.25, unit: "tsp" },
                { name: "Pepper", quantity: 0.25, unit: "tsp" },
                { name: "Lemon Juice", quantity: 0.5, unit: "tsp" },
            ],
            directions: [
                { step: "Toast bread slices to desired crispness." },
                { step: "Mash avocado with salt, pepper, and lemon juice." },
                { step: "Spread avocado mixture on toasted bread." },
            ],
            notes: "Quick and easy Avocado Toast."
        };

        // New recipe contents
        const content6 = {
            recipe_ID: new ObjectId("6741035b0a68f1169e0d8195"),  // recipe006
            cooking_duration: 25,
            version_number: 0,
            serving_size: 24,
            ingredients: [
                { name: "Butter", quantity: 1, unit: "cup" },
                { name: "Sugar", quantity: 0.75, unit: "cup" },
                { name: "Brown Sugar", quantity: 0.75, unit: "cup" },
                { name: "Eggs", quantity: 2, unit: "each" },
                { name: "Flour", quantity: 2.25, unit: "cup" },
                { name: "Chocolate Chips", quantity: 2, unit: "cup" },
            ],
            directions: [
                { step: "Preheat oven to 350°F (175°C)." },
                { step: "Cream together butter and sugars." },
                { step: "Beat in eggs one at a time." },
                { step: "Mix in flour, then fold in chocolate chips." },
                { step: "Drop dough by spoonfuls onto baking sheet and bake for 10-12 minutes." },
            ],
            notes: "Classic chocolate chip cookie recipe."
        };

        const content7 = {
            recipe_ID: new ObjectId("6741035b0a68f1169e0d8196"),  // recipe007
            cooking_duration: 15,
            version_number: 0,
            serving_size: 2,
            ingredients: [
                { name: "Broccoli", quantity: 1, unit: "cup" },
                { name: "Carrot", quantity: 1, unit: "each" },
                { name: "Bell Pepper", quantity: 1, unit: "each" },
                { name: "Soy Sauce", quantity: 2, unit: "tbsp" },
                { name: "Olive Oil", quantity: 1, unit: "tbsp" },
            ],
            directions: [
                { step: "Heat olive oil in a wok over medium heat." },
                { step: "Add vegetables and stir fry until tender-crisp." },
                { step: "Add soy sauce and stir well before serving." },
            ],
            notes: "Vegetable stir fry with soy sauce."
        };

        // Insert into the 'recipe_contents' collection
        await recipeContentsCollection.insertMany([content1, content2, content3, content4, content5, content6, content7]);

        console.log("Recipe contents added.");
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

populateRecipeContents();
