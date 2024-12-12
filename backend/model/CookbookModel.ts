import * as mongoose from "mongoose";
import { IRecipe } from "../interfaces/IRecipe";
import { RecipeModel } from "./RecipeModel";
import { DiscoverModel } from "./DiscoverModel";
import { ICookbook } from "../interfaces/ICookbook";

class CookbookModel {
  public schema: mongoose.Schema;
  public model: mongoose.Model<ICookbook>;
  public dbConnectionString: string;
  private discoverModel: DiscoverModel;
  private recipeModel: RecipeModel;

  /**
   * Constructor to initialize the database connection and set up the schema and model.
   * @param {string} DB_CONNECTION_STRING - MongoDB connection string.
   */
  public constructor(DB_CONNECTION_STRING: string, discoverModel) {
    this.dbConnectionString = DB_CONNECTION_STRING;
    this.createSchema();
    this.createModel();
    this.discoverModel = discoverModel;
    this.recipeModel = new RecipeModel();
  }

  /**
   * Defines the schema for a cookbook with a user reference and arrays for modified and saved recipes.
   */
  public createSchema() {
    this.schema = new mongoose.Schema(
      {
        user_ID: { type: String, required: true, unique: true },
        title: { type: String, default: "My Cookbook" },
        modified_recipes: {
          type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
          default: [], 
        },
      },
      { collection: "cookbooks", timestamps: true }
    );
  } 

  /**
   * Connects to the MongoDB database and creates the Mongoose model based on the schema.
   */
  public async createModel() {
    try {
      if (!mongoose.models.Cookbook) {
        this.model = mongoose.model<ICookbook>("Cookbook", this.schema); // Define the model if it doesn't exist
        console.log("Created Cookbook model.");
      } else {
        this.model = mongoose.models.Cookbook; // Use the existing model
        console.log("Using existing Cookbook model.");
      }
    } catch (error) {
      console.error("Error creating Cookbook model:", error);
    }
  }

  public async createCookbook(user_Id: string, title: string = "myCookbook"): Promise<void> {
    try {
      // Check if a cookbook already exists for the user
      const existingCookbook = await this.model.findOne({ user_ID: user_Id }).exec();
      
      // Exit if a cookbook already exists
      if (existingCookbook) {
        console.log(`Cookbook already exists for user: ${user_Id}`);
        return; 
      }
  
      // Create a new cookbook
      const newCookbook = new this.model({
        user_ID: user_Id,
        title,
        recipes: [],
      });
  
      await newCookbook.save();
      console.log(`Cookbook "${title}" created for user: ${user_Id}`);
    } catch (error) {
      console.error("Error creating cookbook:", error);
      throw new Error("Cookbook creation failed.");
    }
  }
  

  /**
   * Copies a recipe from the Discover collection and adds it to the user's cookbook.
   * @param {any} response - The response object to send data back to the client.
   * @param {string} recipe_ID - The ID of the recipe to copy from Discover.
   * @param {string} user_ID - The ID of the user to whom the new recipe will belong.
   * @returns {Promise<void>}
   */
  public async copyRecipesFromDiscover(
    response: any,
    recipe_IDs: any[],
    user_id: string
  ): Promise<void> {
    console.log("Entering copyRecipesFromDiscover");
    console.log("Recipids, in the copydiscover model", recipe_IDs)
    console.log("user_id, in the copydiscover model", user_id)

    try {
      // Enable Mongoose debugging
      const mongoose = require('mongoose');
      mongoose.set('debug', true); // Logs all Mongoose operations
      var ObjectId = require("mongoose").Types.ObjectId;
      const discoverCollection = mongoose.connection.collection("discover");
      // Fetch all the needed recipes from the Discover collection
      const objectIdRecipeIDs = recipe_IDs.map((id) => new ObjectId(id));
      console.log("converting to object.......",objectIdRecipeIDs)

      const originalRecipes = await discoverCollection
        .find({ recipe_ID: { $in: objectIdRecipeIDs } })
        .toArray();

      console.log("originalRecipes.....", originalRecipes)

      if (!originalRecipes || originalRecipes.length === 0) {
        console.log("Sending 404 response from copyRecipesFromDiscover");
        return response.status(404).json({
          error: "No recipes found in Discover with the provided IDs!",
        });
      }
  
      const filter = { user_ID: user_id };
      console.log("filtere.....", filter)
      const update = {
        $push: {
          modified_recipes: {
            $each: originalRecipes.map((recipe) => recipe.recipe_ID), // Push only ObjectId instances
          },
        },
      };
  
      const userCookbook = await this.model.findOneAndUpdate(filter, update, { new: true });
  
      console.log("Sending response from copyRecipesFromDiscover");
      console.log("Sending response from copyRecipesFromDiscover", userCookbook);
      return response.status(200).json(userCookbook);
    } catch (error) {
      console.error("Error in copyRecipesFromDiscover:", error);
      console.log("Sending error response from copyRecipesFromDiscover");
      return response.status(500).json({ error: "Failed to copy recipes from Discover" });
    }
  }
   

