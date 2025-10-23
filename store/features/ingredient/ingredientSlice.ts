import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IngredientState {
  detectedIngredients: string[];
}

const initialState: IngredientState = {
  detectedIngredients: [],
};

const ingredientSlice = createSlice({
  name: "ingredient",
  initialState,
  reducers: {
    setDetectedIngredients: (state, action: PayloadAction<string[]>) => {
      state.detectedIngredients = action.payload;
    },
    clearDetectedIngredients: (state) => {
      state.detectedIngredients = [];
    },
  },
});

export const { setDetectedIngredients, clearDetectedIngredients } =
  ingredientSlice.actions;

export default ingredientSlice.reducer;
