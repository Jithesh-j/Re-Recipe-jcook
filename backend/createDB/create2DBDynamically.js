const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const uri = "mongodb+srv://admin:test@re-recipe.2k4bl.mongodb.net/recipeSample?retryWrites=true&w=majority";

async function populateDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    const recipeContentsCollection = mongoose.connection.collection("recipe_contents2");
    const discoverCollection = mongoose.connection.collection("discover2");

    // Clear existing data
    console.log("Clearing existing data...");
    await recipeContentsCollection.deleteMany({});
    await discoverCollection.deleteMany({});

    // Define `recipe_contents2` data
    const recipeContentsData = [
      {
        _id: new ObjectId(),
        user_ID: "user001",
        recipe_ID: undefined,
        version_number: 1,
        cooking_duration: 15,
        serving_size: 1,
        ingredients: [
          { name: "Flour", quantity: 1, unit: "cup" },
          { name: "Milk", quantity: 1, unit: "cup" },
          { name: "Eggs", quantity: 2, unit: "each" },
        ],
        directions: [
          { step: "Mix dry ingredients together." },
          { step: "Add wet ingredients and stir until smooth." },
          { step: "Cook on a hot griddle until golden brown." },
        ],
        notes: "Classic pancake recipe."
      },
      {
        _id: new ObjectId(),
        user_ID: "user002",
        recipe_ID: undefined,
        version_number: 1,
        cooking_duration: 40,
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
        notes: "Basic spaghetti bolognese recipe."
      },
      {
        _id: new ObjectId(),
        user_ID: "user003",
        recipe_ID: undefined,
        version_number: 1,
        cooking_duration: 10,
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
        notes: "Classic Caesar salad recipe."
      },
      {
        _id: new ObjectId(),
        user_ID: "user004",
        recipe_ID: undefined,
        version_number: 1,
        cooking_duration: 30,
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
      },
      {
        _id: new ObjectId(),
        user_ID: "user005",
        recipe_ID: undefined,
        version_number: 1,
        cooking_duration: 10,
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
      },
      {
        _id: new ObjectId(),
        user_ID: "user006",
        recipe_ID: undefined,
        version_number: 1,
        cooking_duration: 25,
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
      },
      {
        _id: new ObjectId(),
        user_ID: "user007",
        recipe_ID: undefined,
        version_number: 1,
        cooking_duration: 15,
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
      },
    ];

    // Sync `recipe_ID` with `_id`
    recipeContentsData.forEach((doc) => {
      doc.recipe_ID = doc._id;
    });

    // Insert into `recipe_contents2`
    const insertedRecipeContents = await recipeContentsCollection.insertMany(recipeContentsData);
    console.log("Inserted into `recipe_contents2`:", insertedRecipeContents.insertedCount);

    // Define `discover2` data
    const discoverData = recipeContentsData.map((recipe, index) => ({
      user_ID: recipe.user_ID,
      recipe_ID: recipe._id,
      recipe_name: [
        "Classic Pancakes",
        "Spaghetti Bolognese",
        "Caesar Salad",
        "Chicken Curry",
        "Avocado Toast",
        "Chocolate Chip Cookies",
        "Vegetable Stir Fry",
      ][index],
      meal_category: [
        "Breakfast",
        "Dinner",
        "Salad",
        "Dinner",
        "Breakfast",
        "Dessert",
        "Lunch",
      ][index],
      recipe_versions: [recipe._id],
      image_url: [
        "https://www.pamperedchef.com/iceberg/com/recipe/1307769-lg.jpg",
        "https://images.ctfassets.net/uexfe9h31g3m/6QtnhruEFi8qgEyYAICkyS/ab01e9b1da656f35dd1a721c810162a0/Spaghetti_bolognese_4x3_V2_LOW_RES.jpg",
        "https://www.seriouseats.com/thmb/Fi_FEyVa3_-_uzfXh6OdLrzal2M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/the-best-caesar-salad-recipe-06-40e70f549ba2489db09355abd62f79a9.jpg",
        "https://www.kitchensanctuary.com/wp-content/uploads/2020/08/Easy-Chicken-Curry-square-FS-117.jpg",
        "https://bonabbetit.com/wp-content/uploads/2022/07/Avocado-toast-with-farmers-cheese-and-bacon-bits.jpg",
        "https://sallysbakingaddiction.com/wp-content/uploads/2013/05/classic-chocolate-chip-cookies.jpg",
        "https://www.allrecipes.com/thmb/MF7yU1MBbRlaT40ogVr-1PgggKc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/222658-frozen-vegetable-stir-fry-4x3-1382-583b53fa0bcd4247920611ad431c14cb.jpg"
      ][index],
      is_visible: true,
      modified_flag: false,
    }));

    // Insert into `discover2`
    const insertedDiscover = await discoverCollection.insertMany(discoverData);
    console.log("Inserted into `discover2`:", insertedDiscover.insertedCount);

    console.log("Database populated successfully.");
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    mongoose.connection.close();
  }
}

populateDatabase();
