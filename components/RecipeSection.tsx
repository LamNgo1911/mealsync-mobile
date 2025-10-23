import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import {
  BorderRadius,
  Fonts,
  FontSizes,
  FontWeights,
  Spacing,
} from "../constants/theme";
import { useTheme } from "../context/ThemeContext";
import { Recipe } from "../types/recipe";
import { RecipeCard } from "./RecipeCard";
import { SkeletonCard } from "./SkeletonCard";

interface RecipeSectionProps {
  title: string;
  recipes: Recipe[];
  loading?: boolean;
  onRecipePress?: (recipe: Recipe) => void;
  layout?: "list" | "grid";
}

export function RecipeSection({
  title,
  recipes,
  loading = false,
  onRecipePress,
  layout = "list",
}: RecipeSectionProps) {
  const router = useRouter();
  const { colors } = useTheme();

  const handleRecipePress = (recipe: Recipe) => {
    console.log("Pressed recipe:", recipe);
    if (onRecipePress) {
      onRecipePress(recipe);
    } else {
      router.push({
        pathname: "/recipe/[id]",
        params: { id: recipe.id },
      });
    }
  };

  if (layout === "grid") {
    const renderGridItems = () => {
      if (loading) {
        return Array.from({ length: 4 }).map((_, index) => (
          <View key={`skeleton-${index}`} style={styles.gridItem}>
            <SkeletonCard />
          </View>
        ));
      }

      return recipes.map((item) => (
        <View key={item.id} style={styles.gridItem}>
          <RecipeCard recipe={item} onPress={() => handleRecipePress(item)} />
        </View>
      ));
    };

    return (
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.neutral[900] }]}>
          {title}
        </Text>
        <View style={styles.gridContainer}>{renderGridItems()}</View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.neutral[900] }]}>
        {title}
      </Text>

      {loading ? (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3].map((index) => (
            <View key={index} style={styles.skeletonItem}>
              <SkeletonCard />
              <View style={styles.skeletonTextContainer}>
                <View
                  style={[
                    styles.skeletonText,
                    { backgroundColor: colors.neutral[200] },
                  ]}
                />
                <View
                  style={[
                    styles.skeletonTextShort,
                    { backgroundColor: colors.neutral[200] },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          horizontal
          data={recipes}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Spacing[6] }}
          renderItem={({ item }) => (
            <View style={styles.recipeCardContainer}>
              <RecipeCard
                recipe={item}
                onPress={() => handleRecipePress(item)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: FontSizes["2xl"],
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
    marginBottom: Spacing[4],
    paddingHorizontal: Spacing[6],
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[6],
    rowGap: Spacing[6],
  },
  gridItem: {
    width: "48%",
  },
  skeletonContainer: {
    flexDirection: "row",
    paddingHorizontal: Spacing[6],
  },
  skeletonItem: {
    marginRight: Spacing[4],
    width: 192,
  },
  skeletonTextContainer: {
    marginTop: Spacing[3],
  },
  skeletonText: {
    height: 20,
    width: "80%",
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing[2],
  },
  skeletonTextShort: {
    height: 16,
    width: "60%",
    borderRadius: BorderRadius.sm,
  },
  recipeCardContainer: {
    marginRight: Spacing[4],
    width: 192,
  },
});
