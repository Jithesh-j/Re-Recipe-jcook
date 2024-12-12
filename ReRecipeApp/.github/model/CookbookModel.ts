import * as mongoose from "mongoose";
import { IRecipe } from "../interfaces/IRecipe";
import { RecipeModel } from "./RecipeModel";
import { DiscoverModel } from "./DiscoverModel";

class CookbookModel {
  public schema: mongoose.Schema;
  public model: mongoose.Model<any>;
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
        modified_recipes: [
          { type: mongoose.Schema.Types.ObjectId, ref: "RecipeModel" },
        ],
      },
      { collection: "cookbooks" }
    );
  }

  /**
   * Connects to the MongoDB database and creates the Mongoose model based on the schema.
   */
  public async createModel() {
    try {
      await mongoose.connect(this.dbConnectionString);

      this.model = mongoose.model("Cookbook", this.schema);
      console.log("Connected to MongoDB and created Cookbook model.");
    } catch (error) {
      console.error("Error creating model:", error);
    }
  }

  /**
   * Copies a recipe from the Discover collection and adds it to the user's cookbook.
   * @param {any} response - The response object to send data back to the client.
   * @param {string} recipe_ID - The ID of the recipe to copy from Discover.
   * @param {string} user_ID - The ID of the user to whom the new recipe will belong.
   * @returns {Promise<void>}
   */
  public async copyRecipeFromDiscover(
    response: any,
    recipe_ID: string,
    user_ID: string
  ): Promise<void> {
    try {
      // Use the existing model from DiscoverModel to retrieve the recipe
      const originalRecipe = await this.discoverModel.model
        .findOne({ _id: recipe_ID })
        .exec();
      if (!originalRecipe) {
        return response
          .status(404)
          .json({ error: "Recipe not found in Discover!" });
      }

      // Create a copy of the recipe and add user-specific data
      const newRecipeData: IRecipe = {
        ...originalRecipe.toObject(),
        user_ID,
        isModified: true,
      };

      // Create a new recipe document using RecipeModel
      const recipeModelInstance = new RecipeModel();
      const newRecipe = new recipeModelInstance.recipe(newRecipeData);
      await newRecipe.save();

      // Find or create the user's cookbook
      let cookbook = await this.model.findOne({ user_ID }).exec();
      if (!cookbook) {
        cookbook = new this.model({
          user_ID,
          modified_recipes: [newRecipe._id],
        });
      } else {
        cookbook.modified_recipes.push(newRecipe._id);
      }

      // Save the updated cookbook and respond
      const savedCookbook = await cookbook.save();
      response.status(201).json(savedCookbook);
    } catch (error) {
      console.error("Failed to copy recipe from Discover:", error);
      response
        .status(500)
        .json({ error: "Failed to copy recipe from Discover" });
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

  /**
   * Retrieves a single modified recipe with the first and most recent versions.
   * @param {any} response - The response object to send data back to the client.
   * @param {string} userId - The ID of the user.
   * @param {string} recipeId - The ID of the recipe to retrieve.
   * @returns {Promise<void>}
   */
  public async getSingleRecipeWithVersions(
    response: any,
    userId: string,
    recipeId: string
  ): Promise<void> {
    try {
      const cookbook = await this.model
        .findOne({ user_ID: userId }, { modified_recipes: 1 })
        .populate("modified_recipes")
        .exec();

      if (!cookbook) {
        return response.status(404).json({ error: "Cookbook not found" });
      }

      const recipe = cookbook.modified_recipes.find(
        (r: any) => r._id.toString() === recipeId
      );

      if (!recipe) {
        return response.status(404).json({ error: "Recipe not found" });
      }

      const versions = recipe.versions || [];
      const firstVersion = versions[0];
      const mostRecentVersion = versions[versions.length - 1];

      response.json({
        recipe: {
          ...recipe.toObject(),
          versions: [firstVersion, mostRecentVersion].filter(Boolean),
        },
      });
    } catch (error) {
      console.error("Failed to retrieve recipe:", error);
      response.status(500).json({ error: "Failed to retrieve recipe" });
    }
  }

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
   * Retrieves specific versions of a recipe.
   * @param {any} response - The response object to send data back to the client.
   * @param {string} userId - The ID of the user.
   * @param {string} recipeId - The ID of the recipe to retrieve versions for.
   * @param {number} [versionNumber] - The specific version number to retrieve, if provided.
   * @returns {Promise<void>}
   */
  public async retrieveRecipeVersion(
    response: any,
    userId: string,
    recipeId: string,
    versionNumber: number
  ): Promise<void> {
    try {
      const cookbook = await this.model
        .findOne({ user_ID: userId, "modified_recipes._id": recipeId })
        .exec();

      const recipe = cookbook?.modified_recipes.find(
        (r: any) => r._id.toString() === recipeId
      );

      if (recipe) {
        const versions = versionNumber
          ? recipe.versions.filter(
              (v: any) => v.version_number === versionNumber
            )
          : recipe.versions;
        response.json(versions);
      } else {
        response.status(404).json({ error: "Recipe not found" });
      }
    } catch (error) {
      console.error("Failed to retrieve recipe version:", error);
      response.status(500).json({ error: "Failed to retrieve recipe version" });
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
  public async listAllRecipes(response: any, userId: string): Promise<void> {
    try {
      // Find the user's cookbook and populate the `modified_recipes` field
      const cookbook = await this.model
        .findOne({ user_ID: userId })
        .populate("modified_recipes")
        .exec();

      if (!cookbook || cookbook.modified_recipes.length === 0) {
        return response
          .status(404)
          .json({ error: "No recipes found in the user's cookbook." });
      }

      // Return all recipes in the cookbook
      response.json(cookbook.modified_recipes);
    } catch (error) {
      console.error("Failed to retrieve all recipes in the cookbook:", error);
      response.status(500).json({ error: "Failed to retrieve recipes." });
    }
  }
}

export { CookbookModel };
