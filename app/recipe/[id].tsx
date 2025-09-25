import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Header } from "../../components/Header";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "../../constants/theme";
import { getRecipeById, RecipeIngredient } from "../../data/recipes";

// Client-side state for checkboxes
type IngredientState = RecipeIngredient & { checked: boolean };

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const [ingredients, setIngredients] = useState<IngredientState[]>([]);

  const recipe = getRecipeById(id as string);

  // Initialize ingredients state when recipe loads
  useState(() => {
    if (recipe) {
      setIngredients(
        recipe.ingredients.map((ing) => ({ ...ing, checked: false }))
      );
    }
  });

  const toggleIngredient = (ingredientName: string) => {
    setIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.name === ingredientName
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
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>Recipe not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={recipe.name || "Recipe"} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Recipe Image */}
        <Image
          source={recipe.imageUrl}
          style={styles.image}
          contentFit="cover"
        />

        {/* Recipe Content */}
        <View style={styles.contentContainer}>
          {/* Description */}
          <Text style={styles.description}>{recipe.description}</Text>

          {/* Ingredients Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View>
              {ingredients.map((ingredient) => (
                <Pressable
                  key={ingredient.name}
                  style={styles.ingredientRow}
                  onPress={() => toggleIngredient(ingredient.name)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      ingredient.checked && styles.checkboxChecked,
                    ]}
                  >
                    {ingredient.checked && (
                      <Text style={styles.checkboxCheck}>✓</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.ingredientText,
                      ingredient.checked && styles.ingredientTextChecked,
                    ]}
                  >
                    {`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Instructions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={{ gap: Spacing[4] }}>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionRow}>
                  <View style={styles.instructionStep}>
                    <Text style={styles.instructionStepText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Pressable style={styles.saveButton} onPress={saveRecipe}>
          <Text style={styles.saveButtonText}>Save Recipe</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  notFoundContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    fontSize: FontSizes.lg,
    color: Colors.neutral[500],
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 256,
  },
  contentContainer: {
    padding: Spacing[6],
  },
  description: {
    fontSize: FontSizes.lg,
    color: Colors.neutral[600],
    marginBottom: Spacing[6],
    lineHeight: 24,
  },
  section: {
    marginBottom: Spacing[8],
  },
  sectionTitle: {
    fontSize: FontSizes["2xl"],
    fontWeight: FontWeights.bold,
    color: Colors.neutral[900],
    marginBottom: Spacing[4],
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing[2],
    gap: Spacing[3],
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.neutral[300],
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  checkboxCheck: {
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
  },
  ingredientText: {
    fontSize: FontSizes.lg,
    color: Colors.neutral[900],
  },
  ingredientTextChecked: {
    color: Colors.neutral[500],
    textDecorationLine: "line-through",
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[4],
  },
  instructionStep: {
    width: 32,
    height: 32,
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  instructionStepText: {
    color: Colors.white,
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.sm,
  },
  instructionText: {
    fontSize: FontSizes.lg,
    color: Colors.neutral[700],
    flex: 1,
    lineHeight: 24,
  },
  footer: {
    padding: Spacing[6],
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderColor: Colors.neutral[200],
  },
  saveButton: {
    backgroundColor: Colors.primary[500],
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  saveButtonText: {
    color: Colors.white,
    fontWeight: FontWeights.semibold,
    fontSize: FontSizes.lg,
  },
});
