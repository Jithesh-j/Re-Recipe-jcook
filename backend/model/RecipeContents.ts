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
      user_ID: { type: String, required: true },
      recipe_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
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

    // Attach schema definition to the Mongoose schema
    this.schema = new mongoose.Schema(schemaDefinition, { collection: "recipe_contents" });
  }

  public createModel() {
    this.contents = mongoose.model<IRecipeContents>("RecipeContents", this.schema, "recipe_contents");
  }

  // Static methods for querying
  public static async findByRecipeID(recipe_ID: string): Promise<IRecipeContents[]> {
    return RecipeContentsModel.find({ recipe_ID }).exec();
  }

  public static async findByUserID(user_ID: string): Promise<IRecipeContents[]> {
    return RecipeContentsModel.find({ user_ID }).exec();
  }
}

// Initialize the model
const RecipeContentsModel = mongoose.model<IRecipeContents>(
  "RecipeContents",
  new RecipeContents().schema,
  "recipe_contents"
);

export { RecipeContentsModel };