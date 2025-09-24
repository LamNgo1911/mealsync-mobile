import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Header } from "../../components/Header";
import { getRecipeById, type Ingredient } from "../../data/recipes";
import "../../global.css";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const recipe = getRecipeById(id as string);

  // Initialize ingredients state when recipe loads
  useEffect(() => {
    if (recipe) {
      setIngredients(recipe.ingredients);
    }
  }, [recipe]);

  const toggleIngredient = (ingredientId: string) => {
    setIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.id === ingredientId
          ? { ...ingredient, checked: !ingredient.checked }
          : ingredient
      )
    );
  };

  const saveRecipe = () => {
    // TODO: Implement save functionality
    console.log("Recipe saved!");
  };

  if (!recipe) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-lg text-neutral-500">Recipe not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Header title={recipe.title || "Recipe"} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Recipe Image */}
        <Image
          source={recipe.image}
          className="w-full h-64"
          contentFit="cover"
        />

        {/* Recipe Content */}
        <View className="p-6">
          {/* Description */}
          <Text className="text-lg text-neutral-600 mb-6 leading-6">
            {recipe.description}
          </Text>

          {/* Ingredients Section */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-neutral-900 mb-4">
              Ingredients
            </Text>
            <View className="space-y-3">
              {ingredients.map((ingredient) => (
                <Pressable
                  key={ingredient.id}
                  className="flex-row items-center py-2"
                  onPress={() => toggleIngredient(ingredient.id)}
                >
                  <View
                    className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
                      ingredient.checked
                        ? "bg-primary-500 border-primary-500"
                        : "border-neutral-300"
                    }`}
                  >
                    {ingredient.checked && (
                      <Text className="text-white text-sm font-bold">✓</Text>
                    )}
                  </View>
                  <Text
                    className={`text-lg ${
                      ingredient.checked
                        ? "text-neutral-500 line-through"
                        : "text-neutral-900"
                    }`}
                  >
                    {ingredient.text}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Instructions Section */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-neutral-900 mb-4">
              Instructions
            </Text>
            <View className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <View key={index} className="flex-row">
                  <View className="w-8 h-8 bg-primary-500 rounded-full items-center justify-center mr-4 flex-shrink-0">
                    <Text className="text-white font-bold text-sm">
                      {index + 1}
                    </Text>
                  </View>
                  <Text className="text-lg text-neutral-700 flex-1 leading-6">
                    {typeof instruction === "string"
                      ? instruction
                      : instruction.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="p-6 bg-white border-t border-neutral-200">
        <Pressable
          className="bg-primary-500 rounded-xl p-4 items-center shadow-sm"
          onPress={saveRecipe}
        >
          <Text className="text-white font-semibold text-lg">Save Recipe</Text>
        </Pressable>
      </View>
    </View>
  );
}
