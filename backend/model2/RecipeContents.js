"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeContents = void 0;
// models/ModifiedRecipeModel.ts
const mongoose = require("mongoose");
class RecipeContents {
    constructor() {
        this.createSchema();
    }
    createSchema() {
        const SchemaDefinition = {
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
    }
    /**
     * Creates a mongoose model for the modified recipe.
     * This model is used for object validation
     */
    createModel() {
        this.contents = mongoose.model("Contents", this.schema);
    }
}
exports.RecipeContents = RecipeContents;
//# sourceMappingURL=RecipeContents.js.map