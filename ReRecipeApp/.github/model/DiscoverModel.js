"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.DiscoverModel = void 0;
var mongoose = require("mongoose");
var RecipeModel_1 = require("./RecipeModel");
var DiscoverModel = /** @class */ (function () {
    /**
     * Constructor to initialize the database connection and set up the schema and model.
     * @param DB_CONNECTION_STRING - Connection string for MongoDB.
     */
    function DiscoverModel(DB_CONNECTION_STRING) {
        this.recipeModel = new RecipeModel_1.RecipeModel();
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
    }
    /**
     * Creates the Mongoose schema for a recipe.
     * Defines the structure for `recipe_ID`, `recipeName`, `category`, etc.
     */
    DiscoverModel.prototype.createSchema = function () {
        this.schema = new mongoose.Schema({
            recipeList: [
                { type: mongoose.Schema.Types.ObjectId, ref: "RecipeModel" },
            ]
        }, { collection: "discover" });
    };
    /**
     * Connects to the MongoDB database and creates the Mongoose model based on the schema.
     * The model is stored in `this.model`.
     */
    DiscoverModel.prototype.createModel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, mongoose.connect(this.dbConnectionString)];
                    case 1:
                        _a.sent();
                        this.model = mongoose.model("Discover", this.schema);
                        console.log("Connected to MongoDB and initialized Discover model.");
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        console.error("Error connecting to MongoDB or initializing Discover model:");
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // /**
    //  * Adds a new recipe to the database.
    //  * @param response - The response object to send data back to the client.
    //  * @param newRecipeData - The new recipe data from the user.
    //  */
    // public async createRecipe(response: any, newRecipeData: IRecipe) {
    //   try {
    //     // Create a new Mongoose document
    //     // const newRecipe = new this.model(newRecipeData);
    //     const newRecipe = this.recipeModel.createRecipe(newRecipeData);
    //     // Save the document to the database
    //     const savedRecipe = await newRecipe.save();
    //     //const savedRecipe = await this.recipeModel.createRecipe(newRecipeData);
    //     // Send the saved recipe as the response
    //     response.status(201).json(savedRecipe);
    //   } catch (e) {
    //     console.error("Failed to create new recipe:", e);
    //     response.status(500).json({ error: "Failed to create new recipe" });
    //   }
    // }
    /**
     * Creates a new recipe and adds it to the Discover collection.
     * @param recipeData - Data for the new recipe.
     */
    DiscoverModel.prototype.createRecipe = function (response, recipeData) {
        return __awaiter(this, void 0, void 0, function () {
            var newRecipe, savedRecipe, discoverEntry, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.recipeModel.createRecipe(recipeData)];
                    case 1:
                        newRecipe = _a.sent();
                        return [4 /*yield*/, newRecipe.save()];
                    case 2:
                        savedRecipe = _a.sent();
                        return [4 /*yield*/, this.model.findOneAndUpdate({}, // Assumes there's one document in the Discover collection. Adjust as needed.
                            { $push: { recipeList: savedRecipe._id } }, { upsert: true, "new": true })];
                    case 3:
                        discoverEntry = _a.sent();
                        console.log("Recipe added to Discover:", discoverEntry);
                        response.status(201).json(savedRecipe);
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error("Error adding recipe to Discover:", error_1);
                        response.status(500).json({ error: "Failed to create new recipe" });
                        throw error_1;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves all recipes from the database.
     * @param response - The response object to send data back to the client.
     */
    DiscoverModel.prototype.retrieveAllRecipes = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var itemArray, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.find({}).exec()];
                    case 1:
                        itemArray = _a.sent();
                        response.json(itemArray);
                        return [3 /*break*/, 3];
                    case 2:
                        e_2 = _a.sent();
                        console.error("Failed to retrieve recipes:", e_2);
                        response.status(500).json({ error: "Failed to retrieve recipes" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves a single recipe by `recipe_ID`.
     * @param response - The response object to send data back to the client.
     * @param recipe_ID - The unique ID of the recipe to retrieve.
     */
    DiscoverModel.prototype.retrieveRecipe = function (response, recipe_ID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.findOne({ recipe_ID: recipe_ID }).exec()];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            response.json(result);
                        }
                        else {
                            response.status(404).json({ error: "Recipe not found" });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _a.sent();
                        console.error("Failed to retrieve recipe:", e_3);
                        response.status(500).json({ error: "Failed to retrieve recipe" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Counts and retrieves the total number of recipes in the database.
     * @param response - The response object to send data back to the client.
     */
    DiscoverModel.prototype.retrieveRecipeListCount = function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var numberOfRecipes, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.estimatedDocumentCount().exec()];
                    case 1:
                        numberOfRecipes = _a.sent();
                        response.json({ count: numberOfRecipes });
                        return [3 /*break*/, 3];
                    case 2:
                        e_4 = _a.sent();
                        console.error("Failed to retrieve recipe count:", e_4);
                        response.status(500).json({ error: "Failed to retrieve recipe count" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // BEN: I DONT THINK THESE NEED TO EXIST
    /**
     * Deletes a recipe by its `recipe_ID`.
     * @param response - The response object to send data back to the client.
     * @param recipe_ID - The unique ID of the recipe to delete.
     */
    DiscoverModel.prototype.deleteRecipe = function (response, recipe_ID) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model.deleteOne({ recipe_ID: recipe_ID }).exec()];
                    case 1:
                        result = _a.sent();
                        if (result.deletedCount && result.deletedCount > 0) {
                            response.json({
                                message: "Recipe ".concat(recipe_ID, " deleted successfully."),
                                result: result
                            });
                        }
                        else {
                            response.status(404).json({ error: "Recipe not found" });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_5 = _a.sent();
                        console.error("Failed to delete recipe:", e_5);
                        response.status(500).json({ error: "Failed to delete recipe" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // /**
    //  * Updates the `directions` of a recipe by `recipe_ID`.
    //  * @param response - The response object to send data back to the client.
    //  * @param recipe_ID - The unique ID of the recipe to update.
    //  * @param directions - An array of objects containing the new steps for directions.
    //  */
    // public async updateDirections(
    //   response: any,
    //   recipe_ID: string,
    //   directions: { step: string }[]
    // ) {
    //   try {
    //     const result = await this.model
    //       .findOneAndUpdate(
    //         { recipe_ID },
    //         { $set: { directions } },
    //         { new: true, runValidators: true }
    //       )
    //       .exec();
    //     if (result) {
    //       response.json(result);
    //     } else {
    //       response.status(404).json({ error: "Recipe not found" });
    //     }
    //   } catch (e) {
    //     console.error("Failed to update directions:", e);
    //     response.status(500).json({ error: "Failed to update directions" });
    //   }
    // }
    // /**
    //  * Updates the `ingredients` of a recipe by `recipe_ID`.
    //  * @param response - The response object to send data back to the client.
    //  * @param recipe_ID - The unique ID of the recipe to update.
    //  * @param ingredients - An array of objects containing `name`, `quantity`, and `unit` for each ingredient.
    //  */
    // public async updateIngredients(
    //   response: any,
    //   recipe_ID: string,
    //   ingredients: { name: string; quantity: number; unit: string }[]
    // ) {
    //   try {
    //     const result = await this.model
    //       .findOneAndUpdate(
    //         { recipe_ID },
    //         { $set: { ingredients } },
    //         { new: true, runValidators: true }
    //       )
    //       .exec();
    //     if (result) {
    //       response.json(result);
    //     } else {
    //       response.status(404).json({ error: "Recipe not found" });
    //     }
    //   } catch (e) {
    //     console.error("Failed to update ingredients:", e);
    //     response.status(500).json({ error: "Failed to update ingredients" });
    //   }
    // }
    /**
     * Updates the `image_url` of a recipe by `recipe_ID`.
     * @param response - The response object to send data back to the client.
     * @param recipe_ID - The unique ID of the recipe to update.
     * @param image_url - The new image URL for the recipe.
     */
    DiscoverModel.prototype.updateImageUrl = function (response, recipe_ID, image_url) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model
                                .findOneAndUpdate({ recipe_ID: recipe_ID }, { $set: { image_url: image_url } }, { "new": true, runValidators: true })
                                .exec()];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            response.json(result);
                        }
                        else {
                            response.status(404).json({ error: "Recipe not found" });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_6 = _a.sent();
                        console.error("Failed to update image URL:", e_6);
                        response.status(500).json({ error: "Failed to update image URL" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Updates the `isVisible` field of a recipe by `recipe_ID`.
     * @param response - The response object to send data back to the client.
     * @param recipe_ID - The unique ID of the recipe to update.
     * @param is_visible
     */
    DiscoverModel.prototype.updateVisibility = function (response, recipe_ID, is_visible) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model
                                .findOneAndUpdate({ recipe_ID: recipe_ID }, { $set: { is_visible: is_visible } }, { "new": true, runValidators: true })
                                .exec()];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            response.json(result);
                        }
                        else {
                            response.status(404).json({ error: "Recipe not found" });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        e_7 = _a.sent();
                        console.error("Failed to update visibility:", e_7);
                        response.status(500).json({ error: "Failed to update visibility" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return DiscoverModel;
}());
exports.DiscoverModel = DiscoverModel;
