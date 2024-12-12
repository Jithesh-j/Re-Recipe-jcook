import { Types } from "mongoose";

// The Discover model, referencing recipes
export interface IDiscover {
  _id?: Types.ObjectId;
  recipeList: Types.ObjectId[];
  modified_flag?: boolean;
  user_ID: string;
  recipe_ID: string;
  recipe_name: string;
  meal_category: string[];
  recipe_versions: Types.ObjectId[];
  image_url: string;
  is_visible: boolean;
}
