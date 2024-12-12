import { IRecipeContents } from './IRecipeContents'; 

export enum MealCategory {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Snack = 'Snack',
  Dessert = 'Dessert'
}

export interface IRecipe {
  modified_flag: boolean;          
  user_ID: string;                
  recipe_ID: string;              
  recipe_name: string;            
  meal_category: MealCategory[];  
  recipe_versions: IRecipeContents[];
  image_url?: string;  
         
  is_visible?: boolean;           
}