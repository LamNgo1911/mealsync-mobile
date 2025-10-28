import { Recipe } from "@/types/recipe";
import { apiSlice } from "../api/apiSlice";

// Request body types for generate recipes (matches backend API)
interface UserPreferenceForRecipe {
  dietaryRestrictions?: string;      // comma-separated string
  favoriteCuisines?: string;         // comma-separated string
  dislikedIngredients?: string;      // comma-separated string
}

interface GenerateRecipesBody {
  ingredients: string[];
  userPreference?: UserPreferenceForRecipe;
}

interface SaveRecipeBody {
  userId: string;
  recipeId: string;
}

interface PaginatedRecipesResponse {
  data: Recipe[];
  offset: number;
  limit: number;
  totalElements: number;
  hasNext: boolean;
}

interface TransformedPaginatedRecipesResponse {
  data: Recipe[];
  totalPages: number;
}

interface DetectIngredientsBody {
  textInput: string;
}

interface DetectIngredientsResponse {
  success: boolean;
  data: string[];
}

interface UnsaveRecipeBody {
  userId: string;
  recipeId: string;
}

export const recipeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateRecipes: builder.mutation<{ data: Recipe[] }, GenerateRecipesBody>({
      query: (body) => ({
        url: "/recipes/generate-recipes",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Recipe", id: "LIST" }],
    }),
    saveRecipe: builder.mutation<void, SaveRecipeBody>({
      query: (body) => ({
        url: "/recipes/save",
        method: "POST",
        body,
      }),
      // This assumes saving a recipe might affect user data (e.g., a list of saved recipes)
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
      ],
    }),
    createRecipe: builder.mutation<Recipe, Partial<Recipe>>({
      query: (body) => ({
        url: "/recipes",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Recipe", id: "LIST" }],
    }),
    getRecipeById: builder.query<Recipe, string>({
      query: (id) => `/recipes/${id}`,
      providesTags: (result, error, id) => [{ type: "Recipe", id }],
      transformResponse: (response: { data: Recipe }) => response.data,
    }),
    getRecipes: builder.query<
      TransformedPaginatedRecipesResponse,
      { page: number; limit: number; query?: string }
    >({
      query: ({ page = 1, limit = 10, query = "" }) => {
        const offset = (page - 1) * limit;
        const params = new URLSearchParams({
          offset: String(offset),
          limit: String(limit),
        });
        if (query) {
          params.append("query", query);
        }
        return `/recipes?${params.toString()}`;
      },
      transformResponse: (response: PaginatedRecipesResponse) => {
        return {
          data: response.data,
          totalPages: Math.ceil(response.totalElements / response.limit) || 1,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Recipe" as const,
                id,
              })),
              { type: "Recipe", id: "LIST" },
            ]
          : [{ type: "Recipe", id: "LIST" }],
    }),
    updateRecipe: builder.mutation<
      Recipe,
      Partial<Recipe> & Pick<Recipe, "id">
    >({
      query: ({ id, ...patch }) => ({
        url: `/recipes/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Recipe", id }],
    }),
    deleteRecipe: builder.mutation<void, string>({
      query: (id) => ({
        url: `/recipes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Recipe", id }],
    }),
    getSavedRecipes: builder.query<
      TransformedPaginatedRecipesResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => {
        const offset = (page - 1) * limit;
        const params = new URLSearchParams({
          offset: String(offset),
          limit: String(limit),
        });
        return `/saved?${params.toString()}`;
      },
      transformResponse: (response: PaginatedRecipesResponse) => {
        return {
          data: response.data,
          totalPages: Math.ceil(response.totalElements / response.limit) || 1,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Recipe" as const,
                id,
              })),
              { type: "Recipe", id: "SAVED_LIST" },
            ]
          : [{ type: "Recipe", id: "SAVED_LIST" }],
    }),
    detectIngredientsFromText: builder.mutation<DetectIngredientsResponse, DetectIngredientsBody>({
      query: (body) => ({
        url: "/recipes/detect-ingredients-from-text",
        method: "POST",
        body,
      }),
    }),
    unsaveRecipe: builder.mutation<void, UnsaveRecipeBody>({
      query: (body) => ({
        url: "/recipes/save",
        method: "DELETE",
        body,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
        { type: "Recipe", id: "SAVED_LIST" },
      ],
    }),
    getTodaysPicks: builder.query<{ data: Recipe[] }, void>({
      query: () => "/recipes/today-picks",
      providesTags: [{ type: "Recipe", id: "TODAY_PICKS" }],
    }),
    getRecentGeneratedRecipes: builder.query<{ data: Recipe[] }, { limit?: number }>({
      query: ({ limit = 6 }) => {
        const params = new URLSearchParams({
          limit: String(limit),
        });
        return `/recipes/recent?${params.toString()}`;
      },
      providesTags: [{ type: "Recipe", id: "RECENT" }],
    }),
  }),
});

export const {
  useGenerateRecipesMutation,
  useSaveRecipeMutation,
  useCreateRecipeMutation,
  useGetRecipeByIdQuery,
  useGetRecipesQuery,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useGetSavedRecipesQuery,
  useDetectIngredientsFromTextMutation,
  useUnsaveRecipeMutation,
  useGetTodaysPicksQuery,
  useGetRecentGeneratedRecipesQuery,
} = recipeApiSlice;

// Helper function to transform UserPreference to backend format
export function mapUserPreferenceForRecipe(
  userPreference?: {
    dietaryRestrictions?: string[];
    allergies?: string[];
    preferredCuisines?: string[];
  }
): UserPreferenceForRecipe | undefined {
  if (!userPreference) return undefined;

  return {
    dietaryRestrictions: userPreference.dietaryRestrictions?.join(", "),
    favoriteCuisines: userPreference.preferredCuisines?.join(", "),
    dislikedIngredients: userPreference.allergies?.join(", "),
  };
}
