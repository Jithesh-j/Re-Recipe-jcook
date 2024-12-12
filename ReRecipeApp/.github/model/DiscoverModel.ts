import * as mongoose from "mongoose";
import { IRecipe } from "../interfaces/IRecipe";
import { RecipeModel } from "./RecipeModel";
import { IDiscover } from "../interfaces/IDiscover";

class DiscoverModel {
  public schema: mongoose.Schema;
  public model: mongoose.Model<IDiscover>;
  public dbConnectionString: string;
  public recipeModel = new RecipeModel();
  

  /**
   * Constructor to initialize the database connection and set up the schema and model.
   * @param DB_CONNECTION_STRING - Connection string for MongoDB.
   */
  public constructor(DB_CONNECTION_STRING: string) {
    this.dbConnectionString = DB_CONNECTION_STRING;
    this.createSchema();
    this.createModel();
  }

  /**
   * Creates the Mongoose schema for a recipe.
   * Defines the structure for `recipe_ID`, `recipeName`, `category`, etc.
   */
  public createSchema() {
    this.schema = new mongoose.Schema(
      {
        recipeList: [
          { type: mongoose.Schema.Types.ObjectId, ref: "RecipeModel" },
        ],
      },
      { collection: "discover" }
    );
  }
  /**
   * Connects to the MongoDB database and creates the Mongoose model based on the schema.
   * The model is stored in `this.model`.
   */
  public async createModel() {
    try {
      await mongoose.connect(this.dbConnectionString);

      this.model =
        mongoose.models.Discover ||
        mongoose.model<IDiscover>("Discover", this.schema);
      console.log("Connected to MongoDB and initialized Discover model.");
    } catch (e) {
      console.error(
        "Error connecting to MongoDB or initializing Discover model:"
      );
    }
  }

  // /**
  //  * Adds a new recipe to the database.
  //  * @param response - The response object to send data back to the client.
  //  * @param newRecipeData - The new recipe data from the user.
  //  */
  // public async createRecipe(response: any, newRecipeData: IRecipe) {
  //   try {
  //     // Create a new Mongoose document
  //     // const newRecipe = new this.model(newRecipeData);
  //     const newRecipe = this.recipeModel.createRecipe(newRecipeData);

  //     // Save the document to the database
  //     const savedRecipe = await newRecipe.save();
  //     //const savedRecipe = await this.recipeModel.createRecipe(newRecipeData);

  //     // Send the saved recipe as the response
  //     response.status(201).json(savedRecipe);
  //   } catch (e) {
  //     console.error("Failed to create new recipe:", e);
  //     response.status(500).json({ error: "Failed to create new recipe" });
  //   }
  // }

  /**
   * Creates a new recipe and adds it to the Discover collection.
   * @param recipeData - Data for the new recipe.
   */
  public async createRecipe(response: any, recipeData: IRecipe) {
    try {
      // Create a new recipe
      const newRecipe = await this.recipeModel.createRecipe(recipeData);
      const savedRecipe = await newRecipe.save();

      // Add the recipe to Discover
      const discoverEntry = await this.model.findOneAndUpdate(
        {}, // Assumes there's one document in the Discover collection. Adjust as needed.
        { $push: { recipeList: savedRecipe._id } },
        { upsert: true, new: true }
      );

      console.log("Recipe added to Discover:", discoverEntry);
      response.status(201).json(savedRecipe);
      // return discoverEntry;
    } catch (error) {
      console.error("Error adding recipe to Discover:", error);
      response.status(500).json({ error: "Failed to create new recipe" });
      throw error;
    }
  }
  /**
   * Retrieves all recipes from the database.
   * @param response - The response object to send data back to the client.
   */
  public retrieveRecipe = async (response: any, recipe_ID: string) => {
    console.log("this context in retrieveRecipe:", this);
    console.log("this.model before findOne:", this.model);
    if (!this.model) {
        console.error("Discover model is not initialized.");
        response.status(500).json({ error: "Discover model not initialized" });
        return;
    }

    try {
        const result = await this.model.findOne({ recipe_ID }).exec();
        if (result) {
            response.json(result);
        } else {
            response.status(404).json({ error: "Recipe not found" });
        }
    } catch (e) {
        console.error("Failed to retrieve recipe:", e);
        response.status(500).json({ error: "Failed to retrieve recipe" });
    }
};

  /**
   * Retrieves all recipes from the database.
   * @param response - The response object to send data back to the client.
   */
  public async retrieveAllRecipes(response: any) {
    try {
        if (!this.model) {
            throw new Error("Discover model is not initialized.");
        }

        const itemArray = await this.model.find({}).exec();
        response.json(itemArray);
    } catch (error) {
        console.error("Failed to retrieve recipes:", error);
        response.status(500).json({ error: "Failed to retrieve recipes" });
    }
}

