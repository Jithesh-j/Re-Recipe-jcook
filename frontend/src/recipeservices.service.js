"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeservicesService = void 0;
const core_1 = require("@angular/core");
let RecipeservicesService = (() => {
    let _classDecorators = [(0, core_1.Injectable)({
            providedIn: 'root',
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RecipeservicesService = _classThis = class {
        constructor(http) {
            this.http = http;
            this.hostUrl = 'http://localhost:8080/app/';
        }
        /**
         * ============================
         * Recipe CRUD Operations
         * ============================
         * These methods handle the main CRUD operations for recipe data,
         * including creating, reading, updating, and deleting recipes.
         */
        /**
         * Retrieves all recipes from the backend database.
         * @returns An Observable that emits an array of IRecipe objects.
         */
        getRecipes() {
            return this.http.get(`${this.hostUrl}discover`);
        }
        getRecipeContent() {
            return this.http.get(`${this.hostUrl}discover`);
        }
        /**
         * Retrieves a single recipe by its unique ID.
         * @param recipeID - The ID of the recipe to be retrieved.
         * @returns An Observable that emits the IRecipe object corresponding to the
         *          provided ID.
         */
        getRecipeByID(recipeID) {
            return this.http.get(`${this.hostUrl}discover/${recipeID}`);
        }
        getRecipeContentByID(recipeID) {
            return this.http.get(`${this.hostUrl}discover/${recipeID}`);
        }
        /**
         * Updates an existing recipe with new data.
         * @param recipeID - The ID of the recipe to be updated.
         * @param recipe - The updated IRecipe object containing new recipe data.
         * @returns An Observable that emits the updated IRecipe object.
         */
        updateRecipe(recipeID, recipe) {
            return this.http.put(`${this.hostUrl}recipes/${recipeID}`, recipe);
        }
        /**
         * Adds a new recipe to the backend database.
         * @param recipe - The IRecipe object containing the details of the new
         *                 recipe.
         * @returns An Observable that emits the newly created IRecipe object.
         */
        addRecipe(recipe) {
            return this.http.post(`${this.hostUrl}discover`, recipe);
        }
        /**
         * Deletes a recipe from the backend database.
         * @param recipeID - The ID of the recipe to be deleted.
         * @returns An Observable that completes when the recipe is successfully
         *          deleted.
         */
        deleteRecipe(recipeID) {
            return this.http.delete(`${this.hostUrl}discover/${recipeID}`);
        }
        // /**
        //  * Updates the directions of a recipe.
        //  * @param recipeID - The ID of the recipe to be updated.
        //  * @param directions - An array of strings representing the new directions.
        //  * @returns An Observable that emits the updated IRecipe object.
        //  */
        // updateRecipeDirections(
        //   recipeID: string,
        //   directions: string[]
        // ): Observable<IRecipe> {
        //   return this.http.put<IRecipe>(
        //     `${this.hostUrl}recipes/${recipeID}/directions`,
        //     { directions }
        //   );
        // }
        // /**
        //  * Updates the ingredients of a recipe.
        //  * @param recipeID - The ID of the recipe to be updated.
        //  * @param ingredients - An array of objects containing `name`, `quantity`,
        //  *                      and `unit` for each ingredient.
        //  * @returns An Observable that emits the updated IRecipe object.
        //  */
        // updateRecipeIngredients(
        //   recipeID: string,
        //   ingredients: { name: string; quantity: number; unit: string }[]
        // ): Observable<IRecipe> {
        //   return this.http.put<IRecipe>(
        //     `${this.hostUrl}recipes/${recipeID}/ingredients`,
        //     { ingredients }
        //   );
        // }
        // /**
        //  * Updates the image URL of a recipe.
        //  * @param recipeID - The ID of the recipe to be updated.
        //  * @param imageUrl - The new image URL for the recipe.
        //  * @returns An Observable that emits the updated IRecipe object.
        //  */
        // updateRecipeImageUrl(
        //   recipeID: string,
        //   imageUrl: string
        // ): Observable<IRecipe> {
        //   return this.http.put<IRecipe>(
        //     `${this.hostUrl}recipes/${recipeID}/imageUrl`,
        //     { imageUrl }
        //   );
        // }
        /**
         * Updates the visibility status of a recipe.
         * @param recipeID - The ID of the recipe to be updated.
         * @param isVisible - A boolean indicating whether the recipe is visible or not.
         * @returns An Observable that emits the updated IRecipe object.
         */
        updateRecipeVisibility(recipeID, isVisible) {
            return this.http.put(`${this.hostUrl}discover/${recipeID}/visibility`, { isVisible });
        }
        /**
         * ============================
         * Cookbook-Specific Operations
         * ============================
         * These methods are specifically for managing recipes in the user's
         * cookbook.
         */
        /**
         * Retrieves all recipes from the user's cookbook in the backend database.
         * @param userId - The ID of the user whose cookbook recipes are to be
         *                 retrieved.
         * @returns An Observable that emits an array of IRecipe objects from the
         *          user's cookbook.
         */
        getAllCookbookRecipes(userId) {
            return this.http.get(`${this.hostUrl}listAllRecipes/${userId}`);
        }
        /**
         * Adds selected recipes to the user's cookbook in the backend database.
         * @param userId - The ID of the user whose cookbook is being updated.
         * @param recipeIds - An array of recipe IDs to be added to the cookbook.
         * @returns An Observable that emits the response from the backend.
         */
        addRecipesToCookbook(userId, recipeIds) {
            return this.http.post(`${this.hostUrl}cookbooks/${userId}`, { recipeIds });
        }
    };
    __setFunctionName(_classThis, "RecipeservicesService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RecipeservicesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RecipeservicesService = _classThis;
})();
exports.RecipeservicesService = RecipeservicesService;
//# sourceMappingURL=recipeservices.service.js.map