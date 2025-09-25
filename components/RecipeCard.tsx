import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  BorderRadius,
  Colors,
  Fonts,
  FontSizes,
  FontWeights,
  Spacing,
} from "../constants/theme";

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
  const source = typeof imageUrl === "string" ? { uri: imageUrl } : imageUrl;
  return (
    <Pressable
      onPress={() => onPress?.(id)}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={name}
    >
      <View style={styles.imageContainer}>
        <Image
          source={source}
          contentFit="cover"
          style={styles.image}
          transition={150}
        />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {name}
      </Text>
      <View style={styles.detailsContainer}>
        {typeof rating === "number" && (
          <Text style={styles.rating}>{rating.toFixed(1)}</Text>
        )}
        {tags && tags.length > 0 ? (
          <Text style={styles.tag}>• {tags[0]}</Text>
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
    backgroundColor: Colors.white,
  },
  image: {
    width: "100%",
    height: 192,
  },
  title: {
    marginTop: Spacing[3],
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    fontFamily: Fonts.semibold,
    color: Colors.neutral[900],
  },
  detailsContainer: {
    marginTop: Spacing[2],
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: FontSizes.base,
    fontFamily: Fonts.medium,
    color: Colors.neutral[700],
    marginRight: Spacing[2],
  },
  tag: {
    fontSize: FontSizes.base,
    fontFamily: Fonts.regular,
    color: Colors.neutral[500],
  },
});
