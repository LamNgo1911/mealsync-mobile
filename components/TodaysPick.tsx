import { useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  BorderRadius,
  Fonts,
  FontSizes,
  FontWeights,
  Spacing,
} from "../constants/theme";
import { useTheme } from "../context/ThemeContext";
import { Recipe } from "../types/recipe";

interface TodaysPickProps {
  recipes: Recipe[];
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - Spacing[6] * 2;

export function TodaysPick({ recipes = [] }: TodaysPickProps) {
  const router = useRouter();
  const { colors } = useTheme();

  const handlePress = (recipeId: string) => {
    router.push({
      pathname: "/recipe/[id]",
      params: { id: recipeId },
    });
  };

  // Don't render if no recipes
  if (!recipes || recipes.length === 0) {
    return null;
  }

  const renderRecipeCard = (recipe: Recipe) => (
    <Pressable
      key={recipe.id}
      onPress={() => handlePress(recipe.id)}
      style={({ pressed }) => [
        styles.recipeCard,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.contentContainer}>
        <Text
          style={[styles.recipeName, { color: colors.neutral[900] }]}
          numberOfLines={2}
        >
          {recipe.name}
        </Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Text style={[styles.metaIcon, { color: colors.primary[500] }]}>
              🕐
            </Text>
            <Text style={[styles.metaText, { color: colors.neutral[700] }]}>
              {recipe.totalTime} min
            </Text>
          </View>

          {recipe.calories && (
            <View style={styles.metaItem}>
              <Text style={[styles.metaIcon, { color: colors.primary[500] }]}>
                🔥
              </Text>
              <Text style={[styles.metaText, { color: colors.neutral[700] }]}>
                {recipe.calories} cal
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.block,
          {
            backgroundColor: colors.white,
            borderColor: colors.neutral[200],
          },
        ]}
      >
        <View style={styles.headerContainer}>
          <Text style={[styles.sectionTitle, { color: colors.neutral[900] }]}>
            Today's Pick
          </Text>
          <Text
            style={[styles.sectionSubtitle, { color: colors.neutral[600] }]}
          >
            Specially selected just for you
          </Text>
        </View>

        {recipes.length < 2 ? (
          <View style={styles.emptyState}>
            <Text
              style={[styles.emptyStateIcon, { color: colors.neutral[400] }]}
            >
              🍽️
            </Text>
            <Text
              style={[styles.emptyStateText, { color: colors.neutral[600] }]}
            >
              No recipes yet
            </Text>
            <Text
              style={[styles.emptyStateSubtext, { color: colors.neutral[500] }]}
            >
              Start exploring to discover delicious meals
            </Text>
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {recipes.slice(0, 2).map((recipe) => renderRecipeCard(recipe))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing[2],
  },
  block: {
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
  headerContainer: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    marginBottom: Spacing[4],
    alignItems: "flex-start",
  },
  sectionTitle: {
    fontSize: FontSizes["xl"],
    fontWeight: FontWeights.bold,
    fontFamily: Fonts.bold,
    marginBottom: Spacing[1],
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.regular,
    textAlign: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[4],
    rowGap: Spacing[4],
  },
  recipeCard: {
    width: "48%",
  },
  cardPressed: {
    opacity: 0.9,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 140,
    marginBottom: Spacing[3],
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: BorderRadius.xl,
  },
  contentContainer: {
    alignItems: "flex-start",
  },
  recipeName: {
    fontSize: FontSizes.base,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
    marginBottom: Spacing[2],
    textAlign: "left",
  },
  metaContainer: {
    flexDirection: "row",
    gap: Spacing[3],
    alignItems: "center",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaIcon: {
    fontSize: FontSizes.xs,
    marginRight: Spacing[1],
  },
  metaText: {
    fontSize: FontSizes.xs,
    fontFamily: Fonts.regular,
  },
  emptyState: {
    paddingVertical: Spacing[10],
    paddingHorizontal: Spacing[6],
    alignItems: "center",
    justifyContent: "center",
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
