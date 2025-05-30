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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookbookModel = void 0;
var mongoose = require("mongoose");
var RecipeModel_1 = require("./RecipeModel");
var CookbookModel = /** @class */ (function () {
    /**
     * Constructor to initialize the database connection and set up the schema and model.
     * @param {string} DB_CONNECTION_STRING - MongoDB connection string.
     */
    function CookbookModel(DB_CONNECTION_STRING, discoverModel) {
        this.dbConnectionString = DB_CONNECTION_STRING;
        this.createSchema();
        this.createModel();
        this.discoverModel = discoverModel;
        this.recipeModel = new RecipeModel_1.RecipeModel();
    }
    /**
     * Defines the schema for a cookbook with a user reference and arrays for modified and saved recipes.
     */
    CookbookModel.prototype.createSchema = function () {
        this.schema = new mongoose.Schema({
            user_ID: { type: String, required: true, unique: true },
            title: { type: String, default: "My Cookbook" },
            modified_recipes: {
                type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
                default: [],
            },
        }, { collection: "cookbooks", timestamps: true });
    };
    /**
     * Connects to the MongoDB database and creates the Mongoose model based on the schema.
     */
    CookbookModel.prototype.createModel = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    if (!mongoose.models.Cookbook) {
                        this.model = mongoose.model("Cookbook", this.schema); // Define the model if it doesn't exist
                        console.log("Created Cookbook model.");
                    }
                    else {
                        this.model = mongoose.models.Cookbook; // Use the existing model
                        console.log("Using existing Cookbook model.");
                    }
                }
                catch (error) {
                    console.error("Error creating Cookbook model:", error);
                }
                return [2 /*return*/];
            });
        });
    };
    CookbookModel.prototype.createCookbook = function (user_Id_1) {
        return __awaiter(this, arguments, void 0, function (user_Id, title) {
            var existingCookbook, newCookbook, error_1;
            if (title === void 0) { title = "myCookbook"; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.model.findOne({ user_ID: user_Id }).exec()];
                    case 1:
                        existingCookbook = _a.sent();
                        // Exit if a cookbook already exists
                        if (existingCookbook) {
                            console.log("Cookbook already exists for user: ".concat(user_Id));
                            return [2 /*return*/];
                        }
                        newCookbook = new this.model({
                            user_ID: user_Id,
                            title: title,
                            recipes: [],
                        });
                        return [4 /*yield*/, newCookbook.save()];
                    case 2:
                        _a.sent();
                        console.log("Cookbook \"".concat(title, "\" created for user: ").concat(user_Id));
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Error creating cookbook:", error_1);
                        throw new Error("Cookbook creation failed.");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Copies a recipe from the Discover collection and adds it to the user's cookbook.
     * @param {any} response - The response object to send data back to the client.
     * @param {string} recipe_ID - The ID of the recipe to copy from Discover.
     * @param {string} user_ID - The ID of the user to whom the new recipe will belong.
     * @returns {Promise<void>}
     */
    CookbookModel.prototype.copyRecipesFromDiscover = function (response, recipe_IDs, user_id) {
        return __awaiter(this, void 0, void 0, function () {
            var mongoose_1, ObjectId, discoverCollection, objectIdRecipeIDs, originalRecipes, filter, update, userCookbook, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Entering copyRecipesFromDiscover");
                        console.log("Recipids, in the copydiscover model", recipe_IDs);
                        console.log("user_id, in the copydiscover model", user_id);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        mongoose_1 = require('mongoose');
                        mongoose_1.set('debug', true); // Logs all Mongoose operations
                        ObjectId = require("mongoose").Types.ObjectId;
                        discoverCollection = mongoose_1.connection.collection("discover");
                        objectIdRecipeIDs = recipe_IDs.map(function (id) { return new ObjectId(id); });
                        console.log("converting to object.......", objectIdRecipeIDs);
                        return [4 /*yield*/, discoverCollection
                                .find({ recipe_ID: { $in: objectIdRecipeIDs } })
                                .toArray()];
                    case 2:
                        originalRecipes = _a.sent();
                        console.log("originalRecipes.....", originalRecipes);
                        if (!originalRecipes || originalRecipes.length === 0) {
                            console.log("Sending 404 response from copyRecipesFromDiscover");
                            return [2 /*return*/, response.status(404).json({
                                    error: "No recipes found in Discover with the provided IDs!",
                                })];
                        }
                        filter = { user_ID: user_id };
                        console.log("filtere.....", filter);
                        update = {
                            $push: {
                                modified_recipes: {
                                    $each: originalRecipes.map(function (recipe) { return recipe.recipe_ID; }), // Push only ObjectId instances
                                },
                            },
                        };
                        return [4 /*yield*/, this.model.findOneAndUpdate(filter, update, { new: true })];
                    case 3:
                        userCookbook = _a.sent();
                        console.log("Sending response from copyRecipesFromDiscover");
                        console.log("Sending response from copyRecipesFromDiscover", userCookbook);
                        return [2 /*return*/, response.status(200).json(userCookbook)];
                    case 4:
                        error_2 = _a.sent();
                        console.error("Error in copyRecipesFromDiscover:", error_2);
                        console.log("Sending error response from copyRecipesFromDiscover");
                        return [2 /*return*/, response.status(500).json({ error: "Failed to copy recipes from Discover" })];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes a recipe from the user's cookbook.
     * @param {any} response - The response object to send data back to the client.
     * @param {string} userId - The ID of the user.
     * @param {string} recipeId - The ID of the recipe to remove.
     * @returns {Promise<void>}
     */
    CookbookModel.prototype.removeRecipeFromCookbook = function (response, userId, recipeId) {
        return __awaiter(this, void 0, void 0, function () {
            var cookbook, recipeIndex, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.model.findOne({ user_ID: userId }).exec()];
                    case 1:
                        cookbook = _a.sent();
                        if (!cookbook) {
                            return [2 /*return*/, response.status(404).json({ error: "Cookbook not found" })];
                        }
                        recipeIndex = cookbook.modified_recipes.findIndex(function (id) { return id.toString() === recipeId; });
                        if (recipeIndex === -1) {
                            return [2 /*return*/, response
                                    .status(404)
                                    .json({ error: "Recipe not found in cookbook" })];
                        }
                        cookbook.modified_recipes.splice(recipeIndex, 1);
                        return [4 /*yield*/, cookbook.save()];
                    case 2:
                        _a.sent();
                        response.json({
                            message: "Modified recipe with ID ".concat(recipeId, " deleted successfully."),
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.error("Failed to remove recipe from the cookbook:", error_3);
                        response
                            .status(500)
                            .json({ error: "Failed to remove recipe from cookbook" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // ############################### above is fixed
    /**
     * Adds a new version to an existing recipe in the user's cookbook.
     * @param {any} response - The response object to send data back to the client.
     * @param {string} userId - The ID of the user.
     * @param {string} recipeId - The ID of the recipe to add a new version to.
     * @param {any} versionData - The data for the new version to add.
     * @returns {Promise<void>}
     */
    CookbookModel.prototype.addRecipeVersion = function (response, userId, recipeId, versionData) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model
                                .findOneAndUpdate({ user_ID: userId, "modified_recipes._id": recipeId }, { $push: { "modified_recipes.$.versions": versionData } }, { new: true })
                                .exec()];
                    case 1:
                        result = _a.sent();
                        response.json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error("Failed to add recipe version:", error_4);
                        response.status(500).json({ error: "Failed to add recipe version" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Removes a version or the entire recipe.
     * @param {any} response - The response object to send data back to the client.
     * @param {string} userId - The ID of the user.
     * @param {string} recipeId - The ID of the recipe to remove.
     * @param {number} [versionNumber] - The specific version number to remove, if provided.
     * @returns {Promise<void>}
     */
    CookbookModel.prototype.removeRecipeVersion = function (response, userId, recipeId, versionNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var updateQuery, result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        updateQuery = versionNumber
                            ? {
                                $pull: {
                                    "modified_recipes.$.versions": { version_number: versionNumber },
                                },
                            }
                            : { $pull: { modified_recipes: { _id: recipeId } } };
                        return [4 /*yield*/, this.model
                                .updateOne({ user_ID: userId }, updateQuery)
                                .exec()];
                    case 1:
                        result = _a.sent();
                        response.json({
                            message: versionNumber
                                ? "Version ".concat(versionNumber, " removed from recipe ").concat(recipeId)
                                : "Recipe ".concat(recipeId, " and all versions removed"),
                            result: result,
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error("Failed to remove recipe/version:", error_5);
                        response.status(500).json({ error: "Failed to remove recipe/version" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Retrieves all recipes from a user's cookbook.
    * @param {any} response - The response object to send data back to the client.
    * @param {string} userId - The ID of the user whose cookbook is being retrieved.
    * @returns {Promise<void>}
    */
    CookbookModel.prototype.getAllCookbookRecipes = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var cookbook, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("userid in get all cookbooks", userId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.model
                                .findOne({ user_ID: userId })
                                .populate("modified_recipes")
                                .lean() // Add lean() to get plain JavaScript objects
                                .exec()];
                    case 2:
                        cookbook = _a.sent();
                        console.log("Cookbook query complete:");
                        console.log("Cookbook:", cookbook);
                        console.log("Modified Recipes:", cookbook === null || cookbook === void 0 ? void 0 : cookbook.modified_recipes);
                        // If the cookbook doesn't exist, send an empty array
                        if (!cookbook) {
                            console.log("Cookbook not found. Sending empty array.");
                            return [2 /*return*/, []];
                        }
                        console.log("cookbook response!!!!!!!!!!!!!", cookbook.modified_recipes);
                        // Return all recipes in the cookbook (could be empty)
                        console.log("Sending modified recipes as response:");
                        return [2 /*return*/, cookbook.modified_recipes || []];
                    case 3:
                        error_6 = _a.sent();
                        console.error("Failed to retrieve all recipes in the cookbook:", error_6);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return CookbookModel;
}());
exports.CookbookModel = CookbookModel;
