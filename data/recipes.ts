import { Recipe } from "../types/recipe";

// Mock data using the new Recipe model
const RECIPES: Recipe[] = [
  {
    id: "1",
    name: "Classic Margherita Pizza",
    ingredients: [
      { id: "ing1", name: "Pizza Dough", quantity: 1, unit: "ball" },
      { id: "ing2", name: "Tomato Sauce", quantity: 0.5, unit: "cup" },
      { id: "ing3", name: "Fresh Mozzarella", quantity: 125, unit: "g" },
      { id: "ing4", name: "Basil Leaves", quantity: 1, unit: "handful" },
    ],
    instructions: [
      "Preheat oven to 240°C (475°F).",
      "Roll out pizza dough on a floured surface.",
      "Spread tomato sauce over the dough.",
      "Top with mozzarella slices and fresh basil.",
      "Bake for 10-12 minutes until crust is golden and cheese is bubbly.",
    ],
    cuisine: "Italian",
    imageUrl:
      "https://images.unsplash.com/photo-1628294896516-344152572ee8?q=80&w=2970&auto=format&fit=crop",
    ingredientKey: "pizza",
    description:
      "A timeless Italian classic, the Margherita pizza is a simple yet delicious dish that highlights the flavors of fresh ingredients.",
    preparationTime: 15,
    cookingTime: 12,
    totalTime: 27,
    servings: 2,
    difficulty: "Easy",
    tags: ["Pizza", "Italian", "Vegetarian"],
    source: "AI",
    createdAt: "2023-10-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Spaghetti Carbonara",
    ingredients: [
      { id: "ing5", name: "Spaghetti", quantity: 200, unit: "g" },
      { id: "ing6", name: "Guanciale", quantity: 100, unit: "g" },
      { id: "ing7", name: "Eggs", quantity: 2, unit: "large" },
      { id: "ing8", name: "Pecorino Romano", quantity: 50, unit: "g" },
      { id: "ing9", name: "Black Pepper", quantity: 1, unit: "tsp" },
    ],
    instructions: [
      "Cook spaghetti according to package directions.",
      "While pasta cooks, fry guanciale until crisp.",
      "Whisk eggs and Pecorino cheese in a bowl.",
      "Drain pasta, reserving some pasta water.",
      "Combine pasta with guanciale, then add egg mixture, stirring quickly. Add pasta water if needed for creaminess.",
      "Season with black pepper.",
    ],
    cuisine: "Italian",
    imageUrl:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2970&auto=format&fit=crop",
    ingredientKey: "pasta",
    description:
      "A creamy and savory Roman pasta dish made with cured pork, eggs, and hard cheese.",
    preparationTime: 10,
    cookingTime: 15,
    totalTime: 25,
    servings: 2,
    difficulty: "Medium",
    tags: ["Pasta", "Italian", "Classic"],
    source: "AI",
    createdAt: "2023-10-02T11:00:00Z",
  },
  {
    id: "3",
    name: "Chicken Tikka Masala",
    ingredients: [
      { id: "ing10", name: "Chicken Breast", quantity: 500, unit: "g" },
      { id: "ing11", name: "Yogurt", quantity: 1, unit: "cup" },
      { id: "ing12", name: "Tikka Masala Paste", quantity: 2, unit: "tbsp" },
      { id: "ing13", name: "Tomato Puree", quantity: 400, unit: "g" },
      { id: "ing14", name: "Heavy Cream", quantity: 0.5, unit: "cup" },
    ],
    instructions: [
      "Marinate chicken in yogurt and tikka masala paste for at least 1 hour.",
      "Grill or pan-sear the chicken until cooked through.",
      "In a separate pan, simmer tomato puree.",
      "Add cooked chicken and heavy cream to the sauce.",
      "Simmer for 10 minutes and serve with rice.",
    ],
    cuisine: "Indian",
    imageUrl:
      "https://images.unsplash.com/photo-1628294896516-344152572ee8?q=80&w=2970&auto=format&fit=crop",
    ingredientKey: "chicken",
    description:
      "A popular Indian curry with grilled chicken chunks in a spiced, creamy tomato sauce.",
    preparationTime: 20,
    cookingTime: 25,
    totalTime: 45,
    servings: 4,
    difficulty: "Medium",
    tags: ["Curry", "Indian", "Chicken"],
    source: "AI",
    createdAt: "2023-10-03T12:00:00Z",
  },
  {
    id: "4",
    name: "Avocado Toast",
    ingredients: [
      { id: "ing15", name: "Sourdough Bread", quantity: 2, unit: "slices" },
      { id: "ing16", name: "Avocado", quantity: 1, unit: "large" },
      { id: "ing17", name: "Red Pepper Flakes", quantity: 0.25, unit: "tsp" },
      { id: "ing18", name: "Lemon Juice", quantity: 1, unit: "tsp" },
      { id: "ing19", name: "Salt", quantity: 1, unit: "pinch" },
    ],
    instructions: [
      "Toast the sourdough bread to your liking.",
      "Mash the avocado with lemon juice and salt.",
      "Spread the mashed avocado over the toast.",
      "Sprinkle with red pepper flakes.",
    ],
    cuisine: "American",
    imageUrl:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2970&auto=format&fit=crop",
    ingredientKey: "avocado",
    description: "A simple and nutritious breakfast or snack.",
    preparationTime: 5,
    cookingTime: 5,
    totalTime: 10,
    servings: 1,
    difficulty: "Easy",
    tags: ["Breakfast", "Vegetarian", "Healthy"],
    source: "AI",
    createdAt: "2023-10-04T08:00:00Z",
  },
  {
    id: "5",
    name: "Sushi Rolls (Maki)",
    ingredients: [
      { id: "ing20", name: "Sushi Rice", quantity: 2, unit: "cups" },
      { id: "ing21", name: "Nori Sheets", quantity: 4, unit: "sheets" },
      { id: "ing22", name: "Fresh Tuna", quantity: 150, unit: "g" },
      { id: "ing23", name: "Cucumber", quantity: 1, unit: "small" },
      { id: "ing24", name: "Soy Sauce", quantity: 1, unit: "for dipping" },
    ],
    instructions: [
      "Cook sushi rice and season with rice vinegar.",
      "Lay a nori sheet on a bamboo mat, shiny side down.",
      "Spread rice evenly over the nori.",
      "Place tuna and cucumber strips in the center.",
      "Roll tightly and slice into pieces.",
    ],
    cuisine: "Japanese",
    imageUrl:
      "https://images.unsplash.com/photo-1628294896516-344152572ee8?q=80&w=2970&auto=format&fit=crop",
    ingredientKey: "sushi",
    description:
      "Classic Japanese rolled sushi with fresh fish and vegetables.",
    preparationTime: 30,
    cookingTime: 20,
    totalTime: 50,
    servings: 2,
    difficulty: "Hard",
    tags: ["Sushi", "Japanese", "Seafood"],
    source: "AI",
    createdAt: "2023-10-05T13:00:00Z",
  },
  {
    id: "6",
    name: "Spicy Thai Green Curry",
    ingredients: [
      { id: "ing21", name: "Chicken Breast", quantity: 2, unit: "pieces" },
      { id: "ing22", name: "Green Curry Paste", quantity: 2, unit: "tbsp" },
      { id: "ing23", name: "Coconut Milk", quantity: 400, unit: "ml" },
      { id: "ing24", name: "Bamboo Shoots", quantity: 1, unit: "can" },
      { id: "ing25", name: "Thai Basil", quantity: 1, unit: "bunch" },
    ],
    instructions: [
      "Cut chicken into bite-sized pieces.",
      "In a large pot, heat the green curry paste until fragrant.",
      "Add the chicken and cook until browned.",
      "Pour in the coconut milk and bring to a simmer.",
      "Add bamboo shoots and cook for 5-7 minutes.",
      "Stir in Thai basil before serving.",
    ],
    cuisine: "Thai",
    imageUrl:
      "https://images.unsplash.com/photo-1628294896516-344152572ee8?q=80&w=2970&auto=format&fit=crop",
    ingredientKey: "curry",
    description:
      "A fragrant and spicy Thai green curry that is packed with flavor and quick to make.",
    preparationTime: 10,
    cookingTime: 20,
    totalTime: 30,
    servings: 4,
    difficulty: "Medium",
    tags: ["Thai", "Spicy", "Curry"],
    source: "AI",
    createdAt: "2023-10-06T18:00:00Z",
  },
  {
    id: "7",
    name: "Hearty Beef Stew",
    ingredients: [
      { id: "ing26", name: "Beef Chuck", quantity: 1, unit: "kg" },
      { id: "ing27", name: "Carrots", quantity: 3, unit: "large" },
      { id: "ing28", name: "Potatoes", quantity: 4, unit: "medium" },
      { id: "ing29", name: "Onion", quantity: 1, unit: "large" },
      { id: "ing30", name: "Beef Broth", quantity: 4, unit: "cups" },
    ],
    instructions: [
      "Sear the beef in a large pot until browned on all sides.",
      "Remove beef and sauté chopped onion, carrots, and potatoes.",
      "Return beef to the pot, add broth, and bring to a boil.",
      "Reduce heat, cover, and simmer for 2 hours until beef is tender.",
    ],
    cuisine: "American",
    imageUrl:
      "https://images.unsplash.com/photo-1628294896516-344152572ee8?q=80&w=2970&auto=format&fit=crop",
    ingredientKey: "beef",
    description:
      "A classic comfort food, this hearty beef stew is perfect for a cold day.",
    preparationTime: 20,
    cookingTime: 135,
    totalTime: 155,
    servings: 6,
    difficulty: "Easy",
    tags: ["Stew", "Beef", "Comfort Food"],
    source: "AI",
    createdAt: "2023-10-07T12:00:00Z",
  },
  {
    id: "8",
    name: "Vegan Lentil Soup",
    ingredients: [
      { id: "ing31", name: "Brown Lentils", quantity: 1, unit: "cup" },
      { id: "ing32", name: "Vegetable Broth", quantity: 6, unit: "cups" },
      { id: "ing33", name: "Diced Tomatoes", quantity: 1, unit: "can" },
      { id: "ing34", name: "Spinach", quantity: 2, unit: "cups" },
      { id: "ing35", name: "Cumin", quantity: 1, unit: "tsp" },
    ],
    instructions: [
      "Rinse lentils thoroughly.",
      "In a large pot, combine lentils, broth, and diced tomatoes.",
      "Bring to a boil, then simmer for 25-30 minutes until lentils are tender.",
      "Stir in spinach and cumin, and cook until spinach is wilted.",
    ],
    cuisine: "International",
    imageUrl:
      "https://images.unsplash.com/photo-1628294896516-344152572ee8?q=80&w=2970&auto=format&fit=crop",
    ingredientKey: "lentils",
    description:
      "A nutritious and filling vegan lentil soup that is easy to make and delicious.",
    preparationTime: 10,
    cookingTime: 35,
    totalTime: 45,
    servings: 4,
    difficulty: "Easy",
    tags: ["Vegan", "Soup", "Healthy"],
    source: "AI",
    createdAt: "2023-10-08T14:00:00Z",
  },
];

export function getExploreRecipes(): Recipe[] {
  return RECIPES;
}

export function getRecommendedRecipes(): Recipe[] {
  return RECIPES.slice(0, 3);
}

export function getSavedRecipes(): Recipe[] {
  // Return more recipes to demonstrate pagination
  return [
    RECIPES[3],
    RECIPES[4],
    RECIPES[5],
    RECIPES[6],
    RECIPES[7],
    RECIPES[0],
    RECIPES[1],
    RECIPES[2],
  ];
}

export function getRecipeById(id: string): Recipe | undefined {
  return RECIPES.find((recipe) => recipe.id === id);
}
