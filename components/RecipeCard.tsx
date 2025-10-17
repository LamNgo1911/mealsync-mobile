import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  BorderRadius,
  Fonts,
  FontSizes,
  FontWeights,
  Spacing,
} from "../constants/theme";
import { useTheme } from "../context/ThemeContext";
import { Recipe } from "../types/recipe";

export type RecipeCardProps = {
  recipe: Recipe;
  onPress?: (id: string) => void;
};

function RecipeCardComponent({ recipe, onPress }: RecipeCardProps) {
  const { colors } = useTheme();
  const source =
    typeof recipe.imageUrl === "string"
      ? { uri: recipe.imageUrl }
      : recipe.imageUrl;
  return (
    <Pressable
      onPress={() => onPress?.(recipe.id)}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={recipe.name}
    >
      <View style={[styles.imageContainer, { backgroundColor: colors.white }]}>
        <Image
          source={source}
          contentFit="cover"
          style={[styles.image, { backgroundColor: colors.neutral[100] }]}
          transition={150}
        />
      </View>
      <Text
        style={[styles.title, { color: colors.neutral[900] }]}
        numberOfLines={2}
      >
        {recipe.name}
      </Text>
      <View style={styles.detailsContainer}>
        <Text style={[styles.detailText, { color: colors.neutral[500] }]}>
          {recipe.cuisine}
        </Text>
      </View>
    </Pressable>
  );
}

export const RecipeCard = memo(RecipeCardComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    borderRadius: BorderRadius["2xl"],
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 192,
  },
  title: {
    marginTop: Spacing[3],
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
  },
  detailsContainer: {
    marginTop: Spacing[2],
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
  },
  detailText: {
    fontSize: FontSizes.base,
    fontFamily: Fonts.regular,
  },
});
