import { Types } from "mongoose";

export interface IDiscover {
  _id?: Types.ObjectId; 
  recipeList: Types.ObjectId[]; 
}