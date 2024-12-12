import { Types } from "mongoose";
import { IRecipe } from "./IRecipe";

export interface ICookbook {
  id: string;
  title: string;
  modified_recipes: Types.ObjectId[];
}
