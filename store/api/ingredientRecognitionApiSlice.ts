import { apiSlice } from "../api/apiSlice";

export interface Ingredient {
  name: string;
  confidence?: number;
}

export interface DetectIngredientsResponse {
  data: string[]
  errors?: any;
}

export const ingredientRecognitionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    detectIngredients: builder.mutation<
      DetectIngredientsResponse,
      FormData
    >({
      query: (formData) => ({
        url: "/recipes/detect-ingredients",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useDetectIngredientsMutation } = ingredientRecognitionApiSlice;