  /**
   * Counts and retrieves the total number of recipes in the database.
   * @param response - The response object to send data back to the client.
   */
  public async retrieveRecipeListCount(response: any) {
    try {
      const numberOfRecipes = await this.model.estimatedDocumentCount().exec();
      response.json({ count: numberOfRecipes });
    } catch (e) {
      console.error("Failed to retrieve recipe count:", e);
      response.status(500).json({ error: "Failed to retrieve recipe count" });
    }
  }

  // BEN: I DONT THINK THESE NEED TO EXIST
  /**
   * Deletes a recipe by its `recipe_ID`.
   * @param response - The response object to send data back to the client.
   * @param recipe_ID - The unique ID of the recipe to delete.
   */
  public async deleteRecipe(response: any, recipe_ID: string) {
    try {
      const result = await this.model.deleteOne({ recipe_ID }).exec();
      if (result.deletedCount && result.deletedCount > 0) {
        response.json({
          message: `Recipe ${recipe_ID} deleted successfully.`,
          result,
        });
      } else {
        response.status(404).json({ error: "Recipe not found" });
      }
    } catch (e) {
      console.error("Failed to delete recipe:", e);
      response.status(500).json({ error: "Failed to delete recipe" });
    }
  }

  // /**
  //  * Updates the `directions` of a recipe by `recipe_ID`.
  //  * @param response - The response object to send data back to the client.
  //  * @param recipe_ID - The unique ID of the recipe to update.
  //  * @param directions - An array of objects containing the new steps for directions.
  //  */
  // public async updateDirections(
  //   response: any,
  //   recipe_ID: string,
  //   directions: { step: string }[]
  // ) {
  //   try {
  //     const result = await this.model
  //       .findOneAndUpdate(
  //         { recipe_ID },
  //         { $set: { directions } },
  //         { new: true, runValidators: true }
  //       )
  //       .exec();
  //     if (result) {
  //       response.json(result);
  //     } else {
  //       response.status(404).json({ error: "Recipe not found" });
  //     }
  //   } catch (e) {
  //     console.error("Failed to update directions:", e);
  //     response.status(500).json({ error: "Failed to update directions" });
  //   }
  // }

  // /**
  //  * Updates the `ingredients` of a recipe by `recipe_ID`.
  //  * @param response - The response object to send data back to the client.
  //  * @param recipe_ID - The unique ID of the recipe to update.
  //  * @param ingredients - An array of objects containing `name`, `quantity`, and `unit` for each ingredient.
  //  */
  // public async updateIngredients(
  //   response: any,
  //   recipe_ID: string,
  //   ingredients: { name: string; quantity: number; unit: string }[]
  // ) {
  //   try {
  //     const result = await this.model
  //       .findOneAndUpdate(
  //         { recipe_ID },
  //         { $set: { ingredients } },
  //         { new: true, runValidators: true }
  //       )
  //       .exec();
  //     if (result) {
  //       response.json(result);
  //     } else {
  //       response.status(404).json({ error: "Recipe not found" });
  //     }
  //   } catch (e) {
  //     console.error("Failed to update ingredients:", e);
  //     response.status(500).json({ error: "Failed to update ingredients" });
  //   }
  // }

  /**
   * Updates the `image_url` of a recipe by `recipe_ID`.
   * @param response - The response object to send data back to the client.
   * @param recipe_ID - The unique ID of the recipe to update.
   * @param image_url - The new image URL for the recipe.
   */
  public async updateImageUrl(
    response: any,
    recipe_ID: string,
    image_url: string
  ) {
    try {
      const result = await this.model
        .findOneAndUpdate(
          { recipe_ID },
          { $set: { image_url } },
          { new: true, runValidators: true }
        )
        .exec();
      if (result) {
        response.json(result);
      } else {
        response.status(404).json({ error: "Recipe not found" });
      }
    } catch (e) {
      console.error("Failed to update image URL:", e);
      response.status(500).json({ error: "Failed to update image URL" });
    }
  }

  /**
   * Updates the `isVisible` field of a recipe by `recipe_ID`.
   * @param response - The response object to send data back to the client.
   * @param recipe_ID - The unique ID of the recipe to update.
   * @param is_visible
   */
  public async updateVisibility(
    response: any,
    recipe_ID: string,
    is_visible: boolean
  ) {
    try {
      const result = await this.model
        .findOneAndUpdate(
          { recipe_ID },
          { $set: { is_visible } },
          { new: true, runValidators: true }
        )
        .exec();
      if (result) {
        response.json(result);
      } else {
        response.status(404).json({ error: "Recipe not found" });
      }
    } catch (e) {
      console.error("Failed to update visibility:", e);
      response.status(500).json({ error: "Failed to update visibility" });
    }
  }
}

export { DiscoverModel };