  /**
   * Removes a recipe from the user's cookbook.
   * @param {any} response - The response object to send data back to the client.
   * @param {string} userId - The ID of the user.
   * @param {string} recipeId - The ID of the recipe to remove.
   * @returns {Promise<void>}
   */
  public async removeRecipeFromCookbook(
    response: any,
    userId: string,
    recipeId: string
  ): Promise<void> {
    try {
      const cookbook = await this.model.findOne({ user_ID: userId }).exec();
      if (!cookbook) {
        return response.status(404).json({ error: "Cookbook not found" });
      }

      const recipeIndex = cookbook.modified_recipes.findIndex(
        (id: mongoose.Types.ObjectId) => id.toString() === recipeId
      );

      if (recipeIndex === -1) {
        return response
          .status(404)
          .json({ error: "Recipe not found in cookbook" });
      }

      cookbook.modified_recipes.splice(recipeIndex, 1);
      await cookbook.save();

      response.json({
        message: `Modified recipe with ID ${recipeId} deleted successfully.`,
      });
    } catch (error) {
      console.error("Failed to remove recipe from the cookbook:", error);
      response
        .status(500)
        .json({ error: "Failed to remove recipe from cookbook" });
    }
  }

  // ############################### above is fixed

  /**
   * Adds a new version to an existing recipe in the user's cookbook.
   * @param {any} response - The response object to send data back to the client.
   * @param {string} userId - The ID of the user.
   * @param {string} recipeId - The ID of the recipe to add a new version to.
   * @param {any} versionData - The data for the new version to add.
   * @returns {Promise<void>}
   */
  public async addRecipeVersion(
    response: any,
    userId: string,
    recipeId: string,
    versionData: any
  ): Promise<void> {
    try {
      const result = await this.model
        .findOneAndUpdate(
          { user_ID: userId, "modified_recipes._id": recipeId },
          { $push: { "modified_recipes.$.versions": versionData } },
          { new: true }
        )
        .exec();
      response.json(result);
    } catch (error) {
      console.error("Failed to add recipe version:", error);
      response.status(500).json({ error: "Failed to add recipe version" });
    }
  }

  /**
   * Removes a version or the entire recipe.
   * @param {any} response - The response object to send data back to the client.
   * @param {string} userId - The ID of the user.
   * @param {string} recipeId - The ID of the recipe to remove.
   * @param {number} [versionNumber] - The specific version number to remove, if provided.
   * @returns {Promise<void>}
   */
  public async removeRecipeVersion(
    response: any,
    userId: string,
    recipeId: string,
    versionNumber?: number
  ): Promise<void> {
    try {
      const updateQuery = versionNumber
        ? {
            $pull: {
              "modified_recipes.$.versions": { version_number: versionNumber },
            },
          }
        : { $pull: { modified_recipes: { _id: recipeId } } };

      const result = await this.model
        .updateOne({ user_ID: userId }, updateQuery)
        .exec();

      response.json({
        message: versionNumber
          ? `Version ${versionNumber} removed from recipe ${recipeId}`
          : `Recipe ${recipeId} and all versions removed`,
        result,
      });
    } catch (error) {
      console.error("Failed to remove recipe/version:", error);
      response.status(500).json({ error: "Failed to remove recipe/version" });
    }
  }

    /**
    * Retrieves all recipes from a user's cookbook.
    * @param {any} response - The response object to send data back to the client.
    * @param {string} userId - The ID of the user whose cookbook is being retrieved.
    * @returns {Promise<void>}
    */
    async getAllCookbookRecipes(

      userId: string,
      
    ): Promise<any[]> {
      console.log("userid in get all cookbooks", userId);
      try { 
        // Find the user's cookbook and populate the `modified_recipes` field
        const cookbook = await this.model
          .findOne({ user_ID: userId })
          .populate("modified_recipes")
          .lean() // Add lean() to get plain JavaScript objects
          .exec();
    
        console.log("Cookbook query complete:"); 
        console.log("Cookbook:", cookbook);
        console.log("Modified Recipes:", cookbook?.modified_recipes);
    
        // If the cookbook doesn't exist, send an empty array
        if (!cookbook) {
          console.log("Cookbook not found. Sending empty array.");
          return [];
        }
    
        console.log("cookbook response!!!!!!!!!!!!!", cookbook.modified_recipes);
        // Return all recipes in the cookbook (could be empty)
        console.log("Sending modified recipes as response:");
        return cookbook.modified_recipes || [];
      } catch (error) {
        console.error("Failed to retrieve all recipes in the cookbook:", error);
       
      }
    }
}

export { CookbookModel };