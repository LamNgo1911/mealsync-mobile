import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  BorderRadius,
  Colors,
  FontSizes,
  FontWeights,
  Spacing,
} from "../constants/theme";

export type RecipeCardProps = {
  id: string;
  title: string;
  image: any;
  rating?: number;
  tag?: string;
  onPress?: (id: string) => void;
};

function RecipeCardComponent({
  id,
  title,
  image,
  rating,
  tag,
  onPress,
}: RecipeCardProps) {
  const source = typeof image === "string" ? { uri: image } : image;
  return (
    <Pressable
      onPress={() => onPress?.(id)}
      style={styles.container}
      accessibilityRole="button"
      accessibilityLabel={title}
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
        {title}
      </Text>
      <View style={styles.detailsContainer}>
        {typeof rating === "number" && (
          <Text style={styles.rating}>{rating.toFixed(1)}</Text>
        )}
        {tag ? <Text style={styles.tag}>• {tag}</Text> : null}
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
    color: Colors.neutral[900],
  },
  detailsContainer: {
    marginTop: Spacing[2],
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: FontSizes.base,
    color: Colors.neutral[700],
    marginRight: Spacing[2],
  },
  tag: {
    fontSize: FontSizes.base,
    color: Colors.neutral[500],
  },
});
