export interface RecipeIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  description?: string;
}

export interface Recipe {
  id: string; // UUID
  name: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  cuisine: string;
  imageUrl: string;
  ingredientKey: string;
  description: string;
  preparationTime: number; // Integer
  cookingTime: number; // Integer
  totalTime: number; // Integer
  servings: number; // Integer
  difficulty: string;
  tags: string[];
  source: string;
  createdAt: string; // Instant -> string (ISO 8601)
  updatedAt?: string; // Instant -> string (ISO 8601)
}
