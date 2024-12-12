import * as mongoose from "mongoose";
import { IRecipe } from "../interfaces/IRecipe";
import { RecipeModel } from "./RecipeModel";
import { IDiscover } from "../interfaces/IDiscover";
import { RecipeContentsModel } from "./RecipeContents";

class DiscoverModel {
    public schema: mongoose.Schema;
    public model: mongoose.Model<IDiscover>;
    public dbConnectionString: string;
    public recipeModel = new RecipeModel();

    public constructor(DB_CONNECTION_STRING: string) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }

    public createSchema() {
        this.schema = new mongoose.Schema(
            {
                recipeList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
                modified_flag: { type: Boolean, default: false },
                user_ID: { type: String, required: true },
                recipe_ID: { type: mongoose.Schema.Types.ObjectId, required: true }, // Change from String to ObjectId
                recipe_name: { type: String, required: true },
                meal_category: [{ type: String }],
                recipe_versions: [{ type: mongoose.Schema.Types.ObjectId, ref: "RecipeContents" }],
                image_url: { type: String, required: true },
                is_visible: { type: Boolean, default: false },
            },
            { collection: "discover" }
        );
    }

    public async createModel() {
        try {
            await mongoose.connect(this.dbConnectionString);
            this.model =
                mongoose.models.Discover || mongoose.model<IDiscover>("Discover", this.schema);
            console.log("Connected to MongoDB and initialized Discover model.");
        } catch (e) {
            console.error("Error connecting to MongoDB or initializing Discover model:", e);
        }
    }

    public async createRecipe(response: any, recipeData: IRecipe) {
        try {
            console.log("Creating recipe with data:", recipeData);

            let savedRecipe;

            // Use ObjectId for recipe_ID (MongoDB's native identifier)
            const recipeIdObjectId = new mongoose.Types.ObjectId();  // Generate new ObjectId

            let existingRecipe = await this.recipeModel.recipe.findOne({
                recipe_ID: recipeIdObjectId,  // Search with ObjectId
            });

            if (existingRecipe) {
                savedRecipe = existingRecipe;
                console.log("Recipe already exists:", savedRecipe);
            } else {
                const newRecipe = new this.recipeModel.recipe({
                    ...recipeData,
                    recipe_ID: recipeIdObjectId,  // Use ObjectId here
                    modified_flag: false,
                });

                console.log("Saving new recipe:", newRecipe);
                savedRecipe = await newRecipe.save();
                console.log("New Recipe saved:", savedRecipe);

                // Ensure user_ID is passed in the recipe contents
                const recipeVersion = new RecipeContentsModel({
                    recipe_ID: savedRecipe._id,
                    user_ID: recipeData.user_ID, // Include user_ID
                    cooking_duration: recipeData.cooking_duration || 25,
                    serving_size: recipeData.serving_size || 4,
                    ingredients: recipeData.ingredients || [],
                    directions: recipeData.directions || [],
                    version_number: 0, // Assuming it's the first version
                });

                console.log("Creating new recipe version:", recipeVersion);
                const savedRecipeContents = await recipeVersion.save();
                console.log("New Recipe version saved:", savedRecipeContents);

                // Add the saved recipe contents to the recipe's versions array
                savedRecipe.recipe_versions.push(savedRecipeContents._id);
                await savedRecipe.save();
                console.log("Recipe version added to recipe:", savedRecipe.recipe_versions);
            }

            // Now, create the Discover document linking to the saved recipe
            const newDiscoverDocument = new this.model({
                recipeList: [savedRecipe._id],  // Ensure the recipeList contains the saved recipe ID
                modified_flag: false,
                user_ID: recipeData.user_ID || "user005",  // Ensure user_ID is passed here
                recipe_ID: recipeIdObjectId,  // Use ObjectId here
                recipe_name: recipeData.recipe_name || savedRecipe.recipe_name,
                meal_category: recipeData.meal_category || [],
                recipe_versions: savedRecipe.recipe_versions || [],
                image_url: recipeData.image_url || "https://www.the-sun.com/wp-content/uploads/sites/6/2020/08/tp-graphic-rihanna-chef.jpg",
                is_visible: recipeData.is_visible !== undefined ? recipeData.is_visible : false,
            });

            console.log("Creating new Discover document:", newDiscoverDocument);
            await newDiscoverDocument.save();
            console.log("New Discover document saved:", newDiscoverDocument);

            response.status(201).json(savedRecipe);
        } catch (error) {
            console.error("Error adding recipe to Discover:", error);
            response.status(500).json({ error: "Failed to create new recipe" });
        }
    }

    public async retrieveAllRecipes(response: any): Promise<void> {
        try {
            console.log("Fetching all Discover documents with recipe_versions...");
    
            const recipes = await this.model.aggregate([
                {
                  $match: {
                    recipe_versions: { $exists: true, $ne: [] } // Ensures non-empty recipe_versions
                  }
                },
                {
                  $lookup: {
                    from: "recipe_contents",
                    localField: "recipe_versions",
                    foreignField: "_id",
                    as: "recipe_versions_details",
                  },
                },
              ]);
              console.log("Matched and Populated Documents:", JSON.stringify(recipes, null, 2));
            response.json(recipes);
        } catch (error) {
            console.error("Failed to retrieve all recipes with versions:", error);
            response.status(500).json({ error: "Failed to retrieve recipes with versions." });
        }
    }

    public async retrieveRecipe(response: any, recipe_ID: string) {
        try {
            console.log("Fetching Discover document for recipe_ID with populated recipe versions:", recipe_ID);
            const result = await this.model
                .findOne({ recipe_ID })
                .populate("recipe_versions") 
                .exec();
    
            if (result) {
                response.json(result);
            } else {
                response.status(404).json({ error: "Recipe not found" });
            }
        } catch (e) {
            console.error("Failed to retrieve recipe:", e);
            response.status(500).json({ error: "Failed to retrieve recipe" });
        }
    }
    public async deleteRecipe(response: any, recipe_ID: string) {
        try {
            const result = await this.model.deleteOne({ recipe_ID }).exec();
            if (result.deletedCount > 0) {
                response.json({ message: `Recipe ${recipe_ID} deleted successfully.` });
            } else {
                response.status(404).json({ error: "Recipe not found" });
            }
        } catch (e) {
            console.error("Failed to delete recipe:", e);
            response.status(500).json({ error: "Failed to delete recipe" });
        }
    }
}

export { DiscoverModel };