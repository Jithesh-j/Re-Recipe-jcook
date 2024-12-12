import * as mongoose from "mongoose";
import { IRecipe } from "../interfaces/IRecipe";
import { RecipeContents, recipeContentsInstance } from "./RecipeContents";
import { IRecipeContents } from "../interfaces/IRecipeContents";
import { v4 as uuidv4 } from "uuid";
import { isReadable } from "stream";

class RecipeModel {
  public schema: mongoose.Schema<IRecipe>;
  public recipe: mongoose.Model<IRecipe>;

  /**
   * Constructor to initialize the database connection and set up the schema and model.
   */
  public constructor() {
    this.createSchema();
    this.createModel();
  }

  /**
   * Creates the Mongoose schema for a  recipe.
   * Includes fields for user-specific modifications and version control.
   */
  public createSchema() {
    const schemaDefinition: mongoose.SchemaDefinition<IRecipe> = {
      modified_flag: Boolean,
      user_ID: { type: String, required: true },
      recipe_ID: { type: String, required: true }, // ID of the original recipe
      recipe_name: { type: String, required: true },
      meal_category: {
        enum: [
          "breakfast",
          "lunch",
          "dinner",
          "dessert",
          "vegetarian",
          "vegan",
          "gluten-free",
        ],
      },

      recipe_versions: [
        { type: mongoose.Schema.Types.ObjectId, ref: "RecipeContents" },
      ], // this is recipe_contents
      image_url: { type: String },
      is_visible: { type: Boolean, default: false },
    };
    this.schema = new mongoose.Schema(schemaDefinition);
  }

  /**
   * Creates a mongoose model for the modified recipe.
   * This model is used for object validation
   */
  public createModel() {
    this.recipe =
      mongoose.models.Recipe || mongoose.model<IRecipe>("Recipe", this.schema);
  }

  /**
   * TODO
   * Creates a new recipe. To set modified recipe: set param flag to true
   * @param
   * @param
   * @param
   * @param
   */
  public async createRecipe(recipeData: IRecipe, isModified: boolean = false) {
    const newRecipe = new this.recipe({
      ...recipeData,
      modified_flag: isModified,
    });

    return newRecipe;
  }
  // Update?
  // Delete?

  /**
   * PRE:CONDITION : needs to have correct recipe_contents_data
   * Fetch modified recipe
   * create new recipe contents obj
   * add it to the recipe version list
   * return it back
   * @param recipe
   * @param recipe_contents_data
   */
  public createRecipeVersion(recipe: IRecipe, recipe_contents_data: IRecipeContents) {
    const new_version_number = recipe.recipe_versions.length;
    const newRecipeContents = new recipeContentsInstance.contents({
      ...recipe_contents_data,
      version_number: new_version_number,
    });
    recipe.recipe_versions.push(newRecipeContents);

    return recipe;
  }
}

export { RecipeModel };

// /**
//  * Create A Modified Recipe for the cookbook
//  */
// public createModifiedRecipe(recipe_data: IRecipe, user_ID) {

//   // copy recipe data
//   const newModRecipe = new this.recipe({
//     userID: user_ID,
//     ...recipe_data,
//     modified_flag: true,
//   });

//   return newModRecipe;
// }
