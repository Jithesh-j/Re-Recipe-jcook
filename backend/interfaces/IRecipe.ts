import mongoose from "mongoose";

export interface IRecipe {
  recipe_ID: mongoose.Schema.Types.ObjectId;
  recipe_name: string;
  meal_category: string[];
  recipe_versions: mongoose.Schema.Types.ObjectId[];
  image_url: string;
  is_visible: boolean;
  modified_flag?: boolean;
  user_ID: string;
  cooking_duration?: number;
  serving_size?: number;
  ingredients?: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  directions?: {
    step: string;
  }[];
}
