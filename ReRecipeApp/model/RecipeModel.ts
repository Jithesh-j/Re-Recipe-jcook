import mongoose from "mongoose";
import { IRecipe } from "../interfaces/IRecipe";
import {IRecipeContents} from "../interfaces/IRecipeContents";  // Correct import
import { RecipeContentsModel } from "./RecipeContents";

export class RecipeModel {
  public schema: mongoose.Schema<IRecipe>;
  public recipe: mongoose.Model<IRecipe>;

  public constructor() {
    this.createSchema();
    this.createModel();
  }

  // Create the schema for the Recipe model
  public createSchema() {
    const schemaDefinition: mongoose.SchemaDefinition<IRecipe> = {
      recipe_ID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Recipe"
      },
      recipe_name: { type: String, required: true },
      meal_category: { type: [String], required: true },
      recipe_versions: [
        { type: mongoose.Schema.Types.ObjectId, ref: "RecipeContents" }
      ],
      image_url: { type: String },
      is_visible: { type: Boolean, default: false },
      modified_flag: { type: Boolean },
      user_ID: { type: String, required: true }
    };

    this.schema = new mongoose.Schema<IRecipe>(schemaDefinition);
  }

  // Create the Recipe model
  public createModel() {
    this.recipe = mongoose.models.Recipe || mongoose.model<IRecipe>("Recipe", this.schema);
  }

  // Create a new recipe version
  public async createRecipeVersion(recipe: IRecipe, recipe_contents_data: IRecipeContents) {
    const new_version_number = recipe.recipe_versions.length + 1;

    const existingRecipeContents = await RecipeContentsModel.findOne({
      recipe_ID: recipe.recipe_ID,
      version_number: new_version_number,
    });

    if (existingRecipeContents) {
      console.log(`Recipe version ${new_version_number} already exists for recipe ${recipe.recipe_ID}`);
      return recipe;  // Skip creating a new version
    }

    const newRecipeContents = new RecipeContentsModel({
      ...recipe_contents_data,
      version_number: new_version_number,
    });

    const savedRecipeContents = await newRecipeContents.save();

    recipe.recipe_versions.push(savedRecipeContents._id);

    return recipe;
  }
}
