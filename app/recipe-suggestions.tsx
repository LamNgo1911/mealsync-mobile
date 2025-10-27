import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Header } from "../components/Header";
import { RecipeCard } from "../components/RecipeCard";
import { BorderRadius, Fonts, FontSizes, Spacing } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";
import { Recipe } from "../types/recipe";

export default function RecipeSuggestionsScreen() {
  const router = useRouter();
  const { ingredients, recipes: recipesParam } = useLocalSearchParams<{
    ingredients?: string;
    recipes?: string;
  }>();
  const { colors } = useTheme();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const detectedIngredients = ingredients ? ingredients.split(", ") : [];

  useEffect(() => {
    // Parse recipes from params if available
    if (recipesParam) {
      try {
        const parsedRecipes = JSON.parse(recipesParam);
        setRecipes(parsedRecipes);
        setLoading(false);
      } catch (error) {
        console.error("Failed to parse recipes:", error);
        setRecipes([]);
        setLoading(false);
      }
    } else {
      // No recipes provided
      setRecipes([]);
      setLoading(false);
    }
  }, [recipesParam]);

  return (
    <View style={[styles.container, { backgroundColor: colors.white }]}>
      <Header title="Recipe Suggestions" showBackButton />
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: colors.neutral[800] }]}>
          Based on your ingredients:
        </Text>
        <View style={styles.ingredientsContainer}>
          {detectedIngredients.length > 0 ? (
            detectedIngredients.map((item, index) => (
              <View
                key={index}
                style={[styles.tag, { backgroundColor: colors.primary[100] }]}
              >
                <Text style={[styles.tagText, { color: colors.primary[800] }]}>
                  {item}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: colors.neutral[500] }]}>
              No ingredients detected.
            </Text>
          )}
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary[500]}
            style={styles.loader}
          />
        ) : recipes.length > 0 ? (
          <FlatList
            data={recipes}
            renderItem={({ item, index }) => (
              <View
                style={{
                  marginBottom: index === recipes.length - 1 ? 0 : Spacing[6],
                }}
              >
                <RecipeCard
                  recipe={item}
                  onPress={(id) =>
                    router.push({ pathname: "/recipe/[id]", params: { id } })
                  }
                />
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.neutral[500] }]}>
              No recipes found. Try scanning different ingredients.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Spacing[4],
  },
  title: {
    fontFamily: Fonts.semibold,
    fontSize: FontSizes.lg,
    marginBottom: Spacing[3],
  },
  ingredientsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing[2],
    marginBottom: Spacing[6],
  },
  tag: {
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.full,
  },
  tagText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.sm,
  },
  emptyText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.base,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing[6],
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: Spacing[6],
  },
});
