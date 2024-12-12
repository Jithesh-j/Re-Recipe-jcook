"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
            title: { type: String, "default": "My Cookbook" },
            modified_recipes: [
                { type: mongoose.Schema.Types.ObjectId, ref: "RecipeModel" },
            ]
        }, { collection: "cookbooks" });
    };
    /**
     * Connects to the MongoDB database and creates the Mongoose model based on the schema.
     */
    CookbookModel.prototype.createModel = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, mongoose.connect(this.dbConnectionString)];
                    case 1:
                        _a.sent();
                        this.model = mongoose.model("Cookbook", this.schema);
                        console.log("Connected to MongoDB and created Cookbook model.");
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error creating model:", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
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
    CookbookModel.prototype.copyRecipeFromDiscover = function (response, recipe_ID, user_ID) {
        return __awaiter(this, void 0, void 0, function () {
            var originalRecipe, newRecipeData, recipeModelInstance, newRecipe, cookbook, savedCookbook, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.discoverModel.model
                                .findOne({ _id: recipe_ID })
                                .exec()];
                    case 1:
                        originalRecipe = _a.sent();
                        if (!originalRecipe) {
                            return [2 /*return*/, response
                                    .status(404)
                                    .json({ error: "Recipe not found in Discover!" })];
                        }
                        newRecipeData = __assign(__assign({}, originalRecipe.toObject()), { user_ID: user_ID, isModified: true });
                        recipeModelInstance = new RecipeModel_1.RecipeModel();
                        newRecipe = new recipeModelInstance.recipe(newRecipeData);
                        return [4 /*yield*/, newRecipe.save()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.model.findOne({ user_ID: user_ID }).exec()];
                    case 3:
                        cookbook = _a.sent();
                        if (!cookbook) {
                            cookbook = new this.model({
                                user_ID: user_ID,
                                modified_recipes: [newRecipe._id]
                            });
                        }
                        else {
                            cookbook.modified_recipes.push(newRecipe._id);
                        }
                        return [4 /*yield*/, cookbook.save()];
                    case 4:
                        savedCookbook = _a.sent();
                        response.status(201).json(savedCookbook);
                        return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.error("Failed to copy recipe from Discover:", error_2);
                        response
                            .status(500)
                            .json({ error: "Failed to copy recipe from Discover" });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
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
                            message: "Modified recipe with ID ".concat(recipeId, " deleted successfully.")
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
    /**
     * Retrieves a single modified recipe with the first and most recent versions.
     * @param {any} response - The response object to send data back to the client.
     * @param {string} userId - The ID of the user.
     * @param {string} recipeId - The ID of the recipe to retrieve.
     * @returns {Promise<void>}
     */
    CookbookModel.prototype.getSingleRecipeWithVersions = function (response, userId, recipeId) {
        return __awaiter(this, void 0, void 0, function () {
            var cookbook, recipe, versions, firstVersion, mostRecentVersion, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model
                                .findOne({ user_ID: userId }, { modified_recipes: 1 })
                                .populate("modified_recipes")
                                .exec()];
                    case 1:
                        cookbook = _a.sent();
                        if (!cookbook) {
                            return [2 /*return*/, response.status(404).json({ error: "Cookbook not found" })];
                        }
                        recipe = cookbook.modified_recipes.find(function (r) { return r._id.toString() === recipeId; });
                        if (!recipe) {
                            return [2 /*return*/, response.status(404).json({ error: "Recipe not found" })];
                        }
                        versions = recipe.versions || [];
                        firstVersion = versions[0];
                        mostRecentVersion = versions[versions.length - 1];
                        response.json({
                            recipe: __assign(__assign({}, recipe.toObject()), { versions: [firstVersion, mostRecentVersion].filter(Boolean) })
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error("Failed to retrieve recipe:", error_4);
                        response.status(500).json({ error: "Failed to retrieve recipe" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
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
            var result, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model
                                .findOneAndUpdate({ user_ID: userId, "modified_recipes._id": recipeId }, { $push: { "modified_recipes.$.versions": versionData } }, { "new": true })
                                .exec()];
                    case 1:
                        result = _a.sent();
                        response.json(result);
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        console.error("Failed to add recipe version:", error_5);
                        response.status(500).json({ error: "Failed to add recipe version" });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieves specific versions of a recipe.
     * @param {any} response - The response object to send data back to the client.
     * @param {string} userId - The ID of the user.
     * @param {string} recipeId - The ID of the recipe to retrieve versions for.
     * @param {number} [versionNumber] - The specific version number to retrieve, if provided.
     * @returns {Promise<void>}
     */
    CookbookModel.prototype.retrieveRecipeVersion = function (response, userId, recipeId, versionNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var cookbook, recipe, versions, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model
                                .findOne({ user_ID: userId, "modified_recipes._id": recipeId })
                                .exec()];
                    case 1:
                        cookbook = _a.sent();
                        recipe = cookbook === null || cookbook === void 0 ? void 0 : cookbook.modified_recipes.find(function (r) { return r._id.toString() === recipeId; });
                        if (recipe) {
                            versions = versionNumber
                                ? recipe.versions.filter(function (v) { return v.version_number === versionNumber; })
                                : recipe.versions;
                            response.json(versions);
                        }
                        else {
                            response.status(404).json({ error: "Recipe not found" });
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error("Failed to retrieve recipe version:", error_6);
                        response.status(500).json({ error: "Failed to retrieve recipe version" });
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
            var updateQuery, result, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        updateQuery = versionNumber
                            ? {
                                $pull: {
                                    "modified_recipes.$.versions": { version_number: versionNumber }
                                }
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
                            result: result
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        error_7 = _a.sent();
                        console.error("Failed to remove recipe/version:", error_7);
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
    CookbookModel.prototype.listAllRecipes = function (response, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var cookbook, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.model
                                .findOne({ user_ID: userId })
                                .populate("modified_recipes")
                                .exec()];
                    case 1:
                        cookbook = _a.sent();
                        if (!cookbook || cookbook.modified_recipes.length === 0) {
                            return [2 /*return*/, response
                                    .status(404)
                                    .json({ error: "No recipes found in the user's cookbook." })];
                        }
                        // Return all recipes in the cookbook
                        response.json(cookbook.modified_recipes);
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        console.error("Failed to retrieve all recipes in the cookbook:", error_8);
                        response.status(500).json({ error: "Failed to retrieve recipes." });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return CookbookModel;
}());
exports.CookbookModel = CookbookModel;
