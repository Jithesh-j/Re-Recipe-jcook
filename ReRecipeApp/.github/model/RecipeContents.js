"use strict";
exports.__esModule = true;
exports.RecipeContents = exports.recipeContentsInstance = void 0;
// models/ModifiedRecipeModel.ts
var mongoose = require("mongoose");
var RecipeContents = /** @class */ (function () {
    function RecipeContents() {
        this.createSchema();
        this.createModel();
    }
    RecipeContents.prototype.createSchema = function () {
        var schemaDefinition = {
            recipe_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
            version_number: { type: Number, "default": 1, required: true },
            cooking_duration: { type: Number, required: true },
            serving_size: { type: Number, required: true },
            ingredients: [
                {
                    name: { type: String, required: true },
                    quantity: { type: Number, required: true },
                    unit: {
                        type: String,
                        "enum": ["oz", "cup", "tbsp", "tsp", "g", "kg", "lb", "each"],
                        required: true
                    }
                },
            ],
            directions: [
                {
                    step: { type: String, required: true }
                },
            ],
            notes: { type: String }
        };
        this.schema = new mongoose.Schema(schemaDefinition);
    };
    /**
     * Creates a mongoose model for the modified recipe.
     * This model is used for object validation
     */
    RecipeContents.prototype.createModel = function () {
        this.contents = mongoose.model("Contents", this.schema);
    };
    return RecipeContents;
}());
exports.RecipeContents = RecipeContents;
// export { RecipeContents };
var recipeContentsInstance = new RecipeContents();
exports.recipeContentsInstance = recipeContentsInstance;
