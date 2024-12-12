import { Types, Document } from "mongoose";

export interface IRecipeContents extends Document {
  user_ID: string;
  recipe_ID: Types.ObjectId;
  version_number: number;
  cooking_duration: number;
  serving_size: number;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  directions: {
    step: string;
  }[];
  notes?: string;
}
