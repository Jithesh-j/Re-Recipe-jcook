import { Component, OnInit } from '@angular/core';
import { RecipeservicesService } from '../../recipeservices.service';
import { IRecipe } from '../model/IRecipe';
@Component({
  selector: 'app-cookbook',
  templateUrl: './cookbook.component.html',
  styleUrls: ['./cookbook.component.css'],
})
export class CookbookComponent implements OnInit {
  recipeList: IRecipe[] = [];
  recipeList_1: IRecipe[] = [];
  loading: boolean = true;
  error: string | null = null;
  searchQuery: string = '';
  selectedCategory: string = '';
  maxCookingDuration: number | null = null;
  user_id: any;

  constructor(private recipeService: RecipeservicesService) {}

  ngOnInit(): void {
    this.getRecipes();

  }

  getRecipes(): void {
    this.recipeService.getAllCookbookRecipes().subscribe(
      (data) => {
        this.recipeList = data;
        console.log("cookbook HTML",this.recipeList)
        this.loading = false;
        console.log("Cookbook, recipeservice..... front", this.recipeList)
      },
      (error) => {
        this.error = 'Failed to load recipes.';
        this.loading = false;
      }
    );
  }



  get uniqueCategories(): string[] {
    const categories = this.recipeList.flatMap(
      (recipe) => recipe.meal_category || []
    );
    return Array.from(new Set(categories)).sort();
  }

  filteredRecipes(): IRecipe[] {
    return this.recipeList.filter((recipe) => {
      const matchesSearch = recipe.recipe_name
        ?.toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory
        ? recipe.meal_category?.some(
            (category) => category === this.selectedCategory
          )
        : true;

      return matchesSearch && matchesCategory;
    });
  } 
}