import { Document } from "mongoose";
import { EnumType } from "typescript";
import { IRecipeContents } from "./IRecipeContents";

export interface IRecipe extends Document {
  modified_flag: boolean;
  user_ID: string;
  recipe_ID: string;
  recipe_name: string;
  meal_category: [EnumType];
  recipe_versions: [IRecipeContents]; // THESE ARE THE RECIPE CONTENTS OBJECTS
  image_url?: string;
  is_visible?: boolean;

  // Fields specific to ModifiedRecipeModel
}
