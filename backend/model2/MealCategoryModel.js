"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MealCategory = void 0;
const mongoose = require("mongoose");
const MealCategoryEnum_1 = require("../enums/MealCategoryEnum");
/**
 * Mongoose schema for meal categories with TypeScript enum validation.
 */
const mealCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        enum: Object.values(MealCategoryEnum_1.MealCategoryEnum),
        required: true,
    },
});
exports.MealCategory = mongoose.model("MealCategory", mealCategorySchema);
//# sourceMappingURL=MealCategoryModel.js.map