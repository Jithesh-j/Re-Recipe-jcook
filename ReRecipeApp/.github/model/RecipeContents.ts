// models/ModifiedRecipeModel.ts
import * as mongoose from "mongoose";
import { IRecipeContents } from "../interfaces/IRecipeContents";

class RecipeContents {
  public schema: mongoose.Schema<IRecipeContents>;
  public contents: mongoose.Model<IRecipeContents>;

  public constructor() {
    this.createSchema();
    this.createModel();
  }

  public createSchema() {
    const schemaDefinition: mongoose.SchemaDefinition<IRecipeContents> = {
      user_ID: { type: String, required: true, unique: true },
      recipe_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
      version_number: { type: Number, default: 1, required: true },
      cooking_duration: { type: Number, required: true },
      serving_size: { type: Number, required: true },
      ingredients: [
        {
          name: { type: String, required: true },
          quantity: { type: Number, required: true },
          unit: {
            type: String,
            enum: ["oz", "cup", "tbsp", "tsp", "g", "kg", "lb", "each"],
            required: true,
          },
        },
      ],
      directions: [
        {
          step: { type: String, required: true },
        },
      ],
      notes: { type: String },
    };
    this.schema = new mongoose.Schema(schemaDefinition);
  }

  /**
   * Creates a mongoose model for the modified recipe.
   * This model is used for object validation
   */
  public createModel() {
    this.contents = mongoose.model<IRecipeContents>("Contents", this.schema);
  }
}

// export { RecipeContents };
const recipeContentsInstance = new RecipeContents();

export { recipeContentsInstance, RecipeContents };
