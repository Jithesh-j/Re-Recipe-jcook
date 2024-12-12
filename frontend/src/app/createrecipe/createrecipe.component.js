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
exports.CreaterecipeComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
let CreaterecipeComponent = (() => {
    let _classDecorators = [(0, core_1.Component)({
            selector: 'app-createrecipe',
            templateUrl: './createrecipe.component.html',
            styleUrls: ['./createrecipe.component.css']
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CreaterecipeComponent = _classThis = class {
        /**
         * Constructs the CreaterecipeComponent and injects dependencies.
         * @param fb - Angular's FormBuilder service for reactive forms.
         * @param http - Angular's HttpClient service for HTTP requests.
         */
        constructor(fb, http) {
            this.fb = fb;
            this.http = http;
            /** Array of predefined categories for recipes */
            this.categories = ['breakfast', 'lunch', 'dinner', 'dessert', 'vegetarian', 'vegan', 'gluten-free'];
        }
        /**
         * Lifecycle hook that initializes the recipe creation form.
         */
        ngOnInit() {
            console.log('CreateRecipeComponent initialized');
            // Initialize the form group
            this.recipeForm = this.fb.group({
                recipe_name: ['', forms_1.Validators.required],
                category: ['', forms_1.Validators.required],
                cooking_duration: [null, [forms_1.Validators.required, forms_1.Validators.min(1), forms_1.Validators.pattern('^[0-9]+$')]],
                ingredients: this.fb.array([], this.minimumOneItemValidator), // Custom validator for at least one ingredient
                directions: this.fb.array([], this.minimumOneItemValidator), // Custom validator for at least one direction
                image_url: [''],
                is_visible: [false] // Checkbox for publishing
            });
        }
        /**
         * Getter for the `ingredients` FormArray.
         * @returns The FormArray containing all the ingredients.
         */
        get ingredients() {
            return this.recipeForm.get('ingredients');
        }
        /**
         * Getter for the `directions` FormArray.
         * @returns The FormArray containing all the directions.
         */
        get directions() {
            return this.recipeForm.get('directions');
        }
        /**
         * Custom validator to ensure the FormArray has at least one item.
         * @param control - The AbstractControl to validate.
         * @returns Null if valid, otherwise an object indicating the error.
         */
        minimumOneItemValidator(control) {
            return control.length > 0 ? null : { required: true };
        }
        /**
         * Adds a new ingredient to the `ingredients` FormArray.
         */
        addIngredient() {
            this.ingredients.push(this.fb.group({
                name: ['', forms_1.Validators.required],
                quantity: [null, [forms_1.Validators.required, forms_1.Validators.min(1)]],
                unit: ['', forms_1.Validators.required]
            }));
        }
        /**
         * Removes an ingredient at the specified index from the `ingredients` FormArray.
         * @param index - The index of the ingredient to remove.
         */
        removeIngredient(index) {
            this.ingredients.removeAt(index);
        }
        /**
         * Adds a new direction step to the `directions` FormArray.
         */
        addDirection() {
            this.directions.push(this.fb.group({
                step: ['', forms_1.Validators.required]
            }));
        }
        /**
         * Removes a direction step at the specified index from the `directions` FormArray.
         * @param index - The index of the direction to remove.
         */
        removeDirection(index) {
            this.directions.removeAt(index);
        }
        /**
         * Submits the form if it is valid. Sends a POST request to the API with the recipe data.
         */
        onSubmit() {
            if (this.recipeForm.valid) {
                console.log('Submitting Recipe:', this.recipeForm.value);
                this.http.post('/api/recipes', this.recipeForm.value).subscribe({
                    next: (response) => {
                        console.log('Recipe submitted successfully:', response);
                        this.recipeForm.reset();
                        this.ingredients.clear();
                        this.directions.clear();
                    },
                    error: (error) => {
                        console.error('Error submitting recipe:', error);
                    }
                });
            }
            else {
                console.error('Form is invalid');
            }
        }
        /**
         * Resets the form to its initial state and clears all ingredients and directions.
         */
        onReset() {
            console.log('onReset method called');
            // Reset the main form controls
            this.recipeForm.reset({
                recipe_name: '',
                category: '',
                cooking_duration: null,
                image_url: '',
                is_visible: false
            });
            // Clear the FormArrays (ingredients and directions)
            this.ingredients.clear();
            this.directions.clear();
        }
    };
    __setFunctionName(_classThis, "CreaterecipeComponent");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CreaterecipeComponent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CreaterecipeComponent = _classThis;
})();
exports.CreaterecipeComponent = CreaterecipeComponent;
//# sourceMappingURL=createrecipe.component.js.map