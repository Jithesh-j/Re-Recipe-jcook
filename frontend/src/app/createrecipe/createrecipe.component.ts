import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RecipeservicesService } from '../../recipeservices.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-createrecipe',
  templateUrl: './createrecipe.component.html',
  styleUrls: ['./createrecipe.component.css']
})
export class CreaterecipeComponent implements OnInit {
  recipeForm!: FormGroup;
  categories: string[] = ['breakfast', 'lunch', 'dinner', 'dessert', 'vegetarian', 'vegan', 'gluten-free'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private recipeService: RecipeservicesService
  ) {}

  ngOnInit(): void {
    this.recipeForm = this.fb.group({
      recipe_name: ['', Validators.required],
      category: ['', Validators.required],
      cooking_duration: [null, [Validators.required, Validators.min(1), Validators.pattern('^[0-9]+$')]],
      serving_size: [null, [Validators.required, Validators.min(1)]],
      ingredients: this.fb.array([], this.minimumOneItemValidator),
      directions: this.fb.array([], this.minimumOneItemValidator),
      image_url: [''],
      is_visible: [false],
    });
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get directions(): FormArray {
    return this.recipeForm.get('directions') as FormArray;
  }

  minimumOneItemValidator(control: AbstractControl): { [key: string]: boolean } | null {
    return (control as FormArray).length > 0 ? null : { required: true };
  }

  addIngredient(): void {
    this.ingredients.push(
      this.fb.group({
        name: ['', Validators.required],
        quantity: [null, [Validators.required, Validators.min(0.1)]], // Allow decimals for quantities
        unit: ['', Validators.required]
      })
    );
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  addDirection(): void {
    this.directions.push(
      this.fb.group({
        step: ['', Validators.required]
      })
    );
  }

  removeDirection(index: number): void {
    this.directions.removeAt(index);
  }

  /**
   * Submits the recipe form using the RecipeservicesService
   */
  onSubmit(): void {
    if (this.recipeForm.valid) {
      const recipeData = {
        recipe_ID: uuidv4(),
        recipe_name: this.recipeForm.value.recipe_name,
        category: this.recipeForm.value.category,
        cooking_duration: this.recipeForm.value.cooking_duration,
        serving_size: this.recipeForm.value.serving_size,
        ingredients: this.recipeForm.value.ingredients,
        directions: this.recipeForm.value.directions,
        image_url: this.recipeForm.value.image_url,
        is_visible: this.recipeForm.value.is_visible,
        modified_flag: false,
        user_ID: 'placeholder-user-id', // Placeholder for authenticated user ID
        meal_category: [this.recipeForm.value.category],
        recipe_versions: [],
      };

      console.log('Submitting recipe data:', recipeData);

      this.recipeService.addRecipe(recipeData).subscribe({
        next: (response) => {
          console.log('Recipe added successfully:', response);
          this.onReset();
        },
        error: (error) => {
          console.error('Error adding recipe:', error);
        },
      });
    }
  }

  /**
   * Example of making a direct API call using HttpClient
   */
  makeDirectApiCall(): void {
    this.http.get('/api/some-other-endpoint').subscribe({
      next: (response) => {
        console.log('Direct API response:', response);
      },
      error: (error) => {
        console.error('Error during direct API call:', error);
      }
    });
  }

  onReset(): void {
    this.recipeForm.reset({
      recipe_name: '',
      category: '',
      cooking_duration: null,
      serving_size: null,
      image_url: '',
      is_visible: false
    });
    this.ingredients.clear();
    this.directions.clear();
  }
}
