export interface IRecipeContents {
    user_ID: string;
    recipe_ID?: string; 
    cooking_duration: number;
    version_number: number;
    serving_size: number;
    ingredients: {
      ingredient_id?: string;
      name: string;
      unit: string;
      quantity: number;
    }[];
    directions: {
      step: string;
    }[];
    notes?: string;
  }