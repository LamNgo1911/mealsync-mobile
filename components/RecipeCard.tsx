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

export type RecipeCardProps = {
  id: string;
  name: string;
  imageUrl: any;
  rating?: number;
  tags?: string[];
  onPress?: (id: string) => void;
};

function RecipeCardComponent({
  id,
  name,
  imageUrl,
  rating,
  tags,
  onPress,
}: RecipeCardProps) {
  const { colors } = useTheme();
  const source = typeof imageUrl === "string" ? { uri: imageUrl } : imageUrl;
  return (
    <Pressable
      onPress={() => onPress?.(id)}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={name}
    >
      <View style={[styles.imageContainer, { backgroundColor: colors.white }]}>
        <Image
          source={source}
          contentFit="cover"
          style={styles.image}
          transition={150}
        />
      </View>
      <Text
        style={[styles.title, { color: colors.neutral[900] }]}
        numberOfLines={2}
      >
        {name}
      </Text>
      <View style={styles.detailsContainer}>
        {typeof rating === "number" && (
          <Text style={[styles.rating, { color: colors.neutral[700] }]}>
            {rating.toFixed(1)}
          </Text>
        )}
        {tags && tags.length > 0 ? (
          <Text style={[styles.tag, { color: colors.neutral[500] }]}>
            • {tags[0]}
          </Text>
        ) : null}
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
  },
  rating: {
    fontSize: FontSizes.sm,
    fontFamily: Fonts.medium,
    marginRight: Spacing[2],
  },
  tag: {
    fontSize: FontSizes.base,
    fontFamily: Fonts.regular,
  },
});
