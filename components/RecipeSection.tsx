import { useRouter } from "expo-router";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
    // Show up to 4 recipes
    const displayRecipes = recipes.slice(0, 4);

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.gridBlock,
            {
              backgroundColor: colors.white,
              borderColor: colors.neutral[200],
            },
          ]}
        >
          <View style={styles.gridHeader}>
            <Text style={[styles.title, { color: colors.neutral[900] }]}>
              {title}
            </Text>
            <Pressable onPress={() => console.log("View all pressed")}>
              <Text style={[styles.viewAllText, { color: colors.primary[500] }]}>
                View All
              </Text>
            </Pressable>
          </View>
          {loading ? (
            <ScrollView
              style={styles.gridScrollView}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              <View style={styles.gridContainer}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <View key={`skeleton-${index}`} style={styles.gridItem}>
                    <SkeletonCard />
                  </View>
                ))}
              </View>
            </ScrollView>
          ) : displayRecipes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateIcon, { color: colors.neutral[400] }]}>
                📝
              </Text>
              <Text style={[styles.emptyStateText, { color: colors.neutral[600] }]}>
                No recipes found
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: colors.neutral[500] }]}>
                Create your first recipe to get started
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.gridScrollView}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              <View style={styles.gridContainer}>
                {displayRecipes.map((item) => (
                  <View key={item.id} style={styles.gridItem}>
                    <RecipeCard
                      recipe={item}
                      onPress={() => handleRecipePress(item)}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <Text style={[styles.listTitle, { color: colors.neutral[900] }]}>
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
  container: {
    paddingVertical: Spacing[4],
  },
  listContainer: {},
  title: {
    fontSize: FontSizes["xl"],
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
  },
  listTitle: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
    marginBottom: Spacing[4],
    paddingHorizontal: Spacing[6],
  },
  gridBlock: {
    marginHorizontal: Spacing[4],
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gridHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    marginBottom: Spacing[4],
  },
  viewAllText: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
  },
  gridScrollView: {
    maxHeight: 280, // Show 1 row (2 recipes), scroll to see the next row
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[4],
    rowGap: Spacing[4],
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
  emptyState: {
    paddingVertical: Spacing[10],
    paddingHorizontal: Spacing[6],
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: Spacing[3],
  },
  emptyStateText: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
    marginBottom: Spacing[2],
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
});
