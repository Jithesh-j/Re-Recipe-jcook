import * as mongoose from "mongoose";
import { MealCategoryEnum } from "../enums/MealCategoryEnum";

/**
 * Mongoose schema for meal categories with TypeScript enum validation.
 */
const mealCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    enum: Object.values(MealCategoryEnum), 
    required: true,
  },
});

export const MealCategory = mongoose.model("MealCategory", mealCategorySchema);