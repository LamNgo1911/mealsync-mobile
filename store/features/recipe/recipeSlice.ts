import { Recipe } from "@/types/recipe";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RecipeState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
}

const initialState: RecipeState = {
  recipes: [],
  currentRecipe: null,
};

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      state.recipes = action.payload;
    },
    setCurrentRecipe: (state, action: PayloadAction<Recipe | null>) => {
      state.currentRecipe = action.payload;
    },
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
    },
  },
});

export const { setRecipes, setCurrentRecipe, clearCurrentRecipe } =
  recipeSlice.actions;

export default recipeSlice.reducer;
