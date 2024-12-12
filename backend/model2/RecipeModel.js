"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeModel = void 0;
const mongoose = require("mongoose");
"../interfaces/IMealCategories";
// todo pulled this out import { ICategory } from "../interfaces/ICategory";
class RecipeModel {
    /**
     * Constructor to initialize the database connection and set up the schema and model.
     */
    constructor() {
        this.createSchema();
    }
    /**
     * Creates the Mongoose schema for a  recipe.
     * Includes fields for user-specific modifications and version control.
     */
    createSchema() {
        const schemaDefinition = {
            modified_flag: Boolean,
            recipe_ID: { type: String, required: true }, // ID of the original recipe
            recipe_name: { type: String, required: true },
            meal_category: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "MealCategory",
                    required: true,
                },
            ],
            recipe_versions: [
                { type: mongoose.Schema.Types.ObjectId, ref: "RecipeContents" },
            ], // this is recipe_contents
            image_url: { type: String },
            is_visible: { type: Boolean, default: false },
        };
        this.createModel();
    }
    /**
     * Creates a mongoose model for the modified recipe.
     * This model is used for object validation
     */
    createModel() {
        this.recipe = mongoose.model("Recipe", this.schema);
        this.contents_array = mongoose.model("Contents", this.contents_schema);
    }
    /**
     * TODO
     * Creates a new recipe. To set modified recipe: set param flag to true
     * @param
     * @param
     * @param
     * @param
     */
    createRecipe(recipeData, isModified = false) {
        const newRecipe = new this.contents_array(Object.assign(Object.assign({}, recipeData), { 
            // recipe_ID: uuidv4(), MAY NEED LATER IF DOESNT COME FROM CLIs
            modified_flag: isModified }));
        return newRecipe;
    }
    // Update?
    // Delete?
    /**
     * PRE:CONDITION : needs to have correct recipe_contents_data
     * Fetch modified recipe
     * create new recipe contents obj
     * add it to the recipe version list
     * return it back
     * @param recipe
     * @param recipe_contents_data
     */
    createRecipeVersion(recipe, recipe_contents_data) {
        const new_version_number = recipe.recipe_versions.length;
        const recipe_contents = new this.contents_array(Object.assign(Object.assign({}, recipe_contents_data), { version_number: new_version_number }));
        recipe.recipe_versions.push(recipe_contents);
        return recipe;
    }
}
exports.RecipeModel = RecipeModel;
// /**
//  * Create A Modified Recipe for the cookbook
//  */
// public createModifiedRecipe(recipe_data: IRecipe, user_ID) {
//   // copy recipe data
//   const newModRecipe = new this.recipe({
//     userID: user_ID,
//     ...recipe_data,
//     modified_flag: true,
//   });
//   return newModRecipe;
// }
//# sourceMappingURL=RecipeModel.js.map