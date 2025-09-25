import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Header } from "../../components/Header";
import {
  BorderRadius,
  Fonts,
  FontSizes,
  FontWeights,
  Spacing,
} from "../../constants/theme";
import { useTheme } from "../../context/ThemeContext";
import { getRecipeById, RecipeIngredient } from "../../data/recipes";

// Client-side state for checkboxes
type IngredientState = RecipeIngredient & { checked: boolean };

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const { colors } = useTheme();
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
    // TODO: Implement actual save functionality
    Alert.alert(
      "Recipe Saved",
      "This recipe has been added to your collection."
    );
  };

  if (!recipe) {
    return (
      <View
        style={[styles.notFoundContainer, { backgroundColor: colors.white }]}
      >
        <Text style={[styles.notFoundText, { color: colors.neutral[500] }]}>
          Recipe not found
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Header title={recipe.name || "Recipe"} showBackButton />

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
          <Text style={[styles.description, { color: colors.neutral[600] }]}>
            {recipe.description}
          </Text>

          {/* Ingredients Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.neutral[900] }]}>
              Ingredients
            </Text>
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
                      { borderColor: colors.neutral[300] },
                      ingredient.checked && {
                        backgroundColor: colors.primary[500],
                        borderColor: colors.primary[500],
                      },
                    ]}
                  >
                    {ingredient.checked && (
                      <Text
                        style={[styles.checkboxCheck, { color: colors.white }]}
                      >
                        ✓
                      </Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.ingredientText,
                      { color: colors.neutral[900] },
                      ingredient.checked && {
                        color: colors.neutral[500],
                        textDecorationLine: "line-through",
                      },
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
            <Text style={[styles.sectionTitle, { color: colors.neutral[900] }]}>
              Instructions
            </Text>
            <View style={{ gap: Spacing[4] }}>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionRow}>
                  <View
                    style={[
                      styles.instructionStep,
                      { backgroundColor: colors.primary[500] },
                    ]}
                  >
                    <Text
                      style={[
                        styles.instructionStepText,
                        { color: colors.white },
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.instructionText,
                      { color: colors.neutral[700] },
                    ]}
                  >
                    {instruction}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.white,
            borderColor: colors.neutral[200],
          },
        ]}
      >
        <Pressable
          style={[
            styles.saveButton,
            { backgroundColor: colors.primary[500], shadowColor: colors.black },
          ]}
          onPress={saveRecipe}
        >
          <Text style={[styles.saveButtonText, { color: colors.white }]}>
            Save Recipe
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.regular,
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
    fontFamily: Fonts.regular,
    marginBottom: Spacing[6],
    lineHeight: 24,
  },
  section: {
    marginBottom: Spacing[8],
  },
  sectionTitle: {
    fontSize: FontSizes["2xl"],
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
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
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {},
  checkboxCheck: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
  },
  ingredientText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.regular,
  },
  ingredientTextChecked: {},
  instructionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing[4],
  },
  instructionStep: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  instructionStepText: {
    fontWeight: FontWeights.bold,
    fontSize: FontSizes.sm,
    fontFamily: Fonts.bold,
  },
  instructionText: {
    fontSize: FontSizes.lg,
    fontFamily: Fonts.regular,
    flex: 1,
    lineHeight: 24,
  },
  footer: {
    padding: Spacing[6],
    borderTopWidth: 1,
  },
  saveButton: {
    borderRadius: BorderRadius.xl,
    padding: Spacing[4],
    alignItems: "center",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  saveButtonText: {
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.lg,
  },
});